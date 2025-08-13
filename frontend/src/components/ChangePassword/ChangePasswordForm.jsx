import React, { useState } from "react";
import "./ChangePasswordForm.css";

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const requirements = [
    { id: "length", text: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", text: "One uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", text: "One lowercase letter", regex: /[a-z]/ },
    { id: "number", text: "One number", regex: /\d/ },
    {
      id: "special",
      text: "One special character",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
  ];

  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: "" };
    const metRequirements = requirements.filter((req) =>
      req.regex.test(password)
    );
    const score = metRequirements.length;
    const strengthLevels = {
      0: { feedback: "", class: "" },
      1: { feedback: "Very Weak", class: "weak" },
      2: { feedback: "Weak", class: "weak" },
      3: { feedback: "Fair", class: "fair" },
      4: { feedback: "Good", class: "good" },
      5: { feedback: "Strong", class: "strong" },
    };
    return {
      score,
      feedback: strengthLevels[score].feedback,
      class: strengthLevels[score].class,
      metRequirements: metRequirements.map((req) => req.id),
    };
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "newPassword")
      setPasswordStrength(calculatePasswordStrength(value));
    if (success) setSuccess(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim())
      newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (calculatePasswordStrength(formData.newPassword).score < 3) {
      newErrors.newPassword =
        "Password is too weak. Please meet more requirements.";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    setTimeout(() => {
      //Demo using the current password.
      if (formData.currentPassword === "password123") {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength({ score: 0, feedback: "" });
        console.log("Password change successful (simulated)");
        setTimeout(() => setSuccess(false), 5000); // Auto-hide success message
      } else {
        setErrors({ currentPassword: "Current password is incorrect" });
        console.error(
          "Password change failed: Incorrect current password (simulated)"
        );
      }

      setLoading(false);
    }, 1500);
  };

  const handleCancel = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setSuccess(false);
    setPasswordStrength({ score: 0, feedback: "" });
  };

  return (
    <div className='chpw-content'>
      <div className='chpw-container'>
        {loading && (
          <div className='chpw-loading-overlay'>
            <div className='chpw-loading-spinner'></div>
            <p>Updating your password...</p>
          </div>
        )}

        <h2 className='chpw-title'>Change Password</h2>
        <p className='chpw-subtitle'>
          (Demo: The correct current password is <strong>password123</strong>)
        </p>
        <div className='chpw-title-line'></div>

        {success && (
          <div className='chpw-success-message'>
            ✓ Password updated successfully!
          </div>
        )}

        {errors.general && (
          <div className='chpw-error-message'>⚠ {errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className='chpw-form-container'>
          {/* Current Password */}
          <div className='chpw-form-group'>
            <label className='chpw-form-label' htmlFor='currentPassword'>
              Current Password
            </label>
            <div className='chpw-input-wrapper'>
              <input
                id='currentPassword'
                type={showPasswords.current ? "text" : "password"}
                className={`chpw-form-input ${
                  errors.currentPassword ? "error" : ""
                }`}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder='Enter your current password'
                disabled={loading}
                autoComplete='current-password'
              />
              <button
                type='button'
                className='chpw-password-toggle'
                onClick={() => togglePasswordVisibility("current")}
                aria-label={
                  showPasswords.current ? "Hide password" : "Show password"
                }
                disabled={loading}>
                {showPasswords.current ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.currentPassword && (
              <div className='chpw-error-message'>
                ⚠ {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className='chpw-form-group'>
            <label className='chpw-form-label' htmlFor='newPassword'>
              New Password
            </label>
            <div className='chpw-input-wrapper'>
              <input
                id='newPassword'
                type={showPasswords.new ? "text" : "password"}
                className={`chpw-form-input ${
                  errors.newPassword
                    ? "error"
                    : passwordStrength.score >= 3 && formData.newPassword
                    ? "success"
                    : ""
                }`}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder='Enter your new password'
                disabled={loading}
                autoComplete='new-password'
              />
              <button
                type='button'
                className='chpw-password-toggle'
                onClick={() => togglePasswordVisibility("new")}
                aria-label={
                  showPasswords.new ? "Hide password" : "Show password"
                }
                disabled={loading}>
                {showPasswords.new ? "🙈" : "👁️"}
              </button>
            </div>
            {formData.newPassword && (
              <>
                <div className='chpw-password-strength'>
                  <div className='chpw-strength-bar'>
                    <div
                      className={`chpw-strength-fill ${passwordStrength.class}`}></div>
                  </div>
                  <div
                    className={`chpw-strength-text ${passwordStrength.class}`}>
                    {passwordStrength.feedback}
                  </div>
                </div>
                <div className='chpw-requirements'>
                  <ul className='chpw-requirements-list'>
                    {requirements.map((req) => (
                      <li
                        key={req.id}
                        className={`chpw-requirement-item ${
                          passwordStrength.metRequirements?.includes(req.id)
                            ? "met"
                            : ""
                        }`}>
                        <span className='chpw-requirement-icon'>
                          {passwordStrength.metRequirements?.includes(req.id)
                            ? "✓"
                            : "○"}
                        </span>
                        {req.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {errors.newPassword && (
              <div className='chpw-error-message'>⚠ {errors.newPassword}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className='chpw-form-group'>
            <label className='chpw-form-label' htmlFor='confirmPassword'>
              Confirm New Password
            </label>
            <div className='chpw-input-wrapper'>
              <input
                id='confirmPassword'
                type={showPasswords.confirm ? "text" : "password"}
                className={`chpw-form-input ${
                  errors.confirmPassword
                    ? "error"
                    : formData.confirmPassword &&
                      formData.newPassword === formData.confirmPassword
                    ? "success"
                    : ""
                }`}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder='Confirm your new password'
                disabled={loading}
                autoComplete='new-password'
              />
              <button
                type='button'
                className='chpw-password-toggle'
                onClick={() => togglePasswordVisibility("confirm")}
                aria-label={
                  showPasswords.confirm ? "Hide password" : "Show password"
                }
                disabled={loading}>
                {showPasswords.confirm ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className='chpw-error-message'>
                ⚠ {errors.confirmPassword}
              </div>
            )}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword &&
              !errors.confirmPassword && (
                <div className='chpw-success-message'>✓ Passwords match</div>
              )}
          </div>

          {/* Action Buttons */}
          <div className='chpw-button-group'>
            <button
              type='submit'
              className='chpw-save-button'
              disabled={
                loading ||
                !formData.currentPassword ||
                !formData.newPassword ||
                !formData.confirmPassword ||
                passwordStrength.score < 3
              }>
              {loading ? (
                <>
                  <div className='chpw-spinner'></div>Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
            <button
              type='button'
              className='chpw-cancel-button'
              onClick={handleCancel}
              disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
