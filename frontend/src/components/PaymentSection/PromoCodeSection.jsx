import React, { useState } from "react";

const PromoCodeSection = ({
  totalPrice,
  discountedPrice,
  setDiscountedPrice,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const promoCodes = {
    DISCOUNT20: { percentage: 20, description: "20% discount" },
    SAVE10: { percentage: 10, description: "10% discount" },
    WELCOME15: { percentage: 15, description: "15% welcome discount" },
  };

  const handleInputChange = (event) => {
    setPromoCode(event.target.value.toUpperCase());
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setDiscountMessage("Please enter a promo code");
      return;
    }

    const promo = promoCodes[promoCode];
    if (promo) {
      const discountAmount = totalPrice * (promo.percentage / 100);
      const newTotal = totalPrice - discountAmount;

      setDiscount(discountAmount);
      setDiscountedPrice(newTotal);
      setDiscountMessage(
        `${promo.description} applied! You saved Rs. ${discountAmount.toFixed(
          2
        )}`
      );
      setIsApplied(true);
    } else {
      setDiscountMessage("Invalid promo code. Please try again.");
      resetDiscount();
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountMessage("");
    resetDiscount();
  };

  const resetDiscount = () => {
    setDiscount(0);
    setDiscountedPrice(totalPrice);
    setIsApplied(false);
  };

  return (
    <div className='payment-section'>
      <div className='section-header'>
        <h2>Promo Code</h2>
        <p className='section-subtitle'>Have a discount code? Apply it here</p>
      </div>

      <div className='promo-content'>
        <div className='promo-input-group'>
          <input
            type='text'
            placeholder='Enter promo code'
            className='input promo-input'
            value={promoCode}
            onChange={handleInputChange}
            disabled={isApplied}
          />
          {!isApplied ? (
            <button
              className='btn btn-secondary'
              onClick={applyPromoCode}
              disabled={!promoCode.trim()}>
              Apply
            </button>
          ) : (
            <button className='btn btn-outline' onClick={removePromoCode}>
              Remove
            </button>
          )}
        </div>

        {discountMessage && (
          <div className={`message ${isApplied ? "success" : "error"}`}>
            {discountMessage}
          </div>
        )}

        {isApplied && (
          <div className='discount-summary'>
            <div className='discount-row'>
              <span>Subtotal:</span>
              <span>Rs. {totalPrice}</span>
            </div>
            <div className='discount-row'>
              <span>Discount:</span>
              <span className='discount-amount'>
                -Rs. {discount.toFixed(2)}
              </span>
            </div>
            <div className='discount-row total'>
              <span>Final Total:</span>
              <span>Rs. {discountedPrice}</span>
            </div>
          </div>
        )}

        <div className='available-codes'>
          <p className='codes-title'>Available Codes:</p>
          <div className='codes-list'>
            {Object.entries(promoCodes).map(([code, details]) => (
              <span key={code} className='code-tag'>
                {code} - {details.description}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeSection;
