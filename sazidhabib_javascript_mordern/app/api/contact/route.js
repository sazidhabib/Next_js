import { NextResponse } from 'next/server';
import { ContactMessage, initDb } from '@/lib/models';

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    // 1. Save to Database
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    // 2. Send Email Notification via Nodemailer (if configured in .env)
    let emailSent = false;
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || smtpUser;

    if (smtpUser && smtpPass && receiverEmail) {
      try {
        const nodemailerModule = await import('nodemailer');
        const nodemailer = nodemailerModule.default || nodemailerModule;

        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for 587/other
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
            <div style="background: linear-gradient(135deg, #00cea8 0%, #bf61ff 100%); padding: 24px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">New Portfolio Contact Message</h2>
            </div>
            
            <div style="padding: 24px;">
              <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #94a3b8;">
                  <strong style="color: #ffffff;">Sender Name:</strong> ${name}
                </p>
                <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                  <strong style="color: #ffffff;">Sender Email:</strong> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
                </p>
              </div>

              <div style="background-color: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; font-weight: 600; color: #64748b; letter-spacing: 0.5px;">Message Content:</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #f8fafc; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="text-align: center;">
                <a href="mailto:${email}?subject=Re:%20Portfolio%20Inquiry" style="display: inline-block; background-color: #00cea8; color: #020617; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">Reply to ${name}</a>
              </div>
            </div>

            <div style="background-color: #020617; padding: 14px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
              Received on ${new Date().toLocaleString()} via your portfolio website.
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Portfolio Contact" <${smtpUser}>`,
          to: receiverEmail,
          replyTo: email,
          subject: `📩 New Message from ${name} via Portfolio`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: htmlContent,
        });

        emailSent = true;
      } catch (mailError) {
        console.error('Nodemailer error sending email:', mailError);
      }
    } else {
      console.log('ℹ️ Contact message saved to database. (Email forwarding skipped: SMTP credentials not filled in .env)');
    }

    return NextResponse.json({
      success: true,
      message: 'Message saved successfully',
      emailSent,
      data: newMessage,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
