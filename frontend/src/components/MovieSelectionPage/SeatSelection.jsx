import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const mockShowtime = {
  _id: "mock-showtime-1",
  screenId: { _id: "mock-screen-1" },
  seatPrice: 1500.0,
  start_date: new Date().toISOString(),
  start_time: "07:00 PM",
};

const mockScreen = {
  _id: "mock-screen-1",
  theatreId: "mock-theatre-1",
  format: "4K Dolby Atmos",
};

const mockTheatre = {
  _id: "mock-theatre-1",
  location: "Colombo City Center",
};

const generateMockSeats = () => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E"];
  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      let status = "available";
      if ((row === "C" && (i === 5 || i === 6)) || (row === "D" && i > 7)) {
        status = "booked";
      }
      seats.push({
        _id: `${row}${i}`,
        seatNumber: `${row}${i}`,
        status: status,
      });
    }
  }
  return seats;
};

const mockSeatsData = generateMockSeats();

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [theatreLocation, setTheatreLocation] = useState("");
  const [screenFormat, setScreenFormat] = useState("");
  const navigate = useNavigate();

  const showtimeId = mockShowtime._id;
  const movieTitle = "Inception";
  const userId = localStorage.getItem("userId") || "mockUser123";

  useEffect(() => {
    const fetchSeatAndShowtimeData = () => {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          if (showtimeId === mockShowtime._id) {
            setShowtime(mockShowtime);
            setScreenFormat(mockScreen.format);
            setTheatreLocation(mockTheatre.location);

            const groupedSeats = mockSeatsData.reduce((acc, seat) => {
              const row = seat.seatNumber.charAt(0);
              if (!acc[row]) acc[row] = [];
              acc[row].push({
                id: seat._id,
                number: seat.seatNumber,
                status: seat.status,
              });
              return acc;
            }, {});
            setSeats(groupedSeats);
          } else {
            throw new Error("Showtime not found.");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }, 1500);
    };

    fetchSeatAndShowtimeData();
  }, [showtimeId]);

  const rows = Object.keys(seats).sort();

  const handleSeatClick = (seatId, seatNumber, status) => {
    if (status === "booked") return;
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seatId);
      if (isSelected) {
        return prev.filter((s) => s.id !== seatId);
      } else {
        return [...prev, { id: seatId, number: seatNumber }];
      }
    });
  };

  const calculatePrice = showtime
    ? selectedSeats.length * showtime.seatPrice
    : 0;
  const formattedShowtimeDate = showtime
    ? format(new Date(showtime.start_date), "dd MMM yyyy")
    : "Loading...";
  const formattedShowtimeTime = showtime ? showtime.start_time : "Loading...";

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        selectedSeats: selectedSeats.map((seat) => seat.number),
        showtimeSeatIds: selectedSeats.map((seat) => seat.id),
        totalPrice: calculatePrice,
        selectedDate: formattedShowtimeDate,
        selectedTime: formattedShowtimeTime,
        showtimeId: showtimeId,
        movieTitle: movieTitle,
        userId: userId,
      },
    });
  };

  const handleBack = () => window.history.back();

  if (loading) {
    return <div className='seat-selection-loading'>Loading Seats...</div>;
  }
  if (error) {
    return <div className='seat-selection-error'>Error: {error}</div>;
  }

  return (
    <div className='seat-selection'>
      <div className='header-ss'>
        <h1>{movieTitle}</h1>
        <p>
          {theatreLocation} | {screenFormat} | {formattedShowtimeDate} |{" "}
          {formattedShowtimeTime}
        </p>
      </div>
      <div className='screen'>SCREEN THIS WAY</div>
      <div className='seating'>
        {rows.map((row) => (
          <div key={row} className='row' data-row={row}>
            {seats[row].map((seat) => {
              const isSelected = selectedSeats.some((s) => s.id === seat.id);
              const seatClass = `seat ${
                seat.status === "booked"
                  ? "booked"
                  : isSelected
                  ? "selected"
                  : "available"
              }`;
              return (
                <div
                  key={seat.id}
                  className={seatClass}
                  onClick={() =>
                    handleSeatClick(seat.id, seat.number, seat.status)
                  }>
                  {seat.number}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className='legend'>
        <div className='legend-item'>
          <div className='legend-seat legend-available'></div>
          <span>Available</span>
        </div>
        <div className='legend-item'>
          <div className='legend-seat legend-selected'></div>
          <span>Selected</span>
        </div>
        <div className='legend-item'>
          <div className='legend-seat legend-booked'></div>
          <span>Booked</span>
        </div>
      </div>
      <div className='summary'>
        <p>
          Selected Seats:{" "}
          {selectedSeats.map((seat) => seat.number).join(", ") || "None"}
        </p>
        <p>Total Tickets: {selectedSeats.length}</p>
        <p>Total Price: LKR {calculatePrice.toFixed(2)}</p>
      </div>
      <div className='actions'>
        <button
          className='continue'
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}>
          Continue
        </button>
        <button className='back' onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
