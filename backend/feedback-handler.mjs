const ALLOWED_ORIGINS = new Set(['https://defaultsearch.online', 'http://127.0.0.1:8765', 'http://localhost:8765']);
const FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSelwO0_0e_gSuOZLs2WsVx0Yzso8UAnmI7nTHda1OdT9Cfbpw/formResponse?hl=en';
const REASONS = {
  'not-working': 'Did not work as expected',
  'unexpected-redirects': 'Did not like search redirects',
  'missing-engine': 'Search engine not available',
  'no-longer-needed': 'No longer needed', other: 'Other'
};
// Best-effort per-isolate abuse limit; no visitor details are stored durably.
const recent = new Map();
export async function handle(request, upstream = fetch) {
  const path = new URL(request.url).pathname;
  if (request.method === 'GET' && path === '/health') return Response.json({ok:true});
  const origin = request.headers.get('Origin');
  const headers = {'Content-Type':'application/json', 'Cache-Control':'no-store', 'Vary':'Origin'};
  if (ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  const reply = (status, data) => new Response(JSON.stringify(data), {status, headers});
  if (path !== '/feedback') return reply(404, {ok:false});
  if (!ALLOWED_ORIGINS.has(origin)) return reply(403, {ok:false});
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers:{...headers,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
  if (request.method !== 'POST') return reply(405,{ok:false});
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415,{ok:false});
  if (Number(request.headers.get('Content-Length')) > 24000) return reply(413,{ok:false});
  let input;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return reply(413,{ok:false});
    input = JSON.parse(raw);
  } catch { return reply(400,{ok:false}); }
  if (!input || typeof input !== 'object') return reply(400,{ok:false});
  // A honeypot never reports successful delivery.
  if (input.website) return reply(400,{ok:false});
  const reason = input.reason || '';
  if (typeof reason !== 'string' || (reason && !Object.hasOwn(REASONS, reason))) return reply(400,{ok:false});
  if (typeof input.message !== 'string' || input.message.length > 4000) return reply(400,{ok:false});
  const message = input.message.trim();
  if (!reason && !message) return reply(400,{ok:false});
  const now = Date.now();
  for (const [key, value] of recent) if (now - value.time >= 60000) recent.delete(key);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) {
    const entry = recent.get(ip) || {time:now,count:0};
    if (entry.count >= 5) return reply(429,{ok:false});
    entry.count++; recent.set(ip,entry);
  }
  const version = typeof input.version === 'string' && /^\d+(\.\d+){0,3}$/.test(input.version) ? input.version : 'not supplied';
  const language = input.language === 'ru' ? 'ru' : 'en';
  const text = '[Set Default Search Engine] Uninstall feedback\n' +
    'Product: Set Default Search Engine\nSource: defaultsearch.online/feedback/\n' +
    `Reason: ${REASONS[reason] || 'not supplied'}\nComment: ${message || '(no comment)'}\nExtension version: ${version}\nLanguage: ${language}`;
  try {
    const response = await upstream(FORM, {
      method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({'entry.440991757':text}).toString(),
      signal:AbortSignal.timeout(12000), redirect:'follow'
    });
    if (!response.ok) return reply(502,{ok:false});
    const confirmation = await response.text();
    // A 200 can be a validation/sign-in page: require Google's recorded-response confirmation.
    if (!/Your response has been recorded\./i.test(confirmation)) return reply(502,{ok:false});
    return reply(200,{ok:true});
  } catch { return reply(502,{ok:false}); }
}
export default {fetch(request) {return handle(request);}};
