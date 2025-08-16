import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../api/axios";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import "./ShowtimeMG.css";

function ShowtimeMG() {
  const { user } = useAuth();
  const [showtimes, setShowtimes] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);

  const initialFormData = {
    movieId: "",
    screenId: "",
    start_date: "",
    start_time: "12:00",
    seatPrice: "",
    recurrence: { type: "none", endDate: null },
    theatreLocation: "", 
  };
  const [formData, setFormData] = useState(initialFormData);

  const fetchData = useCallback(async () => {
    if (!user || user.role !== "admin") {
      setError("You are not authorized to view this page.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [showtimesRes, moviesRes, screensRes] = await Promise.all([
        api.get("/showtimes/all/details"),
        api.get("/movies"),
        api.get("/screens"),
      ]);
      setShowtimes(showtimesRes.data);
      setMovies(moviesRes.data);
      setScreens(screensRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch required data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredShowtimes = useMemo(
    () =>
      showtimes.filter(
        (showtime) =>
          showtime.movieTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          showtime.theatreLocation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [showtimes, searchTerm]
  );

  const handleAddShowtimeClick = () => {
    setFormData(initialFormData);
    setFormVisible(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newFormData = { ...prev };

      if (name === "recurrenceType") {
        newFormData.recurrence.type = value;
      } else if (name === "endDate") {
        newFormData.recurrence.endDate = value || null;
      } else {
        newFormData[name] = value;
      }

      if (name === "screenId") {
        const selectedScreen = screens.find((screen) => screen._id === value);
        newFormData.theatreLocation = selectedScreen
          ? selectedScreen.theatreId.location
          : "";
      }

      return newFormData;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.movieId ||
      !formData.screenId ||
      !formData.start_date ||
      !formData.start_time ||
      !formData.seatPrice
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const { theatreLocation, ...dataToSend } = formData;

    try {
      await api.post("/showtimes", dataToSend);
      handleCloseForm();
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create showtime.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this showtime?"))
      return;
    try {
      await api.delete(`/showtimes/${id}`);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete showtime.");
    }
  };

  if (loading) {
    return (
      <div className='stm-loading-container'>
        <div className='loading-spinner'></div>
        <p>Loading Showtime Management...</p>
      </div>
    );
  }
  if (error && !isFormVisible) {
    return (
      <div className='stm-error-container'>
        <div className='stm-error-icon'>⚠️</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchData} className='stm-retry-btn'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='stm-container'>
      <div className='stm-header'>
        <h1>Showtime Management</h1>
        <button className='stm-add-btn' onClick={handleAddShowtimeClick}>
          <span className='stm-btn-icon'>⏰</span> Add Showtime
        </button>
      </div>
      <div className='stm-search-container'>
        <input
          type='text'
          placeholder='Search by movie or theatre...'
          className='stm-search-input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='stm-content'>
        <h2>Scheduled Showtimes ({filteredShowtimes.length})</h2>
        {filteredShowtimes.length === 0 ? (
          <div className='stm-empty-state'>
            <h3>No Showtimes Found</h3>
            <p>
              {searchTerm
                ? "No results match."
                : "Click 'Add Showtime' to start."}
            </p>
          </div>
        ) : (
          <div className='stm-table-container'>
            <table>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Screen</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShowtimes.map((showtime) => (
                  <tr key={showtime._id}>
                    <td>{showtime.movieTitle}</td>
                    <td>{showtime.theatreLocation}</td>
                    <td>Screen {showtime.screenNumber}</td>
                    <td>
                      {format(new Date(showtime.startDate), "dd MMM yyyy")}
                    </td>
                    <td>
                      <span className='stm-time-badge'>
                        {showtime.startTime}
                      </span>
                    </td>
                    <td>
                      <span className='stm-price-badge'>
                        LKR {showtime.seatPrice}
                      </span>
                    </td>
                    <td>
                      <button
                        className='stm-delete-btn'
                        title='Delete Showtime'
                        onClick={() => handleDelete(showtime._id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isFormVisible && (
        <div className='stm-modal-overlay'>
          <div className='stm-modal-content'>
            <div className='stm-modal-header'>
              <h2>Add New Showtime</h2>
              <button className='stm-modal-close' onClick={handleCloseForm}>
                ×
              </button>
            </div>
            {error && <div className='stm-error-message'>⚠️ {error}</div>}
            <form onSubmit={handleFormSubmit} className='stm-form'>
              <div className='stm-form-row'>
                <div className='stm-form-group'>
                  <label>Movie *</label>
                  <select
                    name='movieId'
                    value={formData.movieId}
                    onChange={handleFormChange}
                    required>
                    <option value='' disabled>
                      Select a movie
                    </option>
                    {movies.map((movie) => (
                      <option key={movie._id} value={movie._id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='stm-form-group'>
                  <label>Screen *</label>
                  <select
                    name='screenId'
                    value={formData.screenId}
                    onChange={handleFormChange}
                    required>
                    <option value='' disabled>
                      Select a screen
                    </option>
                    {screens.map((screen) => (
                      <option key={screen._id} value={screen._id}>
                        Screen {screen.screenNumber} -{" "}
                        {screen.theatreId?.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='stm-form-group'>
                <label>Theatre Location</label>
                <input
                  type='text'
                  name='theatreLocation'
                  value={formData.theatreLocation}
                  readOnly
                  placeholder='Auto-filled when screen is selected'
                />
              </div>
              <div className='stm-form-row'>
                <div className='stm-form-group'>
                  <label>Start Date *</label>
                  <input
                    type='date'
                    name='start_date'
                    value={formData.start_date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className='stm-form-group'>
                  <label>Time (24h format) *</label>
                  <input
                    type='time'
                    name='start_time'
                    value={formData.start_time}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className='stm-form-group'>
                  <label>Seat Price (LKR) *</label>
                  <input
                    type='number'
                    min='0'
                    step='50'
                    name='seatPrice'
                    placeholder='e.g., 1500'
                    value={formData.seatPrice}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className='stm-form-row'>
                <div className='stm-form-group'>
                  <label>Recurrence Type</label>
                  <select
                    name='recurrenceType'
                    value={formData.recurrence.type}
                    onChange={handleFormChange}>
                    <option value='none'>None (Single Day)</option>
                    <option value='daily'>Daily</option>
                  </select>
                </div>
                {formData.recurrence.type === "daily" && (
                  <div className='stm-form-group'>
                    <label>End Date</label>
                    <input
                      type='date'
                      name='endDate'
                      value={formData.recurrence.endDate || ""}
                      onChange={handleFormChange}
                      min={formData.start_date}
                    />
                  </div>
                )}
              </div>
              <div className='stm-form-actions'>
                <button
                  type='button'
                  onClick={handleCloseForm}
                  className='stm-cancel-btn'
                  disabled={submitting}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='stm-save-btn'
                  disabled={submitting}>
                  {submitting ? "Saving..." : "Save Showtime"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowtimeMG;
