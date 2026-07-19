import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    console.error('RESEND_API_KEY not configured; skipping password reset email send. Reset URL:', resetUrl);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Sellaap <no-reply@sellaap.com>',
    to,
    subject: 'Reset your Sellaap password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your Sellaap account password. Click the button below to choose a new one. This link expires in 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
