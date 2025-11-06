// functions/_middleware.js
export async function onRequest(context, next) {
  const { request } = context;
  const origin = request.headers.get('Origin');

  // Preflight
  if (request.method === 'OPTIONS') {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      headers.set('Access-Control-Allow-Origin', '*');
    }
    return new Response(null, { status: 204, headers });
  }

  try {
    const res = await next();

    // پاسخ جدید با هدرهای CORS (به‌جای دست‌کاری مستقیم res.headers)
    const headers = new Headers(res.headers);
    if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      headers.set('Access-Control-Allow-Origin', '*');
    }

    return new Response(res.body, { status: res.status, headers });
  } catch (err) {
    // هندل خطای غیرمنتظره
    return new Response('Internal Error', { status: 500 });
  }
}
