import { useState } from "react";
import { Link } from "react-router-dom";
import "./RegistrationForm.css";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Loader,
  Shield,
  Gift,
} from "lucide-react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
    receiveOffers: false,
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setRegistrationStatus("submitting");

    try {
      const response = await apiService.auth.register(formData);

      if (response.data) {
        setRegistrationStatus("success");
        const data = response.data;
        console.log("Registration successful", data);

        // Clear the form
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          mobile: "",
          receiveOffers: false,
          agreeToTerms: false,
        });
        setErrors({});
      }
    } catch (error) {
      setRegistrationStatus("error");
      const errorMessage = handleApiError(error, "Registration failed");
      console.error("Error during registration:", errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='rf-page'>
      <div className='rf-container'>
        <div className='rf-header'>
          <div className='rf-logo'>
            <div className='rf-logo-icon'>
              <UserPlus size={32} />
            </div>
            <h1 className='rf-brand'>FilmSpot</h1>
            <span className='rf-brand-subtitle'>Cinema</span>
          </div>
          <div className='rf-welcome'>
            <h2 className='rf-title'>Join FilmSpot</h2>
            <p className='rf-subtitle'>
              Create your account and start your movie journey
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='rf-form'>
          {/* Name fields */}
          <div className='rf-name-group'>
            <div className='rf-input-group'>
              <div className='rf-input-wrapper'>
                <User className='rf-input-icon' size={18} />
                <input
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`rf-input ${
                    errors.firstName ? "rf-input-error" : ""
                  }`}
                  disabled={registrationStatus === "submitting"}
                />
              </div>
              {errors.firstName && (
                <span className='rf-error-text'>{errors.firstName}</span>
              )}
            </div>

            <div className='rf-input-group'>
              <div className='rf-input-wrapper'>
                <User className='rf-input-icon' size={18} />
                <input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`rf-input ${
                    errors.lastName ? "rf-input-error" : ""
                  }`}
                  disabled={registrationStatus === "submitting"}
                />
              </div>
              {errors.lastName && (
                <span className='rf-error-text'>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email field */}
          <div className='rf-input-group'>
            <div className='rf-input-wrapper'>
              <Mail className='rf-input-icon' size={18} />
              <input
                type='email'
                name='email'
                placeholder='Enter your email address'
                value={formData.email}
                onChange={handleChange}
                className={`rf-input ${errors.email ? "rf-input-error" : ""}`}
                disabled={registrationStatus === "submitting"}
              />
            </div>
            {errors.email && (
              <span className='rf-error-text'>{errors.email}</span>
            )}
          </div>

          {/* Password field */}
          <div className='rf-input-group'>
            <div className='rf-input-wrapper'>
              <Lock className='rf-input-icon' size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                placeholder='Create a strong password'
                value={formData.password}
                onChange={handleChange}
                className={`rf-input ${
                  errors.password ? "rf-input-error" : ""
                }`}
                disabled={registrationStatus === "submitting"}
              />
              <button
                type='button'
                className='rf-password-toggle'
                onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className='rf-error-text'>{errors.password}</span>
            )}
          </div>

          {/* Mobile field */}
          <div className='rf-input-group'>
            <div className='rf-input-wrapper'>
              <Phone className='rf-input-icon' size={18} />
              <input
                type='tel'
                name='mobile'
                placeholder='Enter your mobile number'
                value={formData.mobile}
                onChange={handleChange}
                className={`rf-input ${errors.mobile ? "rf-input-error" : ""}`}
                disabled={registrationStatus === "submitting"}
              />
            </div>
            {errors.mobile && (
              <span className='rf-error-text'>{errors.mobile}</span>
            )}
          </div>

          {/* Checkboxes */}
          <div className='rf-checkbox-group'>
            <label className='rf-checkbox'>
              <input
                type='checkbox'
                name='receiveOffers'
                checked={formData.receiveOffers}
                onChange={handleChange}
              />
              <span className='rf-checkbox-mark'></span>
              <div className='rf-checkbox-content'>
                <Gift className='rf-checkbox-icon' size={16} />
                <span className='rf-checkbox-text'>
                  Receive exclusive offers and promotions
                </span>
              </div>
            </label>

            <label className='rf-checkbox'>
              <input
                type='checkbox'
                name='agreeToTerms'
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span className='rf-checkbox-mark'></span>
              <div className='rf-checkbox-content'>
                <Shield className='rf-checkbox-icon' size={16} />
                <span className='rf-checkbox-text'>
                  I agree to the{" "}
                  <Link to='/terms' className='rf-link'>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to='/privacy' className='rf-link'>
                    Privacy Policy
                  </Link>
                </span>
              </div>
            </label>
            {errors.agreeToTerms && (
              <span className='rf-error-text'>{errors.agreeToTerms}</span>
            )}
          </div>

          {/* Status Messages */}
          {registrationStatus === "submitting" && (
            <div className='rf-status rf-status-loading'>
              <Loader className='rf-status-icon rf-spinning' size={16} />
              <span>Creating your account...</span>
            </div>
          )}

          {registrationStatus === "success" && (
            <div className='rf-status rf-status-success'>
              <CheckCircle className='rf-status-icon' size={16} />
              <span>Registration successful! Welcome to FilmSpot!</span>
            </div>
          )}

          {registrationStatus === "error" && (
            <div className='rf-status rf-status-error'>
              <AlertCircle className='rf-status-icon' size={16} />
              <span>Registration failed. Please try again.</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type='submit'
            className='rf-submit-btn'
            disabled={registrationStatus === "submitting"}>
            {registrationStatus === "submitting" ? (
              <>
                <Loader className='rf-btn-icon rf-spinning' size={18} />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className='rf-btn-icon' size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className='rf-footer'>
          <div className='rf-divider'>
            <span>Already have an account?</span>
          </div>
          <Link to='/SignIn' className='rf-signin-link'>
            Sign In
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className='rf-background'>
        <div className='rf-bg-circle rf-bg-circle-1'></div>
        <div className='rf-bg-circle rf-bg-circle-2'></div>
        <div className='rf-bg-circle rf-bg-circle-3'></div>
      </div>
    </div>
  );
};

export default RegistrationForm;
