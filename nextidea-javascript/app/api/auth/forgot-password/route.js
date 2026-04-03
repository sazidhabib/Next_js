import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { generatePasswordResetToken } from '@/app/lib/auth';
import { validateInput, forgotPasswordSchema } from '@/app/lib/validation';
import { rateLimit, getClientIp } from '@/app/lib/middleware';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);
    
    if (!rateLimit(`forgot_password_${clientIp}`, 3, 3600000)) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = validateInput(body, forgotPasswordSchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { email } = validation.value;

    const users = await query('SELECT id FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return NextResponse.json(
        { success: true, message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    const userId = users[0].id;

    await query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE user_id = ? AND used = FALSE',
      [userId]
    );

    const resetToken = generatePasswordResetToken();
    const tokenHash = await require('bcryptjs').hash(resetToken, 12);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, tokenHash, expiresAt]
    );

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10) || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Password Reset Request',
          text: `Click the following link to reset your password: ${resetLink}`,
          html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    return NextResponse.json(
      { success: true, message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
