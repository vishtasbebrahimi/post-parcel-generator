export async function onRequestPost({ request, env }) {
  // اگر نیاز داری، اعتبارسنجی کوکی sid را اینجا انجام بده
  const body = await request.json().catch(() => ({}));

  // مثال: کال‌کردن API بیرونی
  const url = `${env.POST_API_BASE.replace(/\/+$/,'')}/parcel/create`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': env.POST_API_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json().catch(() => ({}));
  return new Response(JSON.stringify(data), {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
