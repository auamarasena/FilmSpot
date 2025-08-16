import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; 

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  User,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signInStatus, setSignInStatus] = useState("idle"); 
  const [error, setError] = useState(null); 


  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignInStatus("submitting");
    setError(null); // Clear previous errors

    try {
      const response = await api.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      setSignInStatus("success");

      login(response.data);

      // Redirect the user to the homepage after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setSignInStatus("error");
      const errorMessage =
        err.response?.data?.message ||
        "Sign in failed. Please check your credentials.";
      setError(errorMessage);
    }
  };

  return (
    <div className='hm-form-page'>
      <div className='hm-form-container'>
        <div className='hm-form-header'>
          <div className='hm-logo'>
            <div className='hm-logo-icon'>
              <User size={32} />
            </div>
            <h1 className='hm-brand'>FilmSpot</h1>
          </div>
          <div className='hm-welcome'>
            <h2 className='hm-form-title'>Welcome Back</h2>
            <p className='hm-form-subtitle'>
              Sign in to continue your movie journey
            </p>
          </div>
        </div>

        <form className='hm-form' onSubmit={handleSubmit}>
          <div className='hm-input-group'>
            <label htmlFor='email-input' className='hm-input-label'>
              Email
            </label>
            <div className='hm-input-wrapper'>
              <Mail className='hm-input-icon' size={20} />
              <input
                id='email-input'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='hm-input'
                disabled={signInStatus === "submitting"}
              />
            </div>
          </div>

          <div className='hm-input-group'>
            <label htmlFor='password-input' className='hm-input-label'>
              Password
            </label>
            <div className='hm-input-wrapper'>
              <Lock className='hm-input-icon' size={20} />
              <input
                id='password-input'
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='hm-input'
                disabled={signInStatus === "submitting"}
              />
              <button
                type='button'
                className='hm-password-toggle'
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className='hm-form-options'>
            <label className='hm-checkbox'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className='hm-checkbox-mark'></span>
              <span className='hm-checkbox-text'>Remember me</span>
            </label>
            <Link
              to='/forgot-password' 
              className='hm-form-link'>
              Forgot password?
            </Link>
          </div>

          {signInStatus === "submitting" && (
            <div className='hm-status hm-status-loading' role='status'>
              <Loader className='hm-status-icon hm-spinning' size={16} />
              <span>Signing you in...</span>
            </div>
          )}
          {signInStatus === "success" && (
            <div className='hm-status hm-status-success' role='alert'>
              <CheckCircle className='hm-status-icon' size={16} />
              <span>Login successful! Redirecting...</span>
            </div>
          )}
          {signInStatus === "error" && (
            <div className='hm-status hm-status-error' role='alert'>
              <AlertCircle className='hm-status-icon' size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type='submit'
            className='hm-submit-btn'
            disabled={signInStatus === "submitting"}>
            {signInStatus === "submitting" ? (
              <Loader className='hm-btn-icon hm-spinning' size={18} />
            ) : (
              <LogIn className='hm-btn-icon' size={18} />
            )}
            <span>Sign In</span>
          </button>
        </form>

        <div className='hm-form-footer'>
          <div className='hm-divider'>
            <span>Don't have an account?</span>
          </div>
          <Link to='/reg-form' className='hm-form-link hm-register-link'>
            Create Account
          </Link>
        </div>
      </div>

      <div className='hm-form-background'>
        <div className='hm-bg-circle hm-bg-circle-1'></div>
        <div className='hm-bg-circle hm-bg-circle-2'></div>
      </div>
    </div>
  );
};

export default SignIn;
