import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const emailResult = await resend.emails.send({
      from: 'iBiz Test <invoices@mail.ibiz.name.ng>',
      to: 'johnchnd195@gmail.com',
      subject: 'Test Email from iBiz',
      html: '<p>This is a test email from your iBiz application!</p>',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      result: emailResult 
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}