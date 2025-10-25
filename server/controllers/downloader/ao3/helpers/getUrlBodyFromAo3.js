const clc = require('cli-color');
const cheerio = require('cheerio');
const requestLib = require('request');
const { sleep } = require('../../../helpers/sleep.js');

const BASE_URL = 'https://archiveofourown.org';
const MAX_RETRIES = 4;
const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

exports.getUrlBodyFromAo3 = async (jar, url, log) => {
  return getUrlBody(jar, url, log);
};

async function getUrlBody(jar, url, log, attempt = 1) {
  // לקוח request עם הגדרות נכונות לדפדפן
  const client = requestLib.defaults({
    jar,
    followAllRedirects: true,
    timeout: 20000,
    gzip: true,
  });

  try {
    const { body, statusCode } = await doGet(client, {
      url,
      headers: baseHeaders(url),
    });

    // עומסים/אתגר WAF/Rate-limit
    if (
      statusCode === 429 ||
      statusCode === 503 ||
      isWafChallenge(body) ||
      isRetryLater(body)
    ) {
      await backoffOrThrow(attempt, `Rate-limit/WAF (${statusCode || 'body'})`);
      return getUrlBody(jar, url, log, attempt + 1);
    }

    // אם לא מחוברות — אל תיכנסי ללופ אין-סוף
    if (!isLoggedIn(body)) {
      // לפעמים AO3 מחזיר דף לוגין בלי שגיאה בסטטוס
      throw new Error('AO3 session is not logged in or expired.');
    }

    log && log.info(`getUrlBodyFromAo3: ${url}`);
    console.log('getUrlBodyFromAo3:', url);
    return body;
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.log(
        clc.yellow(
          `getUrlBody error (attempt ${attempt}): ${err.message}. Retrying...`
        )
      );
      await backoffOrThrow(attempt, err.message);
      return getUrlBody(jar, url, log, attempt + 1);
    }
    console.log(clc.red(`getUrlBody failed after ${MAX_RETRIES} attempts.`));
    // שמרי את השגיאה כ-false אם זה מה שמצופה מהקריאות הקיימות
    return false;
  }
}

/* -------------------- helpers -------------------- */

function doGet(client, opts) {
  return new Promise((resolve, reject) => {
    client.get(opts, (err, res, body) => {
      if (err) return reject(err);
      resolve({ body, statusCode: res && res.statusCode });
    });
  });
}

function baseHeaders(referer) {
  return {
    'User-Agent': DEFAULT_UA,
    'Accept-Language': 'en-US,en;q=0.9',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    Referer: referer || BASE_URL,
    Origin: BASE_URL,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  };
}

function isLoggedIn(html) {
  if (!html) return false;
  const $ = cheerio.load(html);
  // פחות שביר מ-class על <body>; AO3 מציג #greeting/Logout כשהסשן תקף
  const hasGreeting = $('#greeting').length > 0;
  const hasLogout = /Log Out|Logout/i.test(html);
  return hasGreeting || hasLogout;
}

function isRetryLater(html) {
  if (!html) return false;
  return /Retry later|Please try again later|temporarily unavailable/i.test(
    html
  );
}

function isWafChallenge(html) {
  if (!html) return false;
  // אינדיקציות שכיחות לאתגר Cloudflare/WAF
  return /cf-|cloudflare|attention\s+required|challenge|ray id/i.test(html);
}

async function backoffOrThrow(attempt, reason) {
  const delayMs = Math.min(60000, 2000 * attempt * attempt); // 2s, 8s, 18s, 32s...
  console.log(clc.yellow(`Backoff ${delayMs}ms. Reason: ${reason || 'unknown'}`));
  await sleep(delayMs);
}
