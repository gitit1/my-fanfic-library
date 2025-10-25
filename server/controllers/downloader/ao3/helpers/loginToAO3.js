// AO3 Login via ao3Request helpers
const clc = require('cli-color');
const cheerio = require('cheerio');
const { ao3Request: AO3 } = require('../../../../helpers/index');
const ao3UserKeys = require('../../../../config/keys');

const BASE_URL = 'https://archiveofourown.org';
const LOGIN_PAGE = `${BASE_URL}/users/login`;
const MAX_RETRIES = 4;

exports.loginToAO3 = (jar) => login(jar);

async function login(jar, attempt = 1) {
  console.log(clc.bgGreenBright(`[ao3 controller] loginToAO3() attempt ${attempt}/${MAX_RETRIES}`));
  const client = AO3.createAo3Request(jar);

  try {
    const getBody = await doGet(client, { url: LOGIN_PAGE });
    if (AO3.isLoggedIn(getBody)) {
      console.log(clc.green('✅ AO3: already logged in'));
      return true;
    }

    const { actionUrl, authenticityToken, utf8Hidden } = extractLoginForm(getBody);
    if (!authenticityToken || !actionUrl) throw new Error('Cannot extract login form/action.');

    const loginDetails = {
      ...(utf8Hidden ? { utf8: utf8Hidden } : {}),
      authenticity_token: authenticityToken,
      'user[login]': ao3UserKeys.ao3User,
      'user[password]': ao3UserKeys.ao3Password,
      commit: 'Log in',
    };

    const postBody = await doPost(client, { url: actionUrl, form: loginDetails });
    if (AO3.isLoggedIn(postBody)) {
      console.log(clc.green('✅ AO3: logged in successfully'));
      return true;
    }

    if (needsOtp(postBody)) {
      if (!ao3UserKeys.ao3Otp) throw new Error('OTP required but missing.');
      console.log(clc.yellow('AO3: OTP required — submitting code...'));
      await submitOtpFlow(client, postBody);
      console.log(clc.green('✅ AO3: logged in successfully (via OTP)')); // ✅
      return true;
    }

    if (/Invalid authenticity token/i.test(postBody)) {
      throw new Error('Invalid authenticity token.');
    }

    if (AO3.isWafChallenge(postBody)) {
      await AO3.backoff(attempt, 'WAF');
      return login(jar, attempt + 1);
    }

    throw new Error('AO3 login failed.');
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      await AO3.backoff(attempt, err.message);
      return login(jar, attempt + 1);
    }
    throw err;
  }
}

function doGet(client, opts) { return new Promise((resolve, reject) => client.get(opts, (e, r, b) => e ? reject(e) : resolve(b))); }
function doPost(client, opts) { return new Promise((resolve, reject) => client.post(opts, (e, r, b) => e ? reject(e) : resolve(b))); }

function needsOtp(html) {
  if (!html) return false;
  const $ = cheerio.load(html);
  return $('input[name="user[otp_attempt]"]').length > 0 || /Two[- ]Factor|One[- ]Time|OTP/i.test(html);
}

function extractLoginForm(html) {
  const $ = cheerio.load(html);
  const form = $('#new_user');
  const action = form.attr('action') || '/user_sessions';
  const actionUrl = new URL(action, 'https://archiveofourown.org').href;
  const authenticityToken = form.find('input[name="authenticity_token"]').val() || $('meta[name="csrf-token"]').attr('content') || '';
  const utf8Hidden = form.find('input[name="utf8"]').val() || null;
  return { actionUrl, authenticityToken, utf8Hidden };
}

async function submitOtpFlow(client, html) {
  const $ = cheerio.load(html);
  const form = $('form').filter((_, el) => $(el).find('input[name="user[otp_attempt]"]').length).first() || $('#new_user');
  const action = form.attr('action') || '/user_sessions';
  const postUrl = new URL(action, 'https://archiveofourown.org').href;
  const token = form.find('input[name="authenticity_token"]').val() || $('meta[name="csrf-token"]').attr('content') || '';
  const details = { authenticity_token: token, 'user[otp_attempt]': ao3UserKeys.ao3Otp, commit: 'Verify' };
  const body = await new Promise((res, rej) => client.post({ url: postUrl, form: details }, (e, r, b) => e ? rej(e) : res(b)));
  if (!AO3.isLoggedIn(body)) throw new Error('OTP verification failed.');
  console.log(clc.green('✅ AO3: logged in successfully (via OTP)'));
}
