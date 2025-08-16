import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the real data passed from the payment page
  const {
    booking,
    movieTitle,
    selectedDate,
    selectedTime,
    selectedSeats,
    totalAmount,
    userDetails,
    showtimeDetails,
  } = location.state || {};

  if (!booking) {
    return (
      <div className='booking-container'>
        <div className='booking-content'>
          <h1>No Booking Found</h1>
          <p>
            It looks like you've landed on this page directly. Please find your
            confirmed bookings in your history.
          </p>
          <button
            className='btn btn-primary'
            onClick={() => navigate("/booking-history")}>
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  // Use data for display
  const displayData = {
    movieTitle: movieTitle,
    theatreLocation: showtimeDetails?.screenId?.theatreId?.location,
    screenNumber: showtimeDetails?.screenId?.screenNumber,
    ticketNo: booking?.ticketNo,
    ticketCount: selectedSeats?.length,
    seats: selectedSeats?.join(", "),
    date: selectedDate,
    time: selectedTime,
    totalAmount: totalAmount,
    customerName: `${userDetails.firstName} ${userDetails.lastName}`,
    customerMobile: userDetails?.mobile,
    customerEmail: userDetails?.email,
  };

  return (
    <div className='booking-container'>
      <div className='booking-content'>
        <div className='success-header'>
          <div className='success-icon'>✅</div>
          <h1 className='success-title'>Booking Confirmed!</h1>
          <p className='success-subtitle'>
            Your movie tickets have been successfully booked
          </p>
        </div>

        <div className='movie-info'>
          <h2 className='movie-title'>{displayData.movieTitle}</h2>
          <p className='theatre-location'>{displayData.theatreLocation}</p>
        </div>

        <div className='ticket-details'>
          <div className='detail-item'>
            <span className='label'>Ticket No:</span>
            <span className='value'>{displayData.ticketNo}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Tickets:</span>
            <span className='value'>{displayData.ticketCount}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Screen:</span>
            <span className='value'>{displayData.screenNumber}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Seats:</span>
            <span className='value'>{displayData.seats}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Date:</span>
            <span className='value'>{displayData.date}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Time:</span>
            <span className='value'>{displayData.time}</span>
          </div>
          <div className='detail-item total-amount'>
            <span className='label'>Total Amount:</span>
            <span className='value'>
              Rs. {displayData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className='customer-info'>
          <h3 className='section-title'>Customer Information</h3>
          <div className='detail-item'>
            <span className='label'>Customer Name:</span>
            <span className='value'>{displayData.customerName}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Customer Mobile:</span>
            <span className='value'>{displayData.customerMobile}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Customer Email:</span>
            <span className='value'>{displayData.customerEmail}</span>
          </div>
        </div>

        <div className='action-buttons'>
          <button className='btn btn-primary' onClick={() => navigate("/")}>
            Book Another Movie
          </button>
          <button
            className='btn btn-secondary'
            onClick={() => navigate("/booking-history")}>
            View My Bookings
          </button>
        </div>

        <div className='note-section'>
          <p className='note'>
            📋 <strong>Important:</strong> All sales are final.
          </p>
          <p className='confirmation-note'>
            📧 A confirmation email has been sent to your registered email
            address.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
