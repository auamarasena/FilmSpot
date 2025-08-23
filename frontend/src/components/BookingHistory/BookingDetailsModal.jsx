import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./BookingDetailsModal.css";

const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  const [detailedBooking, setDetailedBooking] = useState(null);
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && booking) {
      fetchBookingDetails();
    }
  }, [isOpen, booking]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      // Fetch detailed booking information
      const { data } = await api.get(`/bookings/${booking._id}`);
      setDetailedBooking(data);

      // Get seat numbers - check if already populated or need to fetch
      if (booking.showtimeSeatIds && booking.showtimeSeatIds.length > 0) {
        // Check if showtimeSeatIds are already populated with seat data
        const firstSeat = booking.showtimeSeatIds[0];
        if (typeof firstSeat === "object" && firstSeat.seatNumber) {
          // Already populated with seat data
          const seats = booking.showtimeSeatIds.map(
            (seat) => seat.seatNumber || "N/A"
          );
          setSeatNumbers(seats);
        } else {
          // Need to fetch seat data
          try {
            const seatIds = booking.showtimeSeatIds.map((seat) =>
              typeof seat === "object" && seat._id ? seat._id : seat
            );
            const seatIdsString = seatIds.join(",");

            const { data: seatData } = await api.get(
              `/showtimes/seats/search`,
              {
                params: { showtimeSeatIds: seatIdsString },
              }
            );

            // Extract seat numbers from the response
            const seats = seatData.map((seat) => seat.seatNumber || "N/A");
            setSeatNumbers(seats);
          } catch (err) {
            console.error("Error fetching seat details:", err);
            setSeatNumbers(["Seat info unavailable"]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = new Date(booking.showtime?.start_date) > new Date();

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>
          ×
        </button>

        {loading ? (
          <div className='modal-loading'>
            <div className='loading-spinner'></div>
            <p>Loading booking details...</p>
          </div>
        ) : (
          <>
            <div className='modal-header'>
              <h2 className='modal-title'>Booking Details</h2>
              <div
                className={`booking-status ${
                  isUpcoming ? "upcoming" : "completed"
                }`}>
                {isUpcoming ? "Upcoming" : "Completed"}
              </div>
            </div>

            <div className='modal-body'>
              <div className='movie-section'>
                {booking.showtime?.movieId?.moviePoster && (
                  <img
                    src={booking.showtime?.movieId?.moviePoster}
                    alt={booking.showtime?.movieId?.title}
                    className='movie-poster-small'
                  />
                )}
                <div className='movie-info'>
                  <h3 className='movie-title-modal'>
                    {booking.showtime?.movieId?.title || "Movie Unavailable"}
                  </h3>
                  <p className='theatre-info'>
                    {booking.showtime?.screenId?.theatreId?.location || "N/A"}
                  </p>
                </div>
              </div>

              <div className='booking-details-grid'>
                <div className='detail-item'>
                  <span className='detail-label'>Ticket Number</span>
                  <span className='detail-value ticket-number'>
                    {booking.ticketNo}
                  </span>
                </div>

                <div className='detail-item'>
                  <span className='detail-label'>Screen</span>
                  <span className='detail-value'>
                    Screen {booking.showtime?.screenId?.screenNumber || "N/A"}
                  </span>
                </div>

                <div className='detail-item'>
                  <span className='detail-label'>Date</span>
                  <span className='detail-value'>
                    {formatDate(booking.showtime?.start_date)}
                  </span>
                </div>

                <div className='detail-item'>
                  <span className='detail-label'>Show Time</span>
                  <span className='detail-value'>
                    {formatTime(booking.showtime?.start_time)}
                  </span>
                </div>

                <div className='detail-item'>
                  <span className='detail-label'>Seats</span>
                  <span className='detail-value'>
                    {seatNumbers.length > 0
                      ? seatNumbers.join(", ")
                      : "Loading..."}
                  </span>
                </div>

                <div className='detail-item'>
                  <span className='detail-label'>Number of Tickets</span>
                  <span className='detail-value'>{booking.seatCount}</span>
                </div>

                <div className='detail-item'>
                  <span className='detail-label'>Booking Date</span>
                  <span className='detail-value'>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className='detail-item total-amount'>
                  <span className='detail-label'>Total Amount</span>
                  <span className='detail-value'>
                    Rs. {booking.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <div className='modal-footer'>
                <p className='footer-note'>
                  <strong>Important:</strong> Please arrive at least 15 minutes
                  before showtime. All sales are final.
                </p>
                {isUpcoming && (
                  <button
                    className='print-button'
                    onClick={() => window.print()}>
                    Print Ticket
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsModal;
