// server/functions/ao3Request.js
const requestLib = require('request');
const clc = require('cli-color');
const cheerio = require('cheerio');

const BASE_URL = 'https://archiveofourown.org';
const DEFAULT_UA_POOL = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
];
const MAX_RETRIES_DEFAULT = 6;

function pickUA() {
  const i = Math.floor(Math.random() * DEFAULT_UA_POOL.length);
  return DEFAULT_UA_POOL[i];
}

function sleep(ms){ return new Promise(res=>setTimeout(res, ms)); }

function baseHeaders(referer) {
  return {
    'User-Agent': pickUA(),
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Origin': BASE_URL,
    'Referer': referer || BASE_URL,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'DNT': '1',
    'Accept-Encoding': 'gzip, deflate, br',
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

function injectClearance(jar) {
  const cf = process.env.AO3_CF_CLEARANCE;
  if (cf) {
    try {
      jar.setCookie(`cf_clearance=${cf}; Domain=archiveofourown.org; Path=/; SameSite=Lax; Secure`, BASE_URL);
      console.log(clc.yellow('Injected cf_clearance from env (AO3_CF_CLEARANCE).'));
    } catch (e) {
      console.log(clc.red('Failed to inject cf_clearance cookie:'), e.message);
    }
  }
}

function createAo3Request(jar, defaults = {}) {
  injectClearance(jar);

  const client = requestLib.defaults({
    jar,
    followAllRedirects: true,
    gzip: true,
    timeout: 25000,
    ...defaults,
    headers: {
      ...(defaults.headers || {}),
      ...baseHeaders((defaults && defaults.referer) || undefined),
    },
  });

  function get(opts, cb) {
    const o = typeof opts === 'string' ? { url: opts } : { ...opts };
    o.headers = {
      ...baseHeaders((o.headers && o.headers.Referer) || o.referer || o.url),
      ...(o.headers || {}),
    };
    return client.get(o, cb);
  }

  function post(opts, cb) {
    const o = typeof opts === 'string' ? { url: opts } : { ...opts };
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
  if (!html || typeof html !== 'string') return false;
  return /(cf-|cloudflare|__cf_bm|cf_clearance)/i.test(html)
      || /Attention Required!|Just a moment|Checking your browser before accessing/i.test(html)
      || /Please enable cookies|DDoS protection by|challenge-form/i.test(html)
      || /Ray ID|cf-chl/i.test(html);
}

async function backoff(attempt, reason, maxMs = 120000) {
  const base = 2000 * attempt * attempt;
  const jitter = Math.floor(Math.random() * 1500);
  const delayMs = Math.min(maxMs, base + jitter);
  console.log(clc.yellow(`Backoff ${delayMs}ms. Reason: ${reason || 'unknown'}`));
  await sleep(delayMs);
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
            return reject(new Error(`Rate-limit/WAF (${code || '200'}) on attempt ${attempt}`));
          }
          resolve(body);
        });
      });

      if (!isLoggedIn(body)) {
        throw new Error('AO3 session is not logged in or expired.');
      }

      log && log.info && log.info(`getPage OK: ${url}`);
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
