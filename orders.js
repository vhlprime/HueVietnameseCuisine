Content is user-generated and unverified.
// functions/api/orders.js — POST /api/orders  (creates a PayPal order; used by the in-page Buttons flow)
// Amount is re-validated server-side elsewhere at capture time; this just opens the order.
import { ppFetch } from './_paypal.js';

export async function onRequestPost({ request, env }) {
  try {
    const { amount } = await request.json();
    const amt = Number(amount);
    if (!amt || amt <= 0 || amt > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
    }
    const { ok, data } = await ppFetch(env, '/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'USD', value: amt.toFixed(2) }, description: 'Huế Vietnamese Cuisine order' }],
      }),
    });
    if (!ok || !data?.id) return new Response(JSON.stringify({ error: 'create_failed' }), { status: 502 });
    return new Response(JSON.stringify({ id: data.id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
}