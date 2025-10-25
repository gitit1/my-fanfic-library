// server/controllers/downloader/ao3/login.js
const clc = require('cli-color');
const cheerio = require('cheerio');
const { ao3Request: AO3 } = require('../../../helpers'); // <-- via helpers index
const ao3UserKeys = require('../../../../config/keys');

const BASE_URL = 'https://archiveofourown.org';
const LOGIN_PAGE = `${BASE_URL}/users/login`;
const MAX_RETRIES = 4;

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

exports.loginToAO3 = (jar) => {
  return login(jar);
};

async function login(jar, attempt = 1) {
  console.log(
    clc.bgGreenBright(
      `[ao3 controller] loginToAO3() attempt ${attempt}/${MAX_RETRIES}`
    )
  );

  const client = AO3.createAo3Request(jar);

  try {
    // GET login page
    const getBody = await doGet(client, { url: LOGIN_PAGE });

    if (AO3.isLoggedIn(getBody)) {
      console.log(clc.green('you are already logged in to AO3'));
      return;
    }

    const { actionUrl, authenticityToken, utf8Hidden } = extractLoginForm(getBody);

    if (!authenticityToken || !actionUrl) {
      throw new Error('Could not extract login form/action or authenticity_token from AO3 login page');
    }

    const loginDetails = {
      ...(utf8Hidden ? { utf8: utf8Hidden } : {}),
      authenticity_token: authenticityToken,
      'user[login]': ao3UserKeys.ao3User,
      'user[password]': ao3UserKeys.ao3Password,
      commit: 'Log in',
    };

    const postBody = await doPost(client, { url: actionUrl, form: loginDetails });

    if (AO3.isLoggedIn(postBody)) {
      console.log(clc.green('logged in successfully to AO3'));
      return;
    }

    if (needsOtp(postBody)) {
      if (!ao3UserKeys.ao3Otp) {
        throw new Error('AO3 requires 2FA (OTP) but ao3UserKeys.ao3Otp is missing.');
      }
      console.log(clc.yellow('OTP required — submitting one-time code...'));
      await submitOtpFlow(client, postBody);
      return;
    }

    if (hasInvalidCsrf(postBody)) {
      throw new Error('Invalid authenticity token — check Origin/Referer/CSRF extraction.');
    }

    // WAF or rate limit
    if (AO3.isWafChallenge(postBody)) {
      await AO3.backoff(attempt, 'WAF challenge detected');
      return login(jar, attempt + 1);
    }

    console.log(clc.red('Login failed — page did not show greeting.'));
    throw new Error('AO3 login failed; check credentials or page structure.');
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.log(
        clc.yellow(
          `Login error on attempt ${attempt}: ${err.message}. Retrying...`
        )
      );
      await AO3.backoff(attempt, err.message);
      return login(jar, attempt + 1);
    }
    console.log(clc.red(`AO3 login failed after ${MAX_RETRIES} attempts.`));
    throw err;
  }
}

function doGet(client, opts) {
  return new Promise((resolve, reject) => {
    client.get(opts, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

function doPost(client, opts) {
  return new Promise((resolve, reject) => {
    client.post(opts, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

function hasInvalidCsrf(html) {
  if (!html) return false;
  return /Invalid authenticity token/i.test(html);
}

function needsOtp(html) {
  if (!html) return false;
  const $ = cheerio.load(html);
  const otpField =
    $('input[name="user[otp_attempt]"]').length > 0 ||
    /Two[- ]Factor|One[- ]Time|OTP/i.test(html);
  return otpField;
}

function extractLoginForm(html) {
  const $ = cheerio.load(html);
  const form = $('#new_user');
  const action = form.attr('action') || '/user_sessions';
  const actionUrl = new URL(action, 'https://archiveofourown.org').href;

  const authenticityToken =
    form.find('input[name="authenticity_token"]').val() ||
    $('meta[name="csrf-token"]').attr('content') ||
    '';

  const utf8Hidden = form.find('input[name="utf8"]').val() || null;

  return { actionUrl, authenticityToken, utf8Hidden };
}

async function submitOtpFlow(client, otpPageHtml) {
  const $ = cheerio.load(otpPageHtml);

  const otpForm =
    $('form')
      .filter((_, el) => $(el).find('input[name="user[otp_attempt]"]').length)
      .first() || $('#new_user');

  const action = otpForm.attr('action') || '/user_sessions';
  const postUrl = new URL(action, 'https://archiveofourown.org').href;

  const token =
    otpForm.find('input[name="authenticity_token"]').val() ||
    $('meta[name="csrf-token"]').attr('content') ||
    '';

  if (!token) {
    throw new Error('Could not extract authenticity_token for OTP step.');
  }

  const details = {
    authenticity_token: token,
    'user[otp_attempt]': ao3UserKeys.ao3Otp,
    commit: 'Verify',
  };

  const body = await new Promise((resolve, reject) => {
    client.post({ url: postUrl, form: details }, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });

  if (AO3.isLoggedIn(body)) {
    console.log(clc.green('logged in successfully to AO3 (via OTP)'));
    return;
  }

  if (AO3.isWafChallenge(body)) {
    throw new Error('Rate-limited/WAF during OTP step.');
  }

  throw new Error('OTP verification failed.');
}
