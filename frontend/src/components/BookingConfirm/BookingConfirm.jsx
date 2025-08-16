import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./BookingConfirm.css";

function BookingConfirmation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [theatreDetails, setTheatreDetails] = useState(null);
  const [screenDetails, setScreenDetails] = useState(null);

  useEffect(() => {
    const fetchBookingAndUserDetails = async () => {
      setLoading(true);
      try {
        // Fetch booking details
        const bookingResponse = await apiService.bookings.getById(bookingId);
        const bookingData = bookingResponse.data;
        setBookingDetails(bookingData);

        // Fetch user details
        const userResponse = await apiService.auth.getUserById(
          bookingData.userId
        );
        const userData = userResponse.data;
        setUserDetails(userData);

        // Fetch showtime details using showtimeId from booking
        const showtimeResponse = await apiService.showtimes.getById(
          bookingData.showtimeId
        );
        const showtimeData = showtimeResponse.data;
        setMovieDetails(showtimeData.movieId);
        setTheatreDetails(showtimeData.screenId.theatreId);
        setScreenDetails(showtimeData.screenId);

        // Fetch seat details (single request)
        const seatIds = bookingData.showtimeSeatIds.join(",");
        const seatResponse = await apiService.showtimes.searchSeats({
          showtimeSeatIds: seatIds,
        });
        const seatData = seatResponse.data;
        const seatNumbers = seatData.map((seat) => seat.seatNumber);
        setSeatNumbers(seatNumbers);
      } catch (error) {
        const errorMessage = handleApiError(error);
        setError(errorMessage);
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingAndUserDetails();
    }
  }, [bookingId]);

  if (loading) {
    return <div className='booking-container'>Loading booking details...</div>;
  }

  if (error) {
    return (
      <div className='booking-container' style={{ color: "red" }}>
        Error fetching booking details: {error}
      </div>
    );
  }
  if (!bookingDetails) {
    return <div className='booking-container'>No booking details found</div>;
  }
  if (!userDetails) {
    return <div className='booking-container'>No user details found</div>;
  }
  if (!movieDetails) {
    return <div className='booking-container'>No movie details found</div>;
  }
  if (!theatreDetails) {
    return <div className='booking-container'>No theatre details found</div>;
  }
  if (!screenDetails) {
    return <div className='booking-container'>No screen details found</div>;
  }
  return (
    <div className='booking-container'>
      <div className='booking-content'>
        <h1 className='booking-heading'>BOOKING SUCCESSFUL</h1>

        <div className='movie-info'>
          <h2 className='movie-title'>{movieDetails.title}</h2>
          <p>
            {theatreDetails.location} | {screenDetails.format}
          </p>
        </div>

        <div className='ticket-details'>
          <p>
            <span className='label'>Ticket No:</span> {bookingDetails.ticketNo}
          </p>
          <p>
            <span className='label'>Tickets:</span> {bookingDetails.seatCount}
          </p>
          <p>
            <span className='label'>Screen:</span> {screenDetails.screenNumber}
          </p>
          <p>
            <span className='label'>Seats:</span> {seatNumbers.join(", ")}
          </p>
          <p>
            <span className='label'>Date:</span> Fri, 27 Jan
          </p>
          <p>
            <span className='label'>Time:</span> 9:00 AM
          </p>
          <p>
            <span className='label'>Total Amount:</span> Rs.{" "}
            {bookingDetails.totalAmount}
          </p>
        </div>

        <div className='customer-info'>
          <p>
            <span className='label'>Customer Name:</span>{" "}
            {userDetails.firstName} {userDetails.lastName}
          </p>
          <p>
            <span className='label'>Customer Mobile:</span> {userDetails.mobile}
          </p>
          <p>
            <span className='label'>Customer Email:</span> {userDetails.email}
          </p>
        </div>

        <p className='note'>
          Note: All sales are final and there will be no refunds, cancellations
          and or amendments to the confirmed and finalized bookings.
        </p>
      </div>
    </div>
  );
}

export default BookingConfirmation;
