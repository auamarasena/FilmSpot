import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./SeatSelection.css";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtime, setShowtime] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();


  const ws = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const showtimeId = queryParams.get("showtimeId");

  useEffect(() => {
    if (!showtimeId) {
      setError("No showtime selected. Please go back and pick a time.");
      setLoading(false);
      return;
    }
    const fetchSeatAndShowtimeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [showtimeRes, seatsRes] = await Promise.all([
          api.get(`/showtimes/${showtimeId}`),
          api.get(`/showtimes/${showtimeId}/seats`),
        ]);

        setShowtime(showtimeRes.data);

        const groupedSeats = seatsRes.data.reduce((acc, seat) => {
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
      } catch (err) {
        setError("Failed to load seating information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeatAndShowtimeData();

    // 2. Establish WebSocket connection
    ws.current = new WebSocket("ws://localhost:5001");

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
      ws.current.send(
        JSON.stringify({
          action: "join_showtime_room",
          showtimeId: showtimeId,
        })
      );
    };

    // 3. Listen for messages from the server
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Update the UI in real-time 
      if (message.type === "seat_locked" || message.type === "seat_unlocked") {
        const newStatus =
          message.type === "seat_locked" ? "locked" : "available";

        setSeats((prevSeats) => {
          const updatedSeats = JSON.parse(JSON.stringify(prevSeats)); 
          for (const row in updatedSeats) {
            const seatIndex = updatedSeats[row].findIndex(
              (s) => s.id === message.showtimeSeatId
            );
            if (seatIndex !== -1) {
              updatedSeats[row][seatIndex].status = newStatus;
              break; // Seat found and updated, exit loop
            }
          }
          return updatedSeats;
        });
      }
    };

    ws.current.onclose = () => console.log("WebSocket connection closed");
    ws.current.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [showtimeId]);

  // Effect to unlock seats if the user navigates away
  useEffect(() => {
    return () => {
      if (
        ws.current?.readyState === WebSocket.OPEN &&
        selectedSeats.length > 0
      ) {
        selectedSeats.forEach((seat) => {
          ws.current.send(
            JSON.stringify({ action: "unlock_seat", showtimeSeatId: seat.id })
          );
        });
      }
    };
  }, [selectedSeats]);

  const handleSeatClick = (seatId, seatNumber, status) => {
    const isCurrentlySelected = selectedSeats.some((s) => s.id === seatId);

    // Prevent clicking on seats that are already booked or locked by another user
    if (status === "booked" || (status === "locked" && !isCurrentlySelected))
      return;

    // Send a message to the backend via WebSocket to lock or unlock the seat
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          action: isCurrentlySelected ? "unlock_seat" : "lock_seat",
          showtimeSeatId: seatId,
        })
      );
    }

    // Update our local selection state to reflect the change immediately
    setSelectedSeats((prev) =>
      isCurrentlySelected
        ? prev.filter((s) => s.id !== seatId)
        : [...prev, { id: seatId, number: seatNumber }]
    );
  };

  const handleContinue = () => {
    if (!isAuthenticated) {
      navigate("/sign-in", { state: { from: location } });
      return;
    }
    navigate("/payment", {
      state: {
        selectedSeats: selectedSeats.map((seat) => seat.number),
        showtimeSeatIds: selectedSeats.map((seat) => seat.id),
        totalPrice: calculatePrice,
        showtimeDetails: showtime,
        movieTitle: showtime.movieId.title,
      },
    });
  };

  const calculatePrice = showtime
    ? selectedSeats.length * showtime.seatPrice
    : 0;

  if (loading)
    return <div className='seat-selection-loading'>Loading Seats...</div>;
  if (error) return <div className='seat-selection-error'>Error: {error}</div>;
  if (!showtime)
    return (
      <div className='seat-selection-error'>
        Showtime data could not be loaded.
      </div>
    );

  const rows = Object.keys(seats).sort();
  const formattedShowtimeDate = format(
    new Date(showtime.start_date),
    "EEEE, dd MMM yyyy"
  );

  return (
    <div className='seat-selection'>
      <div className='header-ss'>
        <h1>{showtime.movieId.title}</h1>
        <p>
          {showtime.screenId.theatreId.location} | {showtime.screenId.format} |{" "}
          {formattedShowtimeDate} | {showtime.start_time}
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
                  : seat.status === "locked"
                  ? "locked"
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
          <div className='legend-seat legend-locked'></div>
          <span>Unavailable</span>
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
          className='continue btn btn-primary'
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}>
          {isAuthenticated ? "Continue to Payment" : "Login to Continue"}
        </button>
        <button className='back btn btn-secondary' onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
