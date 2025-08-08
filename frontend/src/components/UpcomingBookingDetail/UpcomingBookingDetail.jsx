import React from "react";
import "./UpcomingBookingDetail.css";
import {
  FaTicketAlt,
  FaUser,
  FaCalendarAlt,
  FaFilm,
  FaDesktop,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";

const sampleBookingData = {
  bookingDetails: {
    ticketNo: "TKT123456789",
    seatCount: 2,
    totalAmount: "550.00",
    booking_date: "2025-10-26T10:00:00.000Z",
  },
  userDetails: {
    firstName: "John",
    lastName: "Doe",
    mobile: "987-654-3210",
    email: "john.doe@example.com",
  },
  movieDetails: {
    title: "Echoes of Tomorrow",
    posterUrl:
      "https://via.placeholder.com/300x450/FF6347/FFFFFF?text=Echoes+of+Tomorrow", // Example poster
  },
  theatreDetails: {
    name: "Cineplex Grand",
    location: "Metropolis City",
  },
  screenDetails: {
    screenNumber: 5,
    format: "IMAX 3D",
  },
  seatNumbers: ["D5", "D6"],
};

const InfoItem = ({ icon, label, value }) => (
  <div className='info-item'>
    <div className='icon-wrapper'>{icon}</div>
    <div className='text-wrapper'>
      <span className='label'>{label}</span>
      <span className='value'>{value}</span>
    </div>
  </div>
);

//Main Booking Component
function Booking() {
  const {
    bookingDetails,
    userDetails,
    movieDetails,
    theatreDetails,
    screenDetails,
    seatNumbers,
  } = sampleBookingData;

  // Format the booking date
  const formattedDate = new Date(
    bookingDetails.booking_date
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className='booking-container'>
      <div className='booking-card'>
        <div className='card-header'>
          <img
            src={movieDetails.posterUrl}
            alt={`${movieDetails.title} Poster`}
            className='movie-poster'
          />
          <div className='header-content'>
            <h1 className='movie-title'>{movieDetails.title}</h1>
            <p className='theatre-info'>
              <FaMapMarkerAlt /> {theatreDetails.name},{" "}
              {theatreDetails.location}
            </p>
          </div>
        </div>

        <div className='card-body'>
          <h2 className='section-title'>Your Ticket Details</h2>
          <div className='details-grid'>
            <InfoItem
              icon={<FaTicketAlt />}
              label='Ticket No'
              value={bookingDetails.ticketNo}
            />
            <InfoItem
              icon={<FaDesktop />}
              label='Screen'
              value={`${screenDetails.screenNumber} - ${screenDetails.format}`}
            />
            <InfoItem
              icon={<FaUser />}
              label='Seats'
              value={`${bookingDetails.seatCount} (${seatNumbers.join(", ")})`}
            />
            <InfoItem
              icon={<FaCalendarAlt />}
              label='Date'
              value={formattedDate}
            />
            <InfoItem
              icon={<FaMoneyBillWave />}
              label='Total Amount'
              value={`$${bookingDetails.totalAmount}`}
            />
          </div>

          <hr className='divider' />

          <h2 className='section-title'>Customer Information</h2>
          <div className='details-grid'>
            <InfoItem
              icon={<FaUser />}
              label='Name'
              value={`${userDetails.firstName} ${userDetails.lastName}`}
            />
            <InfoItem
              icon={<FaFilm />}
              label='Mobile'
              value={userDetails.mobile}
            />
            <InfoItem
              icon={<FaFilm />}
              label='Email'
              value={userDetails.email}
            />
          </div>
        </div>

        <div className='card-footer'>
          <p className='note'>
            <strong>Note:</strong> All sales are final. Please arrive at least
            15 minutes before the showtime.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Booking;
