// Content Day lead form -> GoHighLevel (AB3 sub-account), plus a server-side
// "QualifiedLead" event to Meta for teams of 10+ so ad delivery learns what a good lead is.
//
// Env vars (Vercel project settings):
//   GHL_TOKEN, GHL_LOCATION_ID          required — without them the route returns 503
//   META_PIXEL_ID, META_CAPI_TOKEN      optional — enables the QualifiedLead event
import crypto from 'crypto';

const QUALIFIED_SIZES = ['10-20', '21-30', '30-plus'];
const sha256 = v => crypto.createHash('sha256').update(v).digest('hex');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const d = req.body || {};
  if (d.website) return res.status(200).json({ ok: true }); // honeypot: bots fill hidden fields

  const required = ['name', 'company', 'email', 'phone', 'type', 'size', 'timing'];
  if (required.some(k => !String(d[k] || '').trim())) return res.status(400).json({ error: 'missing_fields' });

  const { GHL_TOKEN, GHL_LOCATION_ID, META_PIXEL_ID, META_CAPI_TOKEN } = process.env;
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    console.error('LEAD NOT SAVED — GHL not configured', { company: d.company, size: d.size });
    return res.status(503).json({ error: 'not_configured' });
  }

  const qualified = QUALIFIED_SIZES.includes(d.size);
  const tags = ['content-day', `type-${d.type}`, `team-${d.size}`, `timing-${d.timing}`];
  if (qualified) tags.push('qualified');

  const ghl = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GHL_TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      name: d.name.trim(),
      companyName: d.company.trim(),
      email: d.email.trim(),
      phone: d.phone.trim(),
      source: 'Content Day landing page',
      tags,
    }),
  });
  if (!ghl.ok) {
    console.error('LEAD NOT SAVED — GHL error', ghl.status, await ghl.text());
    return res.status(502).json({ error: 'crm_error' });
  }

  // The lead is saved; a Meta failure must not fail the request.
  if (qualified && META_PIXEL_ID && META_CAPI_TOKEN) {
    try {
      const phone = d.phone.replace(/\D/g, '');
      const r = await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [{
          event_name: 'QualifiedLead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: d.eventId,
          action_source: 'website',
          event_source_url: d.page,
          user_data: {
            em: [sha256(d.email.trim().toLowerCase())],
            ph: [sha256(phone.length === 10 ? '1' + phone : phone)],
            client_ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
            client_user_agent: req.headers['user-agent'],
            fbp: d.fbp || undefined,
            fbc: d.fbc || undefined,
          },
          custom_data: { team_size: d.size, lead_type: d.type },
        }] }),
      });
      if (!r.ok) console.error('Meta CAPI error', r.status, await r.text());
    } catch (err) {
      console.error('Meta CAPI failed', err);
    }
  }

  return res.status(200).json({ ok: true });
}
