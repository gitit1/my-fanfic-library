// controllers/ao3/login.js (או הקובץ הרלוונטי אצלך)

const clc = require('cli-color');
const cheerio = require('cheerio');
const requestLib = require('request'); // נשמור עותק מקורי
let request = requestLib;              // ונשתמש בו עם defaults
const { sleep } = require('../../../helpers/sleep.js');
const ao3UserKeys = require('../../../../config/keys');

const BASE_URL = 'https://archiveofourown.org';
const LOGIN_PAGE = `${BASE_URL}/users/login`;
const MAX_RETRIES = 4;
const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

exports.loginToAO3 = (jar) => {
  return login(jar);
};

async function login(jar, attempt = 1) {
  console.log(
    clc.bgGreenBright(
      `[ao3 controller] loginToAO3() attempt ${attempt}/${MAX_RETRIES}`
    )
  );

  // בקשת ברירת מחדל עם עוגיות + עקיבה אחרי רידיירקטים
  request = request.defaults({ jar, followAllRedirects: true, timeout: 20000 });

  try {
    // 1) GET דף הלוגין
    const { body: getBody } = await doGet({
      url: LOGIN_PAGE,
      headers: baseHeaders(LOGIN_PAGE),
    });

    // אם כבר מחוברים
    if (isLoggedIn(getBody)) {
      console.log(clc.green('you are already logged in to AO3'));
      return;
    }

    // 2) חילוץ טופס, action ו-CSRF
    const { actionUrl, authenticityToken, utf8Hidden } =
      extractLoginForm(getBody);

    if (!authenticityToken || !actionUrl) {
      throw new Error(
        'Could not extract login form/action or authenticity_token from AO3 login page'
      );
    }

    // 3) POST של פרטי ההתחברות
    const loginDetails = {
      // Rails לא צריך utf8, אבל אם קיים נשים אותו (לא מזיק)
      ...(utf8Hidden ? { utf8: utf8Hidden } : {}),
      authenticity_token: authenticityToken,
      'user[login]': ao3UserKeys.ao3User,
      'user[password]': ao3UserKeys.ao3Password,
      commit: 'Log in',
      // אם תרצי לשלוח "זכור אותי", ניתן להוסיף: 'user[remember_me]': 1
    };

    const { body: postBody, statusCode } = await doPost({
      url: actionUrl,
      form: loginDetails,
      headers: postHeaders(LOGIN_PAGE),
    });

    // 4) בדיקת תוצאה
    if (isLoggedIn(postBody)) {
      console.log(clc.green('logged in successfully to AO3'));
      return;
    }

    // 4a) ייתכן שנדרש OTP (אימות דו-שלבי)
    if (needsOtp(postBody)) {
      if (!ao3UserKeys.ao3Otp) {
        throw new Error(
          'AO3 requires 2FA (OTP) but ao3UserKeys.ao3Otp is missing.'
        );
      }
      console.log(clc.yellow('OTP required — submitting one-time code...'));
      await submitOtpFlow(postBody, jar);
      return;
    }

    // 4b) טיפול בשגיאות נפוצות
    if (hasInvalidCsrf(postBody)) {
      throw new Error(
        'Invalid authenticity token — check Origin/Referer/CSRF extraction.'
      );
    }

    if (statusCode === 429 || statusCode === 503 || isWafChallenge(postBody)) {
      await backoffOrThrow(attempt, 'Rate-limited or WAF challenge detected');
      return login(jar, attempt + 1);
    }

    // אם הגענו לכאן — הלוגין נכשל ללא סימן מובהק
    // נשמור קצת דיאגנוסטיקה
    console.log(clc.red('Login failed — page did not show greeting.'));
    throw new Error('AO3 login failed; check credentials or page structure.');
  } catch (err) {
    // שגיאות רשת או כללי — ננסה לפי backoff עד מקסימום
    if (attempt < MAX_RETRIES) {
      console.log(
        clc.yellow(
          `Login error on attempt ${attempt}: ${err.message}. Retrying...`
        )
      );
      await backoffOrThrow(attempt, err.message);
      return login(jar, attempt + 1);
    }
    console.log(clc.red(`AO3 login failed after ${MAX_RETRIES} attempts.`));
    throw err;
  }
}

/* ------------------------- Helpers ------------------------- */

function doGet(opts) {
  return new Promise((resolve, reject) => {
    request.get(opts, (err, res, body) => {
      if (err) return reject(err);
      resolve({ res, body, statusCode: res && res.statusCode });
    });
  });
}

function doPost(opts) {
  return new Promise((resolve, reject) => {
    request.post(opts, (err, res, body) => {
      if (err) return reject(err);
      resolve({ res, body, statusCode: res && res.statusCode });
    });
  });
}

function baseHeaders(referer) {
  return {
    'User-Agent': DEFAULT_UA,
    'Accept-Language': 'en-US,en;q=0.9',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    Referer: referer,
  };
}

function postHeaders(referer) {
  return {
    ...baseHeaders(referer),
    Origin: BASE_URL,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

function isLoggedIn(html) {
  if (!html) return false;
  const $ = cheerio.load(html);
  const hasGreeting = $('#greeting').length > 0;
  const hasLogout = /Log Out|Logout/i.test(html);
  return hasGreeting || hasLogout;
}

function hasInvalidCsrf(html) {
  if (!html) return false;
  return /Invalid authenticity token/i.test(html);
}

function isWafChallenge(html) {
  if (!html) return false;
  // חיפוש אינדיקציות ל-Cloudflare/אתגר
  return /cf-|cloudflare|attention required/i.test(html);
}

function needsOtp(html) {
  if (!html) return false;
  const $ = cheerio.load(html);
  // AO3 2FA יופיע שדה כזה או טקסט בסגנון
  const otpField =
    $('input[name="user[otp_attempt]"]').length > 0 ||
    /Two[- ]Factor|One[- ]Time|OTP/i.test(html);
  return otpField;
}

function extractLoginForm(html) {
  const $ = cheerio.load(html);
  const form = $('#new_user');
  const action = form.attr('action') || '/user_sessions';
  const actionUrl = new URL(action, BASE_URL).href;

  // CSRF Token: קודם מה- input, ואם אין — meta[name="csrf-token"] כגיבוי
  const authenticityToken =
    form.find('input[name="authenticity_token"]').val() ||
    $('meta[name="csrf-token"]').attr('content') ||
    '';

  const utf8Hidden = form.find('input[name="utf8"]').val() || null;

  return { actionUrl, authenticityToken, utf8Hidden };
}

async function submitOtpFlow(otpPageHtml, jar) {
  const $ = cheerio.load(otpPageHtml);

  // נחפש את הטופס הרלוונטי (לפעמים זה אותו #new_user, לפעמים טופס OTP נפרד)
  const otpForm =
    $('form')
      .filter((_, el) => $(el).find('input[name="user[otp_attempt]"]').length)
      .first() || $('#new_user');

  const action = otpForm.attr('action') || '/user_sessions';
  const postUrl = new URL(action, BASE_URL).href;

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

  const { body: otpResBody, statusCode } = await doPost({
    url: postUrl,
    form: details,
    headers: postHeaders(LOGIN_PAGE),
  });

  if (isLoggedIn(otpResBody)) {
    console.log(clc.green('logged in successfully to AO3 (via OTP)'));
    return;
  }

  if (statusCode === 429 || statusCode === 503 || isWafChallenge(otpResBody)) {
    throw new Error('Rate-limited/WAF during OTP step.');
  }

  throw new Error('OTP verification failed.');
}

async function backoffOrThrow(attempt, reason) {
  const delayMs = Math.min(60000, 2000 * attempt * attempt); // 2s, 8s, 18s, 32s...
  console.log(
    clc.yellow(`Backoff (${delayMs}ms). Reason: ${reason || 'unknown'}`)
  );
  await sleep(delayMs);
}
