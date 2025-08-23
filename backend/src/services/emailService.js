import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter with email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service error:", error);
  } else {
    console.log("Email service is ready to send emails");
  }
});

// Generate booking confirmation email HTML
const generateBookingEmailHTML = (bookingDetails) => {
  const {
    customerName,
    ticketNo,
    movieTitle,
    theatreLocation,
    screenNumber,
    seats,
    date,
    time,
    totalAmount,
    seatCount,
  } = bookingDetails;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - FilmSpot</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #1a1a1a;
          color: #ffffff;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .success-icon {
          font-size: 50px;
          margin-bottom: 20px;
        }
        .content {
          padding: 30px;
        }
        .booking-details {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          color: #666;
          font-weight: 500;
        }
        .value {
          color: #333;
          font-weight: bold;
        }
        .movie-title {
          font-size: 24px;
          color: #333;
          margin: 20px 0;
          text-align: center;
        }
        .ticket-number {
          background-color: #ff6b6b;
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-size: 18px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .important-note {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .cta-button {
          display: inline-block;
          background-color: #ff6b6b;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>Booking Confirmed!</h1>
          <p>Your tickets have been successfully booked</p>
        </div>
        
        <div class="content">
          <h2 class="movie-title">${movieTitle}</h2>
          
          <div class="ticket-number">
            Ticket Number: ${ticketNo}
          </div>
          
          <div class="booking-details">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <div class="detail-row">
              <span class="label">Customer Name:</span>
              <span class="value">${customerName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Theatre:</span>
              <span class="value">${theatreLocation}</span>
            </div>
            <div class="detail-row">
              <span class="label">Screen:</span>
              <span class="value">${screenNumber}</span>
            </div>
            <div class="detail-row">
              <span class="label">Seats:</span>
              <span class="value">${seats}</span>
            </div>
            <div class="detail-row">
              <span class="label">Number of Tickets:</span>
              <span class="value">${seatCount}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${date}</span>
            </div>
            <div class="detail-row">
              <span class="label">Show Time:</span>
              <span class="value">${time}</span>
            </div>
            <div class="detail-row" style="font-size: 18px;">
              <span class="label"><strong>Total Amount:</strong></span>
              <span class="value"><strong>Rs. ${totalAmount.toFixed(
                2
              )}</strong></span>
            </div>
          </div>
          
          <div class="important-note">
            <strong>Important Instructions:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Please arrive at the cinema at least 15 minutes before showtime</li>
              <li>Carry this email or ticket number for entry</li>
              <li>All sales are final - tickets are non-refundable</li>
              <li>Food and beverages from outside are not allowed</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:5173"
            }/booking-history" class="cta-button">
              View My Bookings
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing FilmSpot!</p>
          <p>For support, contact us at support@filmspot.com</p>
          <p style="margin-top: 20px; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (
  userEmail,
  bookingDetails
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"FilmSpot" <filmspotcinema@gmail.com>',
      to: userEmail,
      subject: `Booking Confirmation - ${bookingDetails.movieTitle} - Ticket #${bookingDetails.ticketNo}`,
      html: generateBookingEmailHTML(bookingDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendBookingConfirmationEmail,
};
