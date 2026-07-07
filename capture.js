// functions/api/orders/[id]/capture.js — POST /api/orders/:id/capture
// Captures the PayPal order server-side. The order record ({order}) from the browser is for your
// records/receipt only — the actual charge amount always comes from PayPal, never from the browser.
import { ppFetch } from '../../_paypal.js';

export async function onRequestPost({ request, env, params }) {
  try {
    const orderId = params.id;
    if (!orderId) return new Response(JSON.stringify({ error: 'Missing order id' }), { status: 400 });
    const { ok, data } = await ppFetch(env, `/v2/checkout/orders/${orderId}/capture`, { method: 'POST' });
    if (!ok) return new Response(JSON.stringify({ error: 'capture_failed', detail: data }), { status: 502 });
    // TODO (optional next step): persist `data` + the browser's order snapshot to Supabase here,
    // and trigger the kitchen email/SMS via Resend/Twilio.
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
}
