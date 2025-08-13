import React, { useState, useEffect, useMemo } from "react";
import { format, addDays, parse, isValid } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import "./ShowtimeSelector.css";

const getMockDate = (dayOffset) =>
  format(addDays(new Date(), dayOffset), "yyyy-MM-dd");

const mockMovies = [
  { _id: "movie-1", title: "Dune: Part Two" },
  { _id: "movie-2", title: "Oppenheimer" },
];

const mockTheatres = {
  "theatre-1": { _id: "theatre-1", location: "Colombo City Center" },
  "theatre-2": { _id: "theatre-2", location: "One Galle Face PVR" },
};

const mockScreens = {
  "screen-1a": {
    _id: "screen-1a",
    theatreId: "theatre-1",
    format: "4K Dolby Atmos",
  },
  "screen-1b": { _id: "screen-1b", theatreId: "theatre-1", format: "IMAX" },
  "screen-2a": {
    _id: "screen-2a",
    theatreId: "theatre-2",
    format: "Standard 2D",
  },
};

const mockShowtimes = [
  {
    _id: "st-1",
    movieId: "movie-1",
    screenId: "screen-1a",
    start_date: getMockDate(0),
    start_time: "14:30",
  },
  {
    _id: "st-2",
    movieId: "movie-1",
    screenId: "screen-1a",
    start_date: getMockDate(0),
    start_time: "17:00",
  },
  {
    _id: "st-3",
    movieId: "movie-1",
    screenId: "screen-1b",
    start_date: getMockDate(0),
    start_time: "19:00",
  },
  {
    _id: "st-4",
    movieId: "movie-2",
    screenId: "screen-2a",
    start_date: getMockDate(0),
    start_time: "20:00",
  },
  {
    _id: "st-5",
    movieId: "movie-1",
    screenId: "screen-1a",
    start_date: getMockDate(1),
    start_time: "11:00",
  },
  {
    _id: "st-6",
    movieId: "movie-1",
    screenId: "screen-2a",
    start_date: getMockDate(1),
    start_time: "15:00",
  },
  {
    _id: "st-7",
    movieId: "movie-1",
    screenId: "screen-1b",
    start_date: getMockDate(2),
    start_time: "21:00",
  },
];

function createSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const ShowtimeSelector = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(0);
  const [dates, setDates] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const movie = mockMovies.find((m) => createSlug(m.title) === id);
    if (movie) {
      setMovieTitle(movie.title);
    } else {
      setError(`Movie with slug "${id}" not found in mock data.`);
    }
  }, [id]);

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
        fullDate: format(date, "yyyy-MM-dd"),
      }))
    );
  }, []);

  useEffect(() => {
    if (!movieTitle || dates.length === 0) return;
    setLoading(true);
    setError(null);
    const selectedDateObj = dates.find((date) => date.id === selectedDate);

    setTimeout(() => {
      try {
        const currentMovie = mockMovies.find((m) => m.title === movieTitle);
        if (!currentMovie) throw new Error("Movie not found in mock data.");

        const filtered = mockShowtimes.filter(
          (st) =>
            st.movieId === currentMovie._id &&
            st.start_date === selectedDateObj.fullDate
        );
        setShowtimes(filtered);
      } catch (err) {
        setError(err.message);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [selectedDate, dates, movieTitle]);

  const handleDateClick = (dateId) => setSelectedDate(dateId);
  const handleTimeClick = (showtime) => {
    navigate(
      `/SeatSelection?showtimeId=${
        showtime._id
      }&movieTitle=${encodeURIComponent(movieTitle)}`
    );
  };

  const groupedShowtimes = useMemo(() => {
    return showtimes.reduce((acc, showtime) => {
      const screen = mockScreens[showtime.screenId];
      if (!screen) return acc;
      const theatre = mockTheatres[screen.theatreId];
      if (!theatre) return acc;

      const timeFormat = format(
        parse(showtime.start_time, "HH:mm", new Date()),
        "h:mm a"
      );

      if (!acc[theatre.location]) {
        acc[theatre.location] = { name: theatre.location, formats: {} };
      }
      if (!acc[theatre.location].formats[screen.format]) {
        acc[theatre.location].formats[screen.format] = {
          name: screen.format,
          times: [],
        };
      }
      acc[theatre.location].formats[screen.format].times.push({
        time: timeFormat,
        showtime,
      });
      acc[theatre.location].formats[screen.format].times.sort((a, b) =>
        a.showtime.start_time.localeCompare(b.showtime.start_time)
      );

      return acc;
    }, {});
  }, [showtimes]);

  if (error) {
    return <div className='showtime-selector-error'>⚠️ {error}</div>;
  }

  return (
    <div className='showtime-selector'>
      <h2>{movieTitle}</h2>
      <p className='subtitle'>Select a Date & Time</p>
      <div className='date-selector'>
        {dates.map((date) => (
          <button
            key={date.id}
            className={`date-button ${
              selectedDate === date.id ? "selected" : ""
            }`}
            onClick={() => handleDateClick(date.id)}>
            <div className='date-label'>{date.label}</div>
            <div className='date-value'>{date.date}</div>
          </button>
        ))}
      </div>
      <div className='theaters'>
        {loading ? (
          <div className='loading-spinner'>
            <div>🎬 Loading showtimes...</div>
          </div>
        ) : Object.keys(groupedShowtimes).length > 0 ? (
          Object.values(groupedShowtimes).map((theater) => (
            <div key={theater.name} className='theater'>
              <h3>{theater.name}</h3>
              {Object.values(theater.formats).map((format) => (
                <div key={format.name} className='format'>
                  <h4>{format.name}</h4>
                  <div className='times'>
                    {format.times.map((timeObj) => (
                      <button
                        key={timeObj.showtime._id}
                        className='time-button'
                        onClick={() => handleTimeClick(timeObj.showtime)}>
                        {timeObj.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className='no-showtimes'>
            🎭 No showtimes available for the selected date. Please try another
            day.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
