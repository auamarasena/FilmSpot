import React from "react";
const PaymentSummary = ({
  movieTitle,
  selectedDate,
  selectedTime,
  selectedSeats,
  totalPrice,
  showtimeDetails,
}) => {
  const theatreLocation =
    showtimeDetails?.screenId?.theatreId?.location || "Loading...";
  const screenNumber = showtimeDetails?.screenId?.screenNumber || "Loading...";
  const format = showtimeDetails?.screenId?.format || "Loading...";

  return (
    <div className='payment-section'>
      <div className='section-header'>
        <h2>Booking Summary</h2>
      </div>

      <div className='summary-content'>
        <div className='movie-info'>
          <h3 className='movie-title'>{movieTitle}</h3>
          <p className='theatre-info'>
            {theatreLocation} - Screen {screenNumber}
          </p>
          <p className='format-info'>{format}</p>
        </div>

        <div className='booking-details'>
          <div className='detail-row'>
            <span className='label'>Date:</span>
            <span className='value'>{selectedDate}</span>
          </div>
          <div className='detail-row'>
            <span className='label'>Time:</span>
            <span className='value'>{selectedTime}</span>
          </div>
          <div className='detail-row'>
            <span className='label'>Seats:</span>
            <span className='value'>
              {selectedSeats?.join(", ") || "No seats selected"}
            </span>
          </div>
          <div className='detail-row'>
            <span className='label'>Tickets:</span>
            <span className='value'>{selectedSeats?.length || 0}</span>
          </div>
        </div>

        <div className='price-summary'>
          <div className='price-row total'>
            <span className='label'>Total Amount:</span>
            <span className='value'>Rs. {totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
