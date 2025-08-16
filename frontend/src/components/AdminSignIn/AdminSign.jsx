import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./AdminSignIn.css";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInStatus, setSignInStatus] = useState("idle");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignInStatus("submitting");
    setError("");

    try {
      const response = await api.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      //Admin Related
      if (response.data.role === "admin") {
        setSignInStatus("success");
        login(response.data);

        //Redirect to the admin dashboard
        setTimeout(() => {
          navigate("/admin-dash");
        }, 1500);
      } else {
        setSignInStatus("error");
        setError("Access Denied: You are not an authorized admin.");
      }
    } catch (err) {
      setSignInStatus("error");
      const errorMessage =
        err.response?.data?.message ||
        "Sign in failed. Please check credentials.";
      setError(errorMessage);
    }
  };

  return (
    <div className='signin-page'>
      <div className='signin-container'>
        <h1>FilmSpot Admin</h1>
        <h2>Sign into Admin Panel</h2>
        <form className='signin-form' onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Admin Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={signInStatus === "submitting"}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={signInStatus === "submitting"}
          />

          {signInStatus === "submitting" && <p>Signing in...</p>}
          {signInStatus === "success" && (
            <p style={{ color: "green" }}>Login Successful! Redirecting...</p>
          )}
          {signInStatus === "error" && <p style={{ color: "red" }}>{error}</p>}

          <button type='submit' disabled={signInStatus === "submitting"}>
            {signInStatus === "submitting" ? "Please wait..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;
