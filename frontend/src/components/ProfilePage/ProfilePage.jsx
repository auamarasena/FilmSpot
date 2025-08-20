import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import ChangePasswordForm from "../ChangePassword/ChangePasswordForm";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/sign-in");
    }
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        mobile: user.mobile || "",
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "Saving...", type: "loading" });
    try {
      const { data: updatedUser } = await api.put("/auth/profile", formData);
      login(updatedUser); // Update the global user state with the fresh data from the backend
      setStatus({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setStatus({
        message:
          err.response?.data?.message || "Update failed. Please try again.",
        type: "error",
      });
    }
  };

  if (!user) {
    return <div className='loading-container'>Loading Profile...</div>;
  }

  return (
    <div className='profile-page-container'>
      <div className='profile-header'>
        <h1>My Account</h1>
      </div>

      <div className='profile-tabs'>
        <button
          className={`tab-button ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}>
          Profile Details
        </button>
        <button
          className={`tab-button ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}>
          Change Password
        </button>
      </div>

      <div className='tab-content'>
        {activeTab === "details" && (
          <form onSubmit={handleSubmit} className='profile-form'>
            <h2>Update Your Information</h2>
            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input id='email' type='email' value={user.email} disabled />
            </div>
            <div className='form-group'>
              <label htmlFor='firstName'>First Name</label>
              <input
                id='firstName'
                name='firstName'
                type='text'
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='lastName'>Last Name</label>
              <input
                id='lastName'
                name='lastName'
                type='text'
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='mobile'>Mobile Number</label>
              <input
                id='mobile'
                name='mobile'
                type='tel'
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
            </div>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <button
              type='submit'
              className='btn btn-primary'
              disabled={status.type === "loading"}>
              {status.type === "loading" ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "password" && <ChangePasswordForm />}
      </div>
    </div>
  );
};

export default ProfilePage;
