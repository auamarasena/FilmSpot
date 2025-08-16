import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PaymentSummary from "./PaymentSummary";
import PromoCodeSection from "./PromoCodeSection";
import UserDetailsSection from "./UserDetailsSection";
import PayPalPayment from "./PayPalPayment";
import PayPalErrorBoundary from "./PayPalErrorBoundary";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const {
    selectedSeats,
    totalPrice,
    showtimeSeatIds,
    showtimeDetails,
    movieTitle,
  } = location.state || {};

  const [discountedPrice, setDiscountedPrice] = useState(totalPrice || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if essential data is missing
    if (!isAuthenticated || !totalPrice || !showtimeDetails) {
      navigate("/");
    }
  }, [isAuthenticated, totalPrice, showtimeDetails, navigate]);

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsLoading(true);
    try {
      const bookingData = {
        showtimeId: showtimeDetails._id,
        showtimeSeatIds: showtimeSeatIds,
      };

      const { data: newBooking } = await api.post("/bookings", bookingData);

      navigate("/booking-success", {
        replace: true,
        state: {
          booking: newBooking,
          movieTitle,
          selectedDate: new Date(showtimeDetails.start_date).toLocaleDateString(
            "en-US",
            { weekday: "short", month: "short", day: "numeric" }
          ),
          selectedTime: showtimeDetails.start_time,
          selectedSeats,
          totalAmount: newBooking.totalAmount,
          userDetails: user,
          showtimeDetails,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create booking. Please contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='payment-page'>
        <div>Loading Payment...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className='payment-page'>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  if (!showtimeDetails) {
    return (
      <div className='payment-page'>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className='payment-page'>
      <div className='payment-container'>
        <div className='payment-header'>
          <h1 className='page-title'>Complete Your Booking</h1>
        </div>
        <PaymentSummary
          movieTitle={movieTitle}
          selectedDate={new Date(showtimeDetails.start_date).toLocaleDateString(
            "en-US",
            { weekday: "short", month: "short", day: "numeric" }
          )}
          selectedTime={showtimeDetails.start_time}
          selectedSeats={selectedSeats}
          totalPrice={discountedPrice}
          showtimeDetails={showtimeDetails}
        />
        <PromoCodeSection
          totalPrice={totalPrice}
          discountedPrice={discountedPrice}
          setDiscountedPrice={setDiscountedPrice}
        />
        <UserDetailsSection userDetails={user} />
        <PayPalErrorBoundary>
          <PayPalPayment
            amount={discountedPrice}
            movieTitle={movieTitle}
            selectedSeats={selectedSeats}
            onPaymentSuccess={handlePaymentSuccess}
            showtimeDetails={showtimeDetails}
            showtimeSeatIds={showtimeSeatIds}
          />
        </PayPalErrorBoundary>
      </div>
    </div>
  );
};

export default PaymentPage;
