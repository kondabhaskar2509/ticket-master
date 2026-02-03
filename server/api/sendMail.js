import nodemailer from "nodemailer";

function setupMail(app) {
  app.post("/send-mail", async (req, res) => {
    const { email, type = "reset", booking, payment } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let options;
      if (type === "reset") {

        // Password reset email
        const resetLink = `http://localhost:5173/reset-password?email=${email}`;
        options = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Reset your password -  Ticket Master",
          html: `<html><body><h2>Password Reset Request</h2><p>We received a request to reset your password for your  Ticket Master account. If you did not make this request, you can safely ignore this email.</p><p>To reset your password, please click the link below:</p><a href='${resetLink}'>Reset Password</a></body></html>`,
        };
      } else if (type === "booking-confirmation") {

        // Booking confirmation email
        let bookingDetailsHtml = "";
        if (booking) {
          bookingDetailsHtml = `<h3>Booking Details</h3><ul>
            <li><strong>Booking ID:</strong> ${booking._id || booking.bookingId}</li>
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
            <li><strong>Status:</strong> ${booking.status}</li>
            <li><strong>Amount:</strong> ${booking.price}</li>
          </ul>`;
        }
        let paymentDetailsHtml = "";
        if (payment) {
          paymentDetailsHtml = `<h3>Payment Details</h3><ul>
            <li><strong>Transaction ID:</strong> ${payment.linkId}</li>
            <li><strong>Amount:</strong> ${payment.amount}</li>
          </ul>`;
        }
        options = {
          from: process.env.EMAIL_USER,
          to: email,
          subject:
            "Your Ticket Booking Confirmation -  Ticket Master",
          html: `<html><body style="color: #000000;">
            <h2>Your Booking is Confirmed!</h2>
            <p>Thank you for booking with  Ticket Master. Below are your booking and payment details:</p>
            ${bookingDetailsHtml}
            ${paymentDetailsHtml}
            <p>If you have any questions, please contact our support team.</p>
            </body></html>`,
        };
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid email type" });
      }

      await transporter.sendMail(options);
      res.json({ status: "success" });
    } catch (error) {
      console.error("Error sending mail:", error);
      res
        .status(500)
        .json({ status: "error", message: "Failed to send email" });
    }
  });
}

export default setupMail;
