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
