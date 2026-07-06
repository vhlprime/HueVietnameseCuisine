
// functions/api/stripe/payment-intent.js — POST /api/stripe/payment-intent
// Creates a Stripe PaymentIntent for Apple Pay / the browser Payment Request sheet.
// Stripe API docs: https://stripe.com/docs/api/payment_intents/create
export async function onRequestPost({ request, env }) {
  try {
    const { amount } = await request.json();
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents <= 0 || cents > 200000) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
    }
    const body = new URLSearchParams({
      amount: String(cents),
      currency: 'usd',
      'automatic_payment_methods[enabled]': 'true',
      description: 'Huế Vietnamese Cuisine order',
    });
    const r = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: { Authorization: 'Basic ' + btoa(`${env.STRIPE_SECRET_KEY}:`), 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const d = await r.json();
    if (!r.ok) return new Response(JSON.stringify({ error: d?.error?.message || 'stripe_failed' }), { status: 502 });
    return new Response(JSON.stringify({ clientSecret: d.client_secret }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
}