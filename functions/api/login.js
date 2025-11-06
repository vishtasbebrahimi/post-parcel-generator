export async function onRequestPost({ request, env }) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return json({ ok: false, error: 'Credentials required' }, { status: 400 });
  }
  if (username === env.APP_USERNAME && password === env.APP_PASSWORD) {
    // توکن ساده‌ی سشن؛ اگر خواستی JWT بساز
    const token = cryptoRandom(24, env.SESSION_SECRET);
    const res = json({ ok: true });
    res.headers.append('Set-Cookie', setCookie('sid', token, { maxAge: 60 * 60 * 8 }));
    return res;
  }
  return json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}

function cryptoRandom(len, secret = '') {
  const raw = crypto.getRandomValues(new Uint8Array(len)).join('-') + secret;
  return btoa(raw).replace(/=+$/,'');
}

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    status: init.status || 200
  });

const setCookie = (name, value, opts = {}) => {
  const parts = [`${name}=${value}`];
  if (opts.httpOnly !== false) parts.push('HttpOnly');
  parts.push('Path=/');
  if (opts.secure !== false) parts.push('Secure');
  parts.push('SameSite=Lax');
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join('; ');
};
