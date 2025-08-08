import React, { useEffect, useRef, useState } from "react";

const PayPalPayment = ({
  amount,
  movieTitle,
  selectedDate,
  selectedTime,
  selectedSeats,
  onPaymentSuccess,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptError, setIsScriptError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const paypalContainerRef = useRef(null);

  useEffect(() => {
    console.log("🚀 Loading PayPal SDK...");

    // Simple script loading approach (from working fallback)
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AfIVO7Ti9-VJzpR6sKoU1ympvAdOcNwogZY9zGOYXmQroAAVadJtukjeOK51go2ek_e6esOXAW_cVEvH&currency=USD&intent=capture";

    script.onload = () => {
      console.log("✅ PayPal SDK loaded successfully");
      setIsScriptLoaded(true);
      setIsScriptError(false);

      if (window.paypal && paypalContainerRef.current) {
        console.log("🎨 Initializing PayPal buttons...");
        const usdAmount = (amount / 300).toFixed(2);
        console.log("💰 Amount: Rs.", amount, "→ $", usdAmount);

        try {
          window.paypal
            .Buttons({
              style: {
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "paypal",
                height: 50,
              },

              createOrder: (data, actions) => {
                console.log("📝 Creating PayPal order...");
                const orderDescription = `Movie: ${movieTitle} | Date: ${selectedDate} | Time: ${selectedTime} | Seats: ${selectedSeats.join(
                  ", "
                )}`;

                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: usdAmount,
                        currency_code: "USD",
                      },
                      description: orderDescription.substring(0, 127),
                      custom_id: `booking_${Date.now()}`,
                      invoice_id: `INV_${Date.now()}`,
                    },
                  ],
                  application_context: {
                    brand_name: "CINEX Movie Booking",
                    locale: "en-US",
                    landing_page: "BILLING",
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                  },
                });
              },

              onApprove: async (data, actions) => {
                console.log("✅ PayPal payment approved, capturing...");
                setIsProcessing(true);

                try {
                  const order = await actions.order.capture();
                  console.log("🎉 Payment captured successfully:", order);

                  const paymentDetails = {
                    orderId: order.id,
                    payerId: order.payer.payer_id,
                    amount: order.purchase_units[0].amount.value,
                    currency: order.purchase_units[0].amount.currency_code,
                    status: order.status,
                    createTime: order.create_time,
                    updateTime: order.update_time,
                    paymentMethod: "PayPal",
                  };

                  await onPaymentSuccess(paymentDetails);
                } catch (error) {
                  console.error("❌ Payment processing failed:", error);
                  setIsScriptError(true);
                  alert(
                    "Payment was successful, but booking creation failed. Please contact support with your PayPal transaction ID: " +
                      data.orderID
                  );
                } finally {
                  setIsProcessing(false);
                }
              },

              onError: (err) => {
                console.error("❌ PayPal payment error:", err);
                setIsScriptError(true);
                setIsProcessing(false);
                alert("Payment failed. Please try again or contact support.");
              },

              onCancel: (data) => {
                console.log("⚠️ Payment cancelled by user:", data);
                setIsProcessing(false);
              },
            })
            .render(paypalContainerRef.current)
            .then(() => {
              console.log("🎉 PayPal buttons rendered successfully!");
              setIsInitialized(true);
            })
            .catch((err) => {
              console.error("❌ PayPal render error:", err);
              setIsScriptError(true);
            });
        } catch (error) {
          console.error("❌ PayPal initialization error:", error);
          setIsScriptError(true);
        }
      }
    };

    script.onerror = () => {
      console.error("❌ Failed to load PayPal SDK");
      setIsScriptError(true);
      setIsScriptLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    amount,
    movieTitle,
    selectedDate,
    selectedTime,
    selectedSeats,
    onPaymentSuccess,
  ]);

  const retryPayment = () => {
    setIsScriptError(false);
    setIsScriptLoaded(false);
    setIsInitialized(false);
    setIsProcessing(false);

    // Reload the page to retry
    window.location.reload();
  };

  return (
    <div className='payment-section'>
      <div className='section-header'>
        <h2>Payment Method</h2>
        <p className='section-subtitle'>
          Complete your payment securely with PayPal
        </p>
      </div>

      <div className='payment-content'>
        <div className='payment-amount'>
          <div className='amount-display'>
            <span className='amount-label'>Total Amount:</span>
            <span className='amount-value'>Rs. {amount}</span>
            <span className='amount-usd'>
              (≈ ${(amount / 300).toFixed(2)} USD)
            </span>
          </div>
        </div>

        <div className='paypal-container'>
          {!isScriptLoaded && !isScriptError && (
            <div className='loading-paypal'>
              <div className='spinner'></div>
              <p>Loading PayPal payment options...</p>
            </div>
          )}

          {isScriptError && (
            <div className='error-container'>
              <div className='error-message'>
                <h3>Payment Error</h3>
                <p>
                  Unable to load payment options. Please check your internet
                  connection and try again.
                </p>
                <button className='btn btn-primary' onClick={retryPayment}>
                  Retry Payment
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className='processing-overlay'>
              <div className='processing-content'>
                <div className='spinner'></div>
                <p>Processing your payment...</p>
                <small>Please do not close this window</small>
              </div>
            </div>
          )}

          <div
            ref={paypalContainerRef}
            className='paypal-buttons-container'
            style={{
              minHeight: "200px",
              border:
                process.env.NODE_ENV === "development"
                  ? "2px dashed #666"
                  : "none",
              borderRadius: "8px",
              position: "relative",
            }}>
            {!isInitialized &&
              isScriptLoaded &&
              !isProcessing &&
              !isScriptError && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#999",
                  }}>
                  Initializing PayPal buttons...
                </div>
              )}
          </div>
        </div>

        <div className='payment-security'>
          <div className='security-info'>
            <p>
              🔒 Your payment is secured by PayPal's industry-leading encryption
            </p>
            <p>💳 We accept all major credit cards through PayPal</p>
            <p>🛡️ Your financial information is never stored on our servers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment;
