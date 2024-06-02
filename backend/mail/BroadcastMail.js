import { google } from 'googleapis';
import oAuth2Client from './auth.js'; // Ensure this path is correct

// Send email using Gmail API
const BroadCastMail = async (to, subject, text, html) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const raw = createMessage(to, subject, text, html);

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
      },
    });

    console.log('Email sent:', response.data);

    return { status: 200, message: 'Email sent successfully.', response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { status: 500, message: error.message };
  }
};

// Create email message
const createMessage = (to, subject, text, html) => {
  const email = [
    'Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    `To: ${to}\n`,
    `Subject: ${subject}\n\n`,
    `${text}\n\n`,
    `${html}\n`,
  ];

  const raw = Buffer.from(email.join(''))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return raw;
};

export default BroadCastMail;
