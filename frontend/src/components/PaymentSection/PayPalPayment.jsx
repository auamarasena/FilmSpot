import React, { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PayPalPayment = ({
  amount,
  movieTitle,
  selectedSeats,
  showtimeDetails,
  showtimeSeatIds,
  onPaymentSuccess,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD",
          },
          description: `Movie Ticket: ${movieTitle} - Seats: ${selectedSeats.join(
            ", "
          )}`,
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    setIsPending(true);
    try {
      const details = await actions.order.capture();
      console.log("PayPal payment captured:", details);

      // Call the parent's onPaymentSuccess or handle booking creation
      if (onPaymentSuccess) {
        await onPaymentSuccess(details);
      } else {
        // Default booking creation if no custom handler provided
        await handleBookingCreation(details);
      }
    } catch (error) {
      console.error("PayPal payment error:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleBookingCreation = async (paymentDetails) => {
    try {
      console.log("Creating booking in backend...");

      const bookingData = {
        showtimeId: showtimeDetails._id,
        showtimeSeatIds: showtimeSeatIds,
        paymentDetails: {
          paypalOrderId: paymentDetails.id,
          payerEmail: paymentDetails.payer.email_address,
          paymentStatus: paymentDetails.status,
        },
      };

      const { data: newBooking } = await api.post("/bookings", bookingData);

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
        "Your payment was successful, but we failed to confirm your booking. Please contact support with your PayPal transaction ID: " +
          paymentDetails.id
      );
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    alert("Payment failed. Please try again.");
  };

  const onCancel = () => {
    console.log("Payment cancelled by user");
  };

  return (
    <div className="payment-section">
      <div className="section-header">
        <h2>Payment Method</h2>
      </div>
      
      <div className="paypal-container">
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            disabled={isPending}
          />
        </PayPalScriptProvider>
        
        {isPending && (
          <div className="payment-processing">
            <p>Processing your payment...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPalPayment;