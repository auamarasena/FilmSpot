import React, { useState } from "react";

const AdminSignIn = () => {
  return (
    <div className='signin-page'>
      <div className='signin-container'>
        <h1>FilmSpot</h1>
        <h2>Sign into FilmSpot</h2>
        <form className='signin-form' onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {signInStatus === "submitting" && <p>Submitting the form....</p>}
          {signInStatus === "success" && (
            <p style={{ color: "green" }}>Logged in Successfully</p>
          )}
          {signInStatus === "error" && (
            <p style={{ color: "red" }}>Sign In Failed. Please try again.</p>
          )}

          <button type='submit'>Sign in</button>
        </form>

        <div className='help-links'>
          <p>Having Trouble in?</p>
          <a href='/reset-password'>Reset Password</a> or{" "}
          <a href='/RegistrationForm'>Sign UP</a>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
