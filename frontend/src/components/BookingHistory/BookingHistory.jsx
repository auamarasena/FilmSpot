import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const mockBookings = [
  {
    _id: "booking1",
    booking_date: new Date().toISOString(), // Today
    status: "confirmed",
    seats: [{ seatNumber: "A5" }, { seatNumber: "A6" }],
    showtimeId: {
      _id: "showtime1",
      movieId: { _id: "movie1", title: "Dune: Part Two" },
      screenId: { _id: "screen1", screenNumber: 1 },
    },
  },
  {
    _id: "booking2",
    booking_date: new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toISOString(), // Yesterday
    status: "completed",
    seats: [{ seatNumber: "C10" }],
    showtimeId: {
      _id: "showtime2",
      movieId: { _id: "movie2", title: "Oppenheimer" },
      screenId: { _id: "screen2", screenNumber: 2 },
    },
  },
  {
    _id: "booking3",
    booking_date: new Date(
      new Date().setDate(new Date().getDate() - 8)
    ).toISOString(), // Last week
    status: "completed",
    seats: [
      { seatNumber: "D1" },
      { seatNumber: "D2" },
      { seatNumber: "D3" },
      { seatNumber: "D4" },
    ],
    showtimeId: {
      _id: "showtime3",
      movieId: { _id: "movie3", title: "Spider-Man: Across the Spider-Verse" },
      screenId: { _id: "screen3", screenNumber: 3 },
    },
  },
  {
    _id: "booking4",
    booking_date: new Date("2024-05-20T18:00:00Z").toISOString(),
    status: "cancelled",
    seats: [{ seatNumber: "B7" }],
    showtimeId: {
      _id: "showtime4",
      movieId: { _id: "movie4", title: "The Dark Knight" },
      screenId: { _id: "screen4", screenNumber: 1 },
    },
  },
];

function BookingHistoryP() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = () => {
      setLoading(true);
      setError(null);
      // Simulate a 1.5-second network delay
      setTimeout(() => {
        try {
          // Sort mock data by date (newest first)
          const sortedBookings = mockBookings.sort(
            (a, b) => new Date(b.booking_date) - new Date(a.booking_date)
          );
          setBookings(sortedBookings);
        } catch (err) {
          setError("Failed to load mock booking data.");
          console.error("Failed to load mock bookings:", err);
        } finally {
          setLoading(false);
        }
      }, 1500);
    };
    fetchBookings();
  }, []);

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const thisMonth = bookings.filter(
      (b) => new Date(b.booking_date).getMonth() === new Date().getMonth()
    ).length;
    const totalSeats = bookings.reduce(
      (sum, b) => sum + (b.seats?.length || 0),
      0
    );
    return { total, thisMonth, totalSeats };
  }, [bookings]);

  const handleBookingClick = (bookingId) =>
    navigate(`/Booking?bookingId=${bookingId}`);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    if (diffDays === 1)
      return `Yesterday, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBookingStatus = (booking) =>
    booking.status?.toLowerCase() || "unknown";
  const getStatusDisplay = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  if (loading) {
    return (
      <div className='bkh-body'>
        <div className='bkh-container'>
          <div className='bkh-loading'>...Loading Booking History</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bkh-body'>
        <div className='bkh-container'>
          <div className='bkh-error'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='bkh-body'>
      <div className='bkh-container'>
        <div className='bkh-booking-history'>
          <h2 className='bkh-title'>Movie Booking History</h2>
          <p className='bkh-subtitle'>Your cinema journey at a glance</p>
          <div className='bkh-title-line'></div>

          {bookings.length > 0 ? (
            <>
              <div className='bkh-stats'>
                <div className='bkh-stat-item'>
                  <span className='bkh-stat-number'>{bookingStats.total}</span>
                  <span className='bkh-stat-label'>Total Bookings</span>
                </div>
                <div className='bkh-stat-item'>
                  <span className='bkh-stat-number'>
                    {bookingStats.thisMonth}
                  </span>
                  <span className='bkh-stat-label'>This Month</span>
                </div>
                <div className='bkh-stat-item'>
                  <span className='bkh-stat-number'>
                    {bookingStats.totalSeats}
                  </span>
                  <span className='bkh-stat-label'>Total Seats</span>
                </div>
              </div>
              <div className='bkh-bookings-list'>
                {bookings.map((booking) => {
                  const status = getBookingStatus(booking);
                  return (
                    <div
                      key={booking._id}
                      className='bkh-booking-card'
                      onClick={() => handleBookingClick(booking._id)}
                      role='button'
                      tabIndex={0}>
                      <div className='bkh-booking-info'>
                        <div className='bkh-movie-title'>
                          {booking.showtimeId?.movieId?.title ||
                            "Movie unavailable"}
                        </div>
                        <div className='bkh-booking-details'>
                          <span className='bkh-cinema'>
                            🎬 Screen{" "}
                            {booking.showtimeId?.screenId?.screenNumber ||
                              "N/A"}
                          </span>
                          <span className='bkh-date'>
                            📅 {formatDate(booking.booking_date)}
                          </span>
                          {booking.seats?.length > 0 && (
                            <span className='bkh-seats'>
                              🪑 {booking.seats.length} seat(s)
                            </span>
                          )}
                          <span className={`bkh-status ${status}`}>
                            {getStatusDisplay(status)}
                          </span>
                        </div>
                      </div>
                      <div className='bkh-arrow'></div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className='bkh-empty'>
              <h3 className='bkh-empty-title'>No bookings yet</h3>
              <p className='bkh-empty-message'>
                Start exploring our movies and book your first show!
              </p>
              <button
                className='bkh-retry-button'
                onClick={() => navigate("/movies")}>
                Browse Movies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistoryP;
