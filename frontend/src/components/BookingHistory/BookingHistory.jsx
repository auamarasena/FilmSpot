import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import BookingDetailsModal from "./BookingDetailsModal";
import "./BookingHistory.css";

function BookingHistoryP() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (!authLoading && isAuthenticated === false) {
      navigate("/sign-in");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/bookings/mybookings");
        setBookings(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setBookings([]); //User has an account but no bookings yet
        } else {
          setError(
            "Failed to load your booking history. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when auth is loaded and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const thisMonth = bookings.filter(
      (b) => new Date(b.createdAt).getMonth() === new Date().getMonth()
    ).length;
    const totalSeats = bookings.reduce((sum, b) => sum + (b.seatCount || 0), 0);
    return { total, thisMonth, totalSeats };
  }, [bookings]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const formatDate = (dateString, timeString) => {
    return format(
      new Date(`${dateString.split("T")[0]}T${timeString}`),
      "eee, dd MMM yyyy 'at' h:mm a"
    );
  };

  if (loading) {
    return (
      <div className='bkh-body'>
        <div className='bkh-container bkh-loading'>
          <div className='bkh-spinner'></div>
          <p className='bkh-loading-text'>Loading Your Bookings...</p>
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
          <h2 className='bkh-title'>My Bookings</h2>
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
                  const showtimeDate = new Date(booking.showtime?.start_date);
                  const status =
                    showtimeDate < new Date() ? "completed" : "confirmed";

                  return (
                    <div
                      key={booking._id}
                      className='bkh-booking-card'
                      onClick={() => handleBookingClick(booking)}
                      role='button'
                      tabIndex={0}>
                      <div className='bkh-booking-info'>
                        <div className='bkh-movie-title'>
                          {booking.showtime?.movieId?.title ||
                            "Movie unavailable"}
                        </div>
                        <div className='bkh-booking-details'>
                          <span className='bkh-cinema'>
                            🎬{" "}
                            {booking.showtime?.screenId?.theatreId?.location ||
                              "N/A"}{" "}
                            - Screen{" "}
                            {booking.showtime?.screenId?.screenNumber || "N/A"}
                          </span>
                          <span className='bkh-date'>
                            📅{" "}
                            {formatDate(
                              booking.showtime?.start_date,
                              booking.showtime?.start_time
                            )}
                          </span>
                          <span className='bkh-seats'>
                            🪑 {booking.seatCount} seat(s)
                          </span>
                          <span className={`bkh-status ${status}`}>
                            {status}
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
              <h3 className='bkh-empty-title'>No Bookings Yet</h3>
              <p className='bkh-empty-message'>
                Let's find a movie for you! All your tickets will appear here.
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

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default BookingHistoryP;
