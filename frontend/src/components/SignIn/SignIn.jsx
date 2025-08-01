import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./SignIn.css";
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

const SignIn = () => {
  return (
    <div className='si-page'>
      <div className='si-container'>
        <div className='si-header'>
          <div className='si-logo'>
            <div className='si-logo-icon'>
              <User size={32} />
            </div>
            <h1 className='si-brand'>FilmSpot</h1>
            <span className='si-brand-subtitle'>Cinema</span>
          </div>
          <div className='si-welcome'>
            <h2 className='si-title'>Welcome Back</h2>
            <p className='si-subtitle'>
              (Demo: use <strong>user@example.com</strong> and{" "}
              <strong>password123</strong>)
            </p>
          </div>
        </div>

        <form className='si-form' onSubmit={handleSubmit}>
          <div className='si-input-group'>
            <div className='si-input-wrapper'>
              <Mail className='si-input-icon' size={20} />
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='si-input'
                disabled={signInStatus === "submitting"}
              />
            </div>
          </div>

          <div className='si-input-group'>
            <div className='si-input-wrapper'>
              <Lock className='si-input-icon' size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='si-input'
                disabled={signInStatus === "submitting"}
              />
              <button
                type='button'
                className='si-password-toggle'
                onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className='si-options'>
            <label className='si-checkbox'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className='si-checkbox-mark'></span>
              <span className='si-checkbox-text'>Remember me</span>
            </label>
            <Link to='/ChangePasswordForm' className='si-forgot-link'>
              Forgot password?
            </Link>
          </div>

          {/* Status Messages */}
          {signInStatus === "submitting" && (
            <div className='si-status si-status-loading'>
              <Loader className='si-status-icon si-spinning' size={16} />
              <span>Signing you in...</span>
            </div>
          )}

          {signInStatus === "success" && (
            <div className='si-status si-status-success'>
              <CheckCircle className='si-status-icon' size={16} />
              <span>Login successful! Redirecting...</span>
            </div>
          )}

          {signInStatus === "error" && (
            <div className='si-status si-status-error'>
              <AlertCircle className='si-status-icon' size={16} />
              <span>
                Sign in failed. Please check your credentials and try again.
              </span>
            </div>
          )}

          <button
            type='submit'
            className='si-submit-btn'
            disabled={signInStatus === "submitting"}>
            {signInStatus === "submitting" ? (
              <>
                <Loader className='si-btn-icon si-spinning' size={18} />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className='si-btn-icon' size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className='si-footer'>
          <div className='si-divider'>
            <span>Don't have an account?</span>
          </div>
          <Link to='/RegistrationForm' className='si-register-link'>
            Create Account
          </Link>

          <div className='si-help-text'>
            <p>Need help? Contact our support team</p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className='si-background'>
        <div className='si-bg-circle si-bg-circle-1'></div>
        <div className='si-bg-circle si-bg-circle-2'></div>
        <div className='si-bg-circle si-bg-circle-3'></div>
      </div>
    </div>
  );
};

export default SignIn;
