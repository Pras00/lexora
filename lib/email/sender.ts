import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Lexora <onboarding@resend.dev>';
    const data = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Resend email delivery error:', error);
    return { success: false, error };
  }
}
