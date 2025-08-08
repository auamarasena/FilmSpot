import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';
import PaymentSummary from './PaymentSummary';
import PromoCodeSection from './PromoCodeSection';
import UserDetailsSection from './UserDetailsSection';
import PayPalPayment from './PayPalPayment';
import './PaymentPage.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedSeats, totalPrice, selectedDate, selectedTime, showtimeSeatIds, showtimeId, movieTitle, userId } = location.state || {};
    
    const [discountedPrice, setDiscountedPrice] = useState(totalPrice || 0);
    const [userDetails, setUserDetails] = useState(null);
    const [showtimeDetails, setShowtimeDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Validate required data
        if (!userId || !showtimeId || !selectedSeats || !totalPrice) {
            setError('Missing required booking information');
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [userResponse, showtimeResponse] = await Promise.all([
                    apiService.auth.getUserById(userId),
                    apiService.showtimes.getById(showtimeId)
                ]);

                setUserDetails(userResponse.data);
                setShowtimeDetails(showtimeResponse.data);
            } catch (error) {
                const errorMessage = handleApiError(error, 'Failed to fetch booking details');
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, showtimeId, selectedSeats, totalPrice]);

    const handlePaymentSuccess = async (paymentDetails) => {
        try {
            console.log('PaymentPage - Starting booking creation...');
            console.log('PaymentPage - userDetails:', userDetails);
            console.log('PaymentPage - showtimeDetails:', showtimeDetails);
            console.log('PaymentPage - selectedSeats:', selectedSeats);
            console.log('PaymentPage - paymentDetails:', paymentDetails);
            
            // Create booking
            const bookingData = {
                userId: userId,
                showtimeId: showtimeId,
                showtimeSeatIds: showtimeSeatIds
            };

            console.log('PaymentPage - bookingData to send:', bookingData);
            
            const response = await apiService.bookings.create(bookingData);
            const newBooking = response.data;
            
            console.log('PaymentPage - newBooking created:', newBooking);

            // Send confirmation email
            await sendConfirmationEmail(newBooking, userDetails, showtimeDetails, paymentDetails);

            // Prepare navigation state
            const navigationState = {
                booking: newBooking,
                movieTitle,
                selectedDate,
                selectedTime,
                selectedSeats,
                totalAmount: discountedPrice,
                userDetails,
                showtimeDetails
            };
            
            console.log('PaymentPage - Navigating to BookingSuccess with state:', navigationState);

            
            navigate('/BookingSuccess', {
                state: navigationState
            });
        } catch (error) {
            console.error('Booking creation failed:', error);
            throw new Error('Failed to create booking. Please contact support.');
        }
    };

    const sendConfirmationEmail = async (booking, userDetails, showtimeDetails, paymentDetails) => {
       
        console.log('Sending confirmation email...', {
            booking,
            userDetails,
            showtimeDetails,
            paymentDetails
        });
    };

    if (isLoading) {
        return (
            <div className="payment-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-page">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <h1 className="page-title">Complete Your Booking</h1>
                </div>

                <PaymentSummary
                    movieTitle={movieTitle}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedSeats={selectedSeats}
                    totalPrice={discountedPrice}
                    showtimeDetails={showtimeDetails}
                />

                <PromoCodeSection
                    totalPrice={totalPrice}
                    discountedPrice={discountedPrice}
                    setDiscountedPrice={setDiscountedPrice}
                />

                <UserDetailsSection userDetails={userDetails} />

                <PayPalPayment
                    amount={discountedPrice}
                    movieTitle={movieTitle}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedSeats={selectedSeats}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </div>
        </div>
    );
};

export default PaymentPage; 