// functions/_middleware.js
export async function onRequest(context, next) {
  const { request } = context;
  const { pathname } = new URL(request.url);

  // فقط برای روت‌های API
  if (!pathname.startsWith('/api/')) {
    return next();
  }

  const origin = request.headers.get('Origin') || '*';

  // Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
      }
    });
  }

  const res = await next();
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Credentials', 'true');
  return new Response(res.body, { status: res.status, headers });
}
