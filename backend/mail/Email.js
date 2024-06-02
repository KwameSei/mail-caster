import nodemailer from 'nodemailer';

const BroadcastMail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email info:', info);

    if (info && info.messageId) {
      console.log(`Email sent: ${info.messageId}`);
      return { status: 200, message: 'Email sent successfully.', info };
    } else {
      console.error(`Failed to send email. Response: ${JSON.stringify(info)}`);
      return { status: 500, message: 'Failed to send email.', info };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { status: 500, message: error.message };
  }
};

export default BroadcastMail;