export async function onRequestPost() {
  const res = new Response(null, { status: 204 });
  res.headers.append('Set-Cookie', 'sid=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  return res;
}
