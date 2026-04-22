import nodemailer from 'nodemailer';

async function bookingConfirmationMail(event, reciver) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      to: reciver,
      subject: 'Booking Confirmation',
      text: `${event?.title} booked for ${event?.time?.date} at ${event?.time?.startTime} `,
    });

    console.log('Message sent: ', info.messageId);
  } catch (error) {
    throw error;
  }
}

async function bookingCancelationConfirmationMail(event, reciver) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      to: reciver,
      subject: 'Booking Cancelation ',
      text: `Booking ${event?.title} has been cancelled it was for ${event?.time?.date} at ${event?.time?.startTime} `,
    });

    console.log('Message sent: ', info.messageId);
  } catch (error) {
    throw error;
  }
}

export { bookingConfirmationMail, bookingCancelationConfirmationMail };
