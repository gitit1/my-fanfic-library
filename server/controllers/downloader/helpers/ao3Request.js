// server/controllers/downloader/ao3/helpers/ao3Request.js
const requestLib = require('request');
const clc = require('cli-color');
const cheerio = require('cheerio');

const BASE_URL = 'https://archiveofourown.org';
const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MAX_RETRIES_DEFAULT = 4;

function localSleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function baseHeaders(referer) {
  return {
    'User-Agent': DEFAULT_UA,
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Origin': BASE_URL,
    'Referer': referer || BASE_URL,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };
}

function postHeaders(referer) {
  return {
    ...baseHeaders(referer),
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

function normalizeOpts(opts) {
  return typeof opts === 'string' ? { url: opts } : { ...opts };
}

function createAo3Request(jar, defaults = {}) {
  const client = requestLib.defaults({
    jar,
    followAllRedirects: true,
    gzip: true,
    timeout: 20000,
    ...defaults,
    headers: {
      ...(defaults.headers || {}),
      ...baseHeaders((defaults && defaults.referer) || undefined),
    },
  });

  function get(opts, cb) {
    const o = normalizeOpts(opts);
    o.headers = {
      ...baseHeaders((o.headers && o.headers.Referer) || o.referer || o.url),
      ...(o.headers || {}),
    };
    return client.get(o, cb);
  }

  function post(opts, cb) {
    const o = normalizeOpts(opts);
    o.headers = {
      ...postHeaders((o.headers && o.headers.Referer) || o.referer || o.url),
      ...(o.headers || {}),
    };
    return client.post(o, cb);
  }

  return { get, post, _client: client };
}

function isLoggedIn(html) {
  if (!html) return false;
  const $ = cheerio.load(html);
  const hasGreeting = $('#greeting').length > 0;
  const hasLogout = /Log Out|Logout/i.test(html);
  return hasGreeting || hasLogout;
}

function isRetryLater(html) {
  if (!html) return false;
  return /Retry later|Please try again later|temporarily unavailable/i.test(html);
}

function isWafChallenge(html) {
  if (!html) return false;
  return /cf-|cloudflare|attention\s+required|challenge|ray id/i.test(html);
}

async function backoff(attempt, reason, maxMs = 60000) {
  const delayMs = Math.min(maxMs, 2000 * attempt * attempt);
  console.log(clc.yellow(`Backoff ${delayMs}ms. Reason: ${reason || 'unknown'}`));
  await localSleep(delayMs);
}

async function getPage(jar, url, { log, maxRetries = MAX_RETRIES_DEFAULT } = {}) {
  const { get } = createAo3Request(jar);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const body = await new Promise((resolve, reject) => {
        get({ url }, (err, res, body) => {
          if (err) return reject(err);
          const code = res && res.statusCode;
          if (code === 429 || code === 503 || isRetryLater(body) || isWafChallenge(body)) {
            return reject(new Error(`Rate-limit/WAF (${code || 'body'}) on attempt ${attempt}`));
          }
          resolve(body);
        });
      });

      if (!isLoggedIn(body)) {
        throw new Error('AO3 session is not logged in or expired.');
      }

      log && log.info(`getPage OK: ${url}`);
      return body;
    } catch (err) {
      if (attempt === maxRetries) {
        console.log(clc.red(`getPage failed after ${maxRetries} attempts: ${err.message}`));
        throw err;
      }
      await backoff(attempt, err.message);
    }
  }
}

module.exports = {
  BASE_URL,
  createAo3Request,
  baseHeaders,
  postHeaders,
  isLoggedIn,
  isRetryLater,
  isWafChallenge,
  backoff,
  getPage,
};
