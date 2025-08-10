import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    booking,
    movieTitle,
    selectedDate,
    selectedTime,
    selectedSeats,
    totalAmount,
    userDetails,
    showtimeDetails,
  } = location.state || {}; // The '|| {}' prevents errors if the state is undefined.

  const displayData = {
    movieTitle: movieTitle || "Spider-Man: Far from Home",
    theatreLocation:
      showtimeDetails?.screenId?.theatreId?.location ||
      "FilmSpot - Colombo City Center",
    screenNumber: showtimeDetails?.screenId?.screenNumber || "02",
    ticketNo: booking?.ticketNo || "ABC123XYZ",
    ticketCount: selectedSeats?.length || booking?.seatCount || 2,
    seats: selectedSeats?.join(", ") || "A5, A6",
    date: selectedDate || "Sat, 16 Aug",
    time: selectedTime || "07:00 PM",
    totalAmount: totalAmount || 3000,
    customerName: userDetails
      ? `${userDetails.firstName} ${userDetails.lastName}`
      : "Anuda Amarasena",
    customerMobile: userDetails?.mobile || "071-234-5678",
    customerEmail: userDetails?.email || "anuda@example.com",
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewBookings = () => {
    navigate("/bookinghistory");
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
          <button className='btn btn-primary' onClick={handleGoHome}>
            Book Another Movie
          </button>
          <button className='btn btn-secondary' onClick={handleViewBookings}>
            View My Bookings
          </button>
        </div>

        <div className='note-section'>
          <p className='note'>
            📋 <strong>Important:</strong> All sales are final and there will be
            no refunds, cancellations and or amendments to the confirmed and
            finalized bookings.
          </p>
          <p className='confirmation-note'>
            📧 A confirmation email has been sent to your registered email
            address with your ticket details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
