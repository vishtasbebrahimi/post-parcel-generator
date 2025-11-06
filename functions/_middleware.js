export const onRequest = async (ctx, next) => {
  const { request } = ctx;
  // CORS ساده (در صورت نیاز دامنه را محدود کن)
  const headers = {
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  };
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }
  const res = await next();
  // ضمیمه کردن هدرها
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
};
