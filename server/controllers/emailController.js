import nodemailer from "nodemailer";

const EMAIL_TYPES = {
  PASSWORD_RESET: "reset",
  BOOKING_CONFIRMATION: "booking-confirmation",
};

const getPasswordResetEmail = (email) => {
  const resetLink = `${process.env.FRONTEND}/reset-password?email=${email}`;
  return {
    subject: "Reset your password - Ticket Master",
    html: `<html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #36a3eb;">Password Reset Request</h2>
          <p>We received a request to reset your password for your Ticket Master account.</p>
          <p>If you did not make this request, you can safely ignore this email.</p>
          <p>To reset your password, please click the link below:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #36a3eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">This link will expire in 24 hours.</p>
        </div>
      </body>
    </html>`,
  };
};

const getBookingConfirmationEmail = (booking, payment) => {
  let bookingDetailsHtml = "";
  if (booking) {
    bookingDetailsHtml = `
      <h3 style="color: #36a3eb;">Booking Details</h3>
      <ul style="line-height: 2;">
        <li><strong>Booking ID:</strong> ${
          booking._id || booking.bookingId
        }</li>
        <li><strong>Type:</strong> ${booking.type}</li>
        ${
          booking.details
            ? Object.entries(booking.details)
                .map(
                  ([key, value]) =>
                    `<li><strong>${key}:</strong> ${
                      Array.isArray(value) ? value.join(", ") : value
                    }</li>`
                )
                .join("")
            : ""
        }
        <li><strong>Status:</strong> ${
          booking.status || booking.bookingStatus
        }</li>
        <li><strong>Amount:</strong> ₹${booking.price}</li>
      </ul>
    `;
  }

  let paymentDetailsHtml = "";
  if (payment) {
    paymentDetailsHtml = `
      <h3 style="color: #36a3eb;">Payment Details</h3>
      <ul style="line-height: 2;">
        <li><strong>Transaction ID:</strong> ${payment.linkId}</li>
        <li><strong>Amount:</strong> ₹${payment.amount}</li>
      </ul>
    `;
  }

  return {
    subject: "Your Ticket Booking Confirmation - Ticket Master",
    html: `<html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #36a3eb;">Your Booking is Confirmed!</h2>
          <p>Thank you for booking with Ticket Master. Below are your booking and payment details:</p>
          ${bookingDetailsHtml}
          ${paymentDetailsHtml}
          <p style="margin-top: 20px;">If you have any questions, please contact our support team.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">Ticket Master © 2025. All rights reserved.</p>
        </div>
      </body>
    </html>`,
  };
};

export const sendMailController = async (req, res) => {
  try {
    const {
      email,
      type = EMAIL_TYPES.PASSWORD_RESET,
      booking,
      payment,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Email type is required",
      });
    }

    let emailTemplate;

    if (type === EMAIL_TYPES.PASSWORD_RESET) {
      emailTemplate = getPasswordResetEmail(email);
    } else if (type === EMAIL_TYPES.BOOKING_CONFIRMATION) {
      emailTemplate = getBookingConfirmationEmail(booking, payment);
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid email type",
      });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email",
      error: error.message,
    });
  }
};
