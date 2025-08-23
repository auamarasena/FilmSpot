import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./AdminDash.css";

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className={`stat-card ${color}`}>
    <div className='stat-icon'>{icon}</div>
    <div className='stat-content'>
      <h3>{title}</h3>
      <div className='stat-value'>{value}</div>
      <div className='stat-subtitle'>{subtitle}</div>
    </div>
  </div>
);
const ActionCard = ({ title, description, icon, onClick, color }) => (
  <div className={`action-card ${color}`} onClick={onClick}>
    <div className='action-icon'>{icon}</div>
    <div className='action-content'>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
    <div className='action-arrow'>→</div>
  </div>
);
const ActivityItem = ({ icon, title, description, time }) => (
  <div className='activity-item'>
    <div className='activity-icon'>{icon}</div>
    <div className='activity-content'>
      <h4>{title}</h4>
      <p>{description}</p>
      <span className='activity-time'>{time}</span>
    </div>
  </div>
);

//Main Admin Dashboard
const AdminDash = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeShowtimes, setActiveShowtimes] = useState(0);

  // Start in a loading state by default
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) {
      return;
    }
    if (!authLoading && isAuthenticated === false) {
      navigate("/sign-in-admin");
      return; // Stop execution
    }

    if (user && user.role === "admin") {
      const fetchData = async () => {
        setError(null);
        try {
          const [moviesRes, usersRes, showtimesRes] = await Promise.all([
            api.get("/movies/stats/count"),
            api.get("/auth/count"),
            api.get("/showtimes/count/today"),
          ]);
          setTotalMovies(moviesRes.data.count);
          setTotalUsers(usersRes.data.count);
          setActiveShowtimes(showtimesRes.data.count);
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch dashboard data."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      // If user is not an admin, redirect them away.
      navigate("/");
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Effect for the live clock
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // Helper functions
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleNavigation = (path) => navigate(path);
  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  //Render Logic
  if (isLoading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <div className='error-icon'>⚠️</div>
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className='retry-btn'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className='sidebar-header'>
          <h2>FilmSpot Admin</h2>
          <button className='close-sidebar' onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <nav className='sidebar-nav'>
          <div className='nav-section'>
            <h3>Main</h3>
            <ul>
              <li
                onClick={() => handleNavigation("/admin-dash")}
                className='nav-item active'>
                <span className='nav-icon'>📊</span>Dashboard
              </li>
            </ul>
          </div>
          <div className='nav-section'>
            <h3>Management</h3>
            <ul>
              <li
                onClick={() => handleNavigation("/movie-manage")}
                className='nav-item'>
                <span className='nav-icon'>🎬</span>Movies
              </li>
              <li
                onClick={() => handleNavigation("/time-manage")}
                className='nav-item'>
                <span className='nav-icon'>🕐</span>Showtimes
              </li>
              <li
                onClick={() => handleNavigation("/theatre-manage")}
                className='nav-item'>
                <span className='nav-icon'>🏛️</span>Theatres
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <header className='dashboard-header'>
          <div className='header-left'>
            <button className='menu-toggle' onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className='header-right'>
            <div className='datetime-info'>
              <div className='current-time'>{formatTime(currentTime)}</div>
              <div className='current-date'>{formatDate(currentTime)}</div>
            </div>
            <div className='admin-profile'>
              <span className='admin-avatar'>👤</span>
              <span className='admin-name'>{user?.firstName || "Admin"}</span>
            </div>
          </div>
        </header>
        <div className='dashboard-content'>
          <div className='welcome-section'>
            <h2>Welcome back, {user?.firstName || "Admin"}! 👋</h2>
            <p>Here's what's happening today.</p>
          </div>
          <div className='stats-grid'>
            <StatCard
              title='Total Movies'
              value={totalMovies}
              icon='🎬'
              color='blue'
              subtitle='Active in catalog'
            />
            <StatCard
              title='Active Showtimes'
              value={activeShowtimes}
              icon='🕐'
              color='green'
              subtitle="Today's shows"
            />
            <StatCard
              title='Total Users'
              value={totalUsers}
              icon='👥'
              color='purple'
              subtitle='Registered customers'
            />
            <StatCard
              title='Revenue Today'
              value='$0'
              icon='💰'
              color='orange'
              subtitle='(Coming Soon)'
            />
          </div>
          <div className='action-section'>
            <h3>Quick Actions</h3>
            <div className='action-grid'>
              <ActionCard
                title='Add New Movie'
                description='Upload & configure a new movie'
                icon='🎬'
                onClick={() => handleNavigation("/movie-manage")}
                color='blue'
              />
              <ActionCard
                title='Schedule Showtime'
                description='Create new movie showtimes'
                icon='⏰'
                onClick={() => handleNavigation("/time-manage")}
                color='green'
              />
              <ActionCard
                title='Manage Theatres'
                description='Add or edit theatre info'
                icon='🏛️'
                onClick={() => handleNavigation("/theatre-manage")}
                color='purple'
              />
            </div>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div className='sidebar-overlay' onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default AdminDash;
