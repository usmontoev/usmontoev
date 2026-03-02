export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID   = process.env.CHAT_ID;

  try {
    const formData = await req.formData();
    const photo    = formData.get('photo');
    const caption  = formData.get('caption') || 'Yangi tashriqchi!';

    const tgForm = new FormData();
    tgForm.append('chat_id', CHAT_ID);
    tgForm.append('photo', photo, 'visitor.jpg');
    tgForm.append('caption', caption);

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: tgForm,
    });

    const data = await res.json();
    if (!data.ok) {
      return new Response(JSON.stringify({ error: data.description }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
