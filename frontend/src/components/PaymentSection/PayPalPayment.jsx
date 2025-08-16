import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PayPalPayment = ({
  amount,
  movieTitle,
  selectedSeats,
  showtimeDetails,
  showtimeSeatIds,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onPaymentSuccess = async (paymentDetails) => {
    try {
      console.log("Creating booking in backend...");

      const bookingData = {
        showtimeId: showtimeDetails._id,
        showtimeSeatIds: showtimeSeatIds,
      };

      const { data: newBooking } = await api.post(
        "http://localhost:5001/api/bookings",
        bookingData
      );

      console.log("Booking created successfully:", newBooking);

      navigate("/booking-success", {
        state: {
          booking: newBooking,
          movieTitle: movieTitle,
          selectedDate: new Date(
            showtimeDetails.start_date
          ).toLocaleDateString(),
          selectedTime: showtimeDetails.start_time,
          selectedSeats: selectedSeats,
          totalAmount: newBooking.totalAmount,
          userDetails: user,
          showtimeDetails: showtimeDetails,
        },
      });
    } catch (error) {
      console.error("Failed to create booking after payment:", error);
      alert(
        "Your payment was successful, but we failed to confirm your booking. Please contact support with your PayPal transaction ID."
      );
    }
  };
};

export default PayPalPayment;
