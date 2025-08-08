import React, { useState } from 'react';

const UserDetailsSection = ({ userDetails }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);

    if (!userDetails) {
        return (
            <div className="payment-section">
                <div className="section-header">
                    <h2>Customer Details</h2>
                </div>
                <div className="loading-content">
                    <p>Loading customer details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-section">
            <div className="section-header">
                <h2>Customer Details</h2>
                <p className="section-subtitle">Verify your information below</p>
            </div>
            
            <div className="user-details-content">
                <div className="details-grid">
                    <div className="detail-group">
                        <label className="detail-label">Full Name</label>
                        <div className="detail-value">
                            {userDetails.firstName} {userDetails.lastName}
                        </div>
                    </div>

                    <div className="detail-group">
                        <label className="detail-label">Mobile Number</label>
                        <div className="detail-value">
                            {userDetails.mobile || 'Not provided'}
                        </div>
                    </div>

                    <div className="detail-group">
                        <label className="detail-label">Email Address</label>
                        <div className="detail-value">
                            {userDetails.email}
                        </div>
                    </div>
                </div>

                <div className="terms-section">
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="terms"
                            className="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label htmlFor="terms" className="checkbox-label">
                            I agree to the{' '}
                            <a href="/terms" target="_blank" rel="noopener noreferrer" className="terms-link">
                                Terms and Conditions
                            </a>
                            {' '}and{' '}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="terms-link">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                </div>

                {!termsAccepted && (
                    <div className="terms-warning">
                        Please accept the terms and conditions to proceed with payment
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailsSection; 