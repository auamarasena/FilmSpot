import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./TheatreManage.css";

function AddTheatrePopup({ onSubmit, onClose, submitting, error }) {
  const [location, setLocation] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    onSubmit({ location });
  };
  return (
    <div className='tm-modal-overlay'>
      <div className='tm-modal-content'>
        <div className='tm-modal-header'>
          <h2>Add New Theatre</h2>
          <button className='tm-modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        {error && <div className='tm-error-message'>{error}</div>}
        <form onSubmit={handleSubmit} className='tm-form'>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='e.g., Colombo City Center'
            required
          />
          <div className='tm-form-actions'>
            <button type='button' onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type='submit' disabled={submitting}>
              {submitting ? "Saving..." : "Save Theatre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddScreenPopup({ theatres, onSubmit, onClose, submitting, error }) {
  const [formData, setFormData] = useState({
    theatreId: "",
    screenNumber: "",
    format: "",
    rowCount: "",
    seatPerRow: "",
  });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div className='tm-modal-overlay'>
      <div className='tm-modal-content'>
        <div className='tm-modal-header'>
          <h2>Add New Screen</h2>
          <button className='tm-modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        {error && <div className='tm-error-message'>{error}</div>}
        <form onSubmit={handleSubmit} className='tm-form'>
          <select
            name='theatreId'
            value={formData.theatreId}
            onChange={handleChange}
            required>
            <option value='' disabled>
              Select Theatre *
            </option>
            {theatres.map((t) => (
              <option key={t._id} value={t._id}>
                {t.location}
              </option>
            ))}
          </select>
          <input
            type='number'
            name='screenNumber'
            value={formData.screenNumber}
            onChange={handleChange}
            placeholder='Screen Number *'
            required
          />
          <input
            type='text'
            name='format'
            value={formData.format}
            onChange={handleChange}
            placeholder='Format (e.g., 4K Dolby Atmos) *'
            required
          />
          <input
            type='number'
            name='rowCount'
            value={formData.rowCount}
            onChange={handleChange}
            placeholder='Number of Rows *'
            required
          />
          <input
            type='number'
            name='seatPerRow'
            value={formData.seatPerRow}
            onChange={handleChange}
            placeholder='Seats Per Row *'
            required
          />
          <div className='tm-form-actions'>
            <button type='button' onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type='submit' disabled={submitting}>
              {submitting ? "Saving..." : "Save Screen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TheatreManage() {
  const { user } = useAuth();
  const [theatreData, setTheatreData] = useState([]);
  const [popup, setPopup] = useState({ type: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTheatres = useCallback(async () => {
    if (!user || user.role !== "admin") {
      setError("You are not authorized to view this page.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Use relative path
      const { data } = await api.get("/theatres/with-screens");
      setTheatreData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch theatre data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTheatres();
  }, [fetchTheatres]);

  const handleAddTheatre = async (newTheatre) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/theatres", newTheatre);
      setPopup({ type: null });
      fetchTheatres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add theatre.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddScreen = async (newScreenData) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/screens", newScreenData);
      setPopup({ type: null });
      fetchTheatres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add screen.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTheatre = async (theatreId) => {
    if (
      !window.confirm(
        "Are you sure? This will delete the theatre and ALL its screens. This action cannot be undone."
      )
    )
      return;
    try {
      // THIS IS THE FIX: Use 'api.delete'
      await api.delete(`/theatres/${theatreId}`);
      fetchTheatres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete theatre.");
    }
  };

  const filteredTheatres = useMemo(
    () =>
      theatreData.filter((theatre) =>
        theatre.location?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [theatreData, searchTerm]
  );

  if (loading) {
    return (
      <div className='tm-loading-container'>Loading Theatre Management...</div>
    );
  }
  if (error && !popup.type) {
    return (
      <div className='tm-error-container'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchTheatres}>Retry</button>
      </div>
    );
  }

  return (
    <div className='tm-container'>
      <div className='tm-header'>
        <h1>Theatre Management</h1>
        <div className='tm-actions'>
          <button
            className='tm-add-btn'
            onClick={() => setPopup({ type: "addTheatre" })}>
            Add Theatre
          </button>
          <button
            className='tm-add-btn secondary'
            onClick={() => setPopup({ type: "addScreen" })}>
            Add Screen
          </button>
        </div>
      </div>
      <div className='tm-search-container'>
        <input
          type='text'
          placeholder='Search theatres by location...'
          className='tm-search-input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='tm-content'>
        <h2>Theatre List ({filteredTheatres.length})</h2>
        {filteredTheatres.length === 0 ? (
          <div className='tm-empty-state'>
            <h3>No Theatres Found</h3>
            <p>
              {searchTerm
                ? "No theatres match your search."
                : "Click 'Add Theatre' to get started."}
            </p>
          </div>
        ) : (
          <table className='tm-table'>
            <thead>
              <tr>
                <th>Location</th>
                <th>Screens & Details</th>
                <th>Total Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTheatres.map((theatre) => {
                const totalCapacity =
                  theatre.screens?.reduce(
                    (total, screen) =>
                      total + screen.rowCount * screen.seatPerRow,
                    0
                  ) || 0;
                return (
                  <tr key={theatre._id}>
                    <td data-label='Location'>{theatre.location}</td>
                    <td data-label='Screens'>
                      {theatre.screens?.length > 0
                        ? theatre.screens.map((s) => (
                            <div key={s._id}>
                              Screen {s.screenNumber} - {s.format}
                            </div>
                          ))
                        : "No screens added"}
                    </td>
                    <td data-label='Capacity'>{totalCapacity} seats</td>
                    <td data-label='Actions'>
                      <button
                        className='tm-delete-btn'
                        title='Delete Theatre'
                        onClick={() => handleDeleteTheatre(theatre._id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {popup.type === "addTheatre" && (
        <AddTheatrePopup
          onSubmit={handleAddTheatre}
          onClose={() => setPopup({ type: null })}
          submitting={submitting}
          error={error}
        />
      )}
      {popup.type === "addScreen" && (
        <AddScreenPopup
          theatres={theatreData}
          onSubmit={handleAddScreen}
          onClose={() => setPopup({ type: null })}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}

export default TheatreManage;
