import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDash.css";

const AdminDash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeShowtimes, setActiveShowtimes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch Total Movies
        const moviesResponse = await apiService.movies.getCount();
        setTotalMovies(moviesResponse.data.count);

        // Fetch Total Users
        const usersResponse = await apiService.auth.getUserCount();
        setTotalUsers(usersResponse.data.count);

        // Fetch Active Showtimes
        const showtimesResponse = await apiService.showtimes.getTodayCount();
        setActiveShowtimes(showtimesResponse.data.count);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
    <div className='admin-dashboard'>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className='sidebar-header'>
          <h2>FIlmSpot Admin</h2>
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
                <span className='nav-icon'>📊</span>
                Dashboard
              </li>
            </ul>
          </div>
          <div className='nav-section'>
            <h3>Management</h3>
            <ul>
              <li
                onClick={() => handleNavigation("/movie-manage")}
                className='nav-item'>
                <span className='nav-icon'>🎬</span>
                Movies
              </li>
              <li
                onClick={() => handleNavigation("/time-manage")}
                className='nav-item'>
                <span className='nav-icon'>🕐</span>
                Showtimes
              </li>
              <li
                onClick={() => handleNavigation("/theatre-manage")}
                className='nav-item'>
                <span className='nav-icon'>🏛️</span>
                Theatres
              </li>
            </ul>
          </div>
          <div className='nav-section'>
            <h3>Quick Actions</h3>
            <ul>
              <li
                onClick={() => handleNavigation("/movie-manage")}
                className='nav-item'>
                <span className='nav-icon'>➕</span>
                Add Movie
              </li>
              <li
                onClick={() => handleNavigation("/time-manage")}
                className='nav-item'>
                <span className='nav-icon'>⏰</span>
                Add Showtime
              </li>
            </ul>
          </div>
          <div className='nav-section'>
            <h3>Other</h3>
            <ul>
              <li
                onClick={() => handleNavigation("/settings")}
                className='nav-item'>
                <span className='nav-icon'>⚙️</span>
                Settings
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        {/* Header */}
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
              <span className='admin-name'>Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className='dashboard-content'>
          {/* Welcome Section */}
          <div className='welcome-section'>
            <h2>Welcome back, Admin! 👋</h2>
            <p>Here's what's happening with your cinema today.</p>
          </div>

          {/* Stats Grid */}
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
              value='$2,485'
              icon='💰'
              color='orange'
              subtitle='Daily earnings'
            />
          </div>

          {/* Action Cards */}
          <div className='action-section'>
            <h3>Quick Actions</h3>
            <div className='action-grid'>
              <ActionCard
                title='Add New Movie'
                description='Upload and configure a new movie'
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
                description='Add or edit theatre information'
                icon='🏛️'
                onClick={() => handleNavigation("/theatre-manage")}
                color='purple'
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className='activity-section'>
            <h3>Recent Activity</h3>
            <div className='activity-list'>
              <ActivityItem
                icon='🎬'
                title='New movie added'
                description='Spider-Man: No Way Home was added to the catalog'
                time='2 hours ago'
              />
              <ActivityItem
                icon='👤'
                title='New user registered'
                description='John Doe created a new account'
                time='4 hours ago'
              />
              <ActivityItem
                icon='🎫'
                title='Booking confirmed'
                description='Ticket booking for Avengers confirmed'
                time='6 hours ago'
              />
              <ActivityItem
                icon='⏰'
                title='Showtime updated'
                description='Evening show time changed for Screen 2'
                time='1 day ago'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className='sidebar-overlay' onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

/* Reusable Components */
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

export default AdminDash;
