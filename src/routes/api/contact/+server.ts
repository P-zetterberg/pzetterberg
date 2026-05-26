import { Resend } from 'resend';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, subject, message } = await request.json();

	if (!name || !email || !message) {
		return json({ error: 'All fields are required.' }, { status: 400 });
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return json({ error: 'Email service not configured.' }, { status: 500 });
	}

	const resend = new Resend(apiKey);

	const { error } = await resend.emails.send({
		from: 'Portfolio Contact <onboarding@resend.dev>',
		to: process.env.CONTACT_EMAIL ?? 'delivered@resend.dev',
		subject: subject ? `${subject} (from ${name})` : `New message from ${name}`,
		html: `
			<div style="font-family: monospace; max-width: 600px;">
				<h2 style="margin-bottom: 8px;">New contact message</h2>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
				<hr style="margin: 16px 0;" />
				<p style="white-space: pre-wrap;">${message}</p>
			</div>
		`
	});

	if (error) {
		return json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
	}

	return json({ success: true });
};
