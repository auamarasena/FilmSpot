import React, { useState, useEffect } from "react";
import "./TheatreManage.css";

const mockInitialTheatreData = [
  {
    _id: "theatre-1",
    location: "Colombo City Center",
    screens: [
      {
        _id: "screen-1a",
        screenNumber: 1,
        format: "4K Dolby Atmos",
        rowCount: 8,
        seatPerRow: 12,
      },
      {
        _id: "screen-1b",
        screenNumber: 2,
        format: "IMAX 3D",
        rowCount: 10,
        seatPerRow: 15,
      },
    ],
  },
  {
    _id: "theatre-2",
    location: "One Galle Face PVR",
    screens: [
      {
        _id: "screen-2a",
        screenNumber: 1,
        format: "Standard 2D",
        rowCount: 7,
        seatPerRow: 10,
      },
    ],
  },
  {
    _id: "theatre-3",
    location: "Kandy City Center",
    screens: [],
  },
];

function TheatreManage() {
  const [theatreData, setTheatreData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate a 1-second network delay
    setTimeout(() => {
      try {
        setTheatreData(mockInitialTheatreData);
      } catch (err) {
        setError("Failed to load mock data.");
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleAddTheatre = (newTheatre) => {
    setSubmitting(true);
    setError(null);
    setTimeout(() => {
      try {
        const newTheatreWithId = {
          ...newTheatre,
          _id: `theatre-${new Date().getTime()}`, // Create a unique ID
          screens: [],
        };
        setTheatreData((prevData) => [...prevData, newTheatreWithId]);
        setPopup({ type: null, data: null }); // Close popup on success
      } catch (err) {
        setError("Failed to add theatre locally.");
      } finally {
        setSubmitting(false);
      }
    }, 1000);
  };

  const handleAddScreen = (newScreenData) => {
    setSubmitting(true);
    setError(null);
    setTimeout(() => {
      try {
        const newScreenWithId = {
          ...newScreenData,
          _id: `screen-${new Date().getTime()}`,
        };
        const updatedTheatreData = theatreData.map((theatre) => {
          if (theatre._id === newScreenData.theatreId) {
            return {
              ...theatre,
              screens: [...(theatre.screens || []), newScreenWithId],
            };
          }
          return theatre;
        });
        setTheatreData(updatedTheatreData);
        setPopup({ type: null, data: null }); // Close popup on success
      } catch (err) {
        setError("Failed to add screen locally.");
      } finally {
        setSubmitting(false);
      }
    }, 1000);
  };

  const deleteTheatre = (theatreId) => {
    if (!window.confirm("Are you sure you want to delete this theatre?"))
      return;
    try {
      setTheatreData((prevData) => prevData.filter((t) => t._id !== theatreId));
    } catch (err) {
      setError("Failed to delete theatre locally.");
    }
  };

  // Filtering, Pagination

  const filteredTheatres = theatreData.filter((theatre) =>
    theatre.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTheatres = filteredTheatres.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredTheatres.length / itemsPerPage);

  if (loading) {
    return <div className='tm-loading-container'>...Loading</div>;
  }
  if (error && !popup.type) {
    return <div className='tm-error-container'>{error}</div>;
  }

  return (
    <div className='tm-container'>
      <div className='tm-header'>
        <h1>Theatre Management</h1>
        <div className='tm-actions'>
          <button
            className='tm-add-btn'
            onClick={() => setPopup({ type: "addTheatre", data: null })}>
            Add Theatre
          </button>
          <button
            className='tm-add-btn secondary'
            onClick={() => setPopup({ type: "addScreen", data: null })}>
            Add Screen
          </button>
        </div>
      </div>
      <div className='tm-search-container'>
        <input
          type='text'
          placeholder='Search theatres...'
          className='tm-search-input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='tm-content'>
        <h2>Theatre List ({filteredTheatres.length})</h2>
        {currentTheatres.length === 0 ? (
          <div className='tm-empty-state'>
            <h3>No Theatres Found</h3>
          </div>
        ) : (
          <>
            <table className='tm-table'>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Screens & Details</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTheatres.map((theatre) => {
                  const totalCapacity =
                    theatre.screens?.reduce(
                      (t, s) => t + s.rowCount * s.seatPerRow,
                      0
                    ) || 0;
                  return (
                    <tr key={theatre._id}>
                      <td>{theatre.location}</td>
                      <td>
                        {theatre.screens?.length > 0
                          ? theatre.screens.map((s, i) => (
                              <div key={i}>
                                Screen {s.screenNumber} - {s.format}
                              </div>
                            ))
                          : "No screens"}
                      </td>
                      <td>{totalCapacity} seats</td>
                      <td>
                        <button
                          className='tm-delete-btn'
                          onClick={() => deleteTheatre(theatre._id)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className='tm-pagination'>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {popup.type === "addTheatre" && (
        <AddTheatrePopup
          onSubmit={handleAddTheatre}
          onClose={() => setPopup({ type: null, data: null })}
          submitting={submitting}
          error={error}
        />
      )}
      {popup.type === "addScreen" && (
        <AddScreenPopup
          theatres={theatreData}
          onSubmit={handleAddScreen}
          onClose={() => setPopup({ type: null, data: null })}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}

function AddTheatrePopup({ onSubmit, onClose, submitting, error }) {
  const [location, setLocation] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ location });
  };
  return (
    <div className='tm-modal-overlay'>
      <div className='tm-modal-content'>
        <h2>Add New Theatre</h2>
        <button onClick={onClose}>×</button>
        {error && <div className='tm-error-message'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Theatre Location'
            required
          />
          <div className='tm-form-actions'>
            <button type='button' onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type='submit' disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
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
        <h2>Add New Screen</h2>
        <button onClick={onClose}>×</button>
        {error && <div className='tm-error-message'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <select
            name='theatreId'
            value={formData.theatreId}
            onChange={handleChange}
            required>
            <option value=''>Select Theatre</option>
            {theatres.map((t) => (
              <option key={t._id} value={t._id}>
                {t.location}
              </option>
            ))}
          </select>
          <input
            type='text'
            name='screenNumber'
            value={formData.screenNumber}
            onChange={handleChange}
            placeholder='Screen Number'
            required
          />
          <input
            type='text'
            name='format'
            value={formData.format}
            onChange={handleChange}
            placeholder='Format (e.g., 2D, 3D)'
            required
          />
          <input
            type='number'
            name='rowCount'
            value={formData.rowCount}
            onChange={handleChange}
            placeholder='Row Count'
            required
          />
          <input
            type='number'
            name='seatPerRow'
            value={formData.seatPerRow}
            onChange={handleChange}
            placeholder='Seats Per Row'
            required
          />
          <div className='tm-form-actions'>
            <button type='button' onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type='submit' disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TheatreManage;
