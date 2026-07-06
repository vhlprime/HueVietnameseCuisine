// functions/api/lead.js — Cloudflare Pages Function
// Emails the WELCOME5 coupon ($5 off first online order of $50+) the moment someone joins the list.
// SETUP (one time):
//   1. Cloudflare dashboard -> your Pages project -> Settings -> Environment variables
//      Add: RESEND_API_KEY = (your Resend key — never put it in front-end code)
//   2. In script.js set CFG.FORMS_BACKEND = true and redeploy.
export async function onRequestPost({ request, env }) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
    }
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Huế Vietnamese Cuisine <hello@huevietnamesecuisine.com>', // must be a verified Resend domain/sender
        to: [email],
        subject: 'Your $5 welcome coupon — Huế Vietnamese Cuisine',
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:auto;color:#2b2220">
            <h2 style="color:#7A1420">Welcome to Huế Vietnamese Cuisine!</h2>
            <p>Here is your welcome treat:</p>
            <div style="background:#FBF6EF;border:2px dashed #B8860B;border-radius:12px;padding:18px;text-align:center;margin:14px 0">
              <div style="font-size:26px;font-weight:bold;letter-spacing:2px;color:#7A1420">WELCOME5</div>
              <div style="font-size:14px;margin-top:6px">$5 off your first online order of $50 or more</div>
            </div>
            <p>Enter the code in the coupon box at checkout on
               <a href="https://huevietnamesecuisine.com" style="color:#7A1420">huevietnamesecuisine.com</a>.</p>
            <p style="font-size:12px;color:#8a7a76">One coupon per customer, first online order only, minimum $50 subtotal before tax &amp; fees. Cannot be combined with another promotion.</p>
            <p>6538 4th Ave S, Suite 1 · Seattle, WA 98108 · (206) 693-3311<br>Mon–Sun 10 AM – 8 PM · DineIn · Takeout · Catering</p>
          </div>`
      })
    });
    if (!r.ok) return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 502 });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
}
