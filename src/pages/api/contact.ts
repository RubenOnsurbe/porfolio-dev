import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, method, contact, message } = await request.json();

    if (!name || !method || !contact) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 });
    }

    const gmailUser = import.meta.env.GMAIL_USER;
    const gmailPass = import.meta.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      // Si no hay config de email, devolvemos ok igualmente (modo demo)
      console.warn('Gmail credentials not configured in .env');
      return new Response(JSON.stringify({ ok: true, demo: true }), { status: 200 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });

    const methodLabel = method === 'email' ? 'Correo electrónico' : 'Teléfono';
    const contactIcon = method === 'email' ? '📧' : '📞';

    await transporter.sendMail({
      from: `"Portfolio R.AI" <${gmailUser}>`,
      to: 'ruben.onsurbe@gmail.com',
      subject: `💬 Nuevo contacto desde el portfolio — ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',sans-serif;">
          <div style="max-width:520px;margin:32px auto;background:#1e2130;border-radius:12px;overflow:hidden;border:1px solid #0ea5e930;">
            <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);padding:24px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:20px;letter-spacing:0.05em;">◈ R.AI · Nuevo Contacto</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;font-family:monospace;">Portfolio de Ruben Onsurbe</p>
            </div>
            <div style="padding:28px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;color:#64748b;font-size:12px;font-family:monospace;letter-spacing:0.1em;width:130px;">NOMBRE</td>
                  <td style="padding:10px 0;color:#e2e8f0;font-size:15px;font-weight:600;">${name}</td>
                </tr>
                <tr style="border-top:1px solid #ffffff08;">
                  <td style="padding:10px 0;color:#64748b;font-size:12px;font-family:monospace;letter-spacing:0.1em;">MÉTODO</td>
                  <td style="padding:10px 0;color:#e2e8f0;font-size:14px;">${methodLabel}</td>
                </tr>
                <tr style="border-top:1px solid #ffffff08;">
                  <td style="padding:10px 0;color:#64748b;font-size:12px;font-family:monospace;letter-spacing:0.1em;">CONTACTO</td>
                  <td style="padding:10px 0;">
                    <span style="background:#0ea5e915;border:1px solid #0ea5e940;color:#22d3ee;padding:6px 14px;border-radius:20px;font-size:14px;font-family:monospace;">
                      ${contactIcon} ${contact}
                    </span>
                  </td>
                </tr>
                <tr style="border-top:1px solid #ffffff08;">
                  <td style="padding:10px 0;color:#64748b;font-size:12px;font-family:monospace;letter-spacing:0.1em;">MOTIVO</td>
                  <td style="padding:10px 0;color:#e2e8f0;font-size:14px;white-space:pre-wrap;line-height:1.5;">${message || 'No especificado'}</td>
                </tr>
              </table>
            </div>
            <div style="background:#0d1020;padding:16px 28px;border-top:1px solid #ffffff08;">
              <p style="margin:0;color:#475569;font-size:11px;font-family:monospace;">
                📅 ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })} · Enviado desde R.AI Portfolio Chatbot
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Contact email error:', err);
    return new Response(JSON.stringify({ error: 'Error al enviar el mensaje' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
