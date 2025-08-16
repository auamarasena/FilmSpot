import React, { useState, useEffect, useMemo } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./ShowtimeSelector.css";

const ShowtimeSelector = ({ movieId }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(0);
  const [dates, setDates] = useState([]);
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date();
    const nextSixDays = Array.from({ length: 6 }, (_, i) => addDays(today, i));
    setDates(
      nextSixDays.map((date, index) => ({
        id: index,
        label:
          index === 0
            ? "TODAY"
            : index === 1
            ? "TOMORROW"
            : format(date, "EEE").toUpperCase(),
        date: format(date, "dd MMM"),
        fullDateObj: date,
      }))
    );
  }, []);

  useEffect(() => {
    if (!movieId) return;
    const fetchShowtimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(
          `http://localhost:5001/api/showtimes/movie/${movieId}`
        );
        setAllShowtimes(data);
      } catch (err) {
        setError("Could not load showtimes.");
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, [movieId]);

  const handleTimeClick = (showtime) => {
    navigate(`/select-seat?showtimeId=${showtime._id}`);
  };

  const showtimesForSelectedDate = useMemo(() => {
    const selectedDateObj = dates.find((d) => d.id === selectedDate);
    if (!selectedDateObj) return [];
    return allShowtimes.filter((st) =>
      isSameDay(new Date(st.startDate), selectedDateObj.fullDateObj)
    );
  }, [selectedDate, allShowtimes, dates]);

  const groupedShowtimes = useMemo(() => {
    return showtimesForSelectedDate.reduce((acc, showtime) => {
      const theatre = showtime.theatreLocation || "Unknown";
      const format = showtime.screenFormat || "Standard";
      if (!acc[theatre]) acc[theatre] = { name: theatre, formats: {} };
      if (!acc[theatre].formats[format])
        acc[theatre].formats[format] = { name: format, times: [] };
      acc[theatre].formats[format].times.push(showtime);
      acc[theatre].formats[format].times.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      return acc;
    }, {});
  }, [showtimesForSelectedDate]);

  return (
    <div className='showtime-selector'>
      <div className='date-selector'>
        {dates.map((date) => (
          <button
            key={date.id}
            className={`date-button ${
              selectedDate === date.id ? "selected" : ""
            }`}
            onClick={() => setSelectedDate(date.id)}>
            <div className='date-label'>{date.label}</div>
            <div className='date-value'>{date.date}</div>
          </button>
        ))}
      </div>
      <div className='theaters'>
        {loading && <div className='loading-spinner'>Loading showtimes...</div>}
        {error && <div className='showtime-selector-error'>⚠️ {error}</div>}
        {!loading && !error && Object.keys(groupedShowtimes).length > 0
          ? Object.values(groupedShowtimes).map((theater) => (
              <div key={theater.name} className='theater'>
                <h3>{theater.name}</h3>
                {Object.values(theater.formats).map((format) => (
                  <div key={format.name} className='format'>
                    <h4>{format.name}</h4>
                    <div className='times'>
                      {format.times.map((timeObj) => (
                        <button
                          key={timeObj._id}
                          className='time-button'
                          onClick={() => handleTimeClick(timeObj)}>
                          {timeObj.startTime}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          : !loading && (
              <div className='no-showtimes'>
                🎭 No showtimes available for the selected date.
              </div>
            )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
