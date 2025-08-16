import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
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
import "./RegistrationForm.css";

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
  const [registrationStatus, setRegistrationStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validatePhone = (phone) =>
    /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ""));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password))
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!validatePhone(formData.mobile))
      newErrors.mobile = "Please enter a valid mobile number";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear validation error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setRegistrationStatus("submitting");
    setErrors({});

    try {
      const response = await api.post(
        "http://localhost:5001/api/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
        }
      );

      setRegistrationStatus("success");
      login(response.data);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setRegistrationStatus("error");
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrors({ api: errorMessage });
    }
  };

  return (
    <div className='hm-form-page'>
      <div className='hm-form-container'>
        <div className='hm-form-header'>
          <div className='hm-logo'>
            <div className='hm-logo-icon'>
              <UserPlus size={32} />
            </div>
            <h1 className='hm-brand'>FilmSpot</h1>
          </div>
          <div className='hm-welcome'>
            <h2 className='hm-form-title'>Join FilmSpot</h2>
            <p className='hm-form-subtitle'>
              Create your account to start your movie journey
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='hm-form'>
          <div className='hm-name-group'>
            <div className='hm-input-group'>
              <div className='hm-input-wrapper'>
                <User className='hm-input-icon' size={18} />
                <input
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`hm-input ${
                    errors.firstName ? "hm-input-error" : ""
                  }`}
                  disabled={registrationStatus === "submitting"}
                />
              </div>
              {errors.firstName && (
                <span className='hm-error-text'>{errors.firstName}</span>
              )}
            </div>
            <div className='hm-input-group'>
              <div className='hm-input-wrapper'>
                <User className='hm-input-icon' size={18} />
                <input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`hm-input ${
                    errors.lastName ? "hm-input-error" : ""
                  }`}
                  disabled={registrationStatus === "submitting"}
                />
              </div>
              {errors.lastName && (
                <span className='hm-error-text'>{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className='hm-input-group'>
            <div className='hm-input-wrapper'>
              <Mail className='hm-input-icon' size={18} />
              <input
                type='email'
                name='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                className={`hm-input ${errors.email ? "hm-input-error" : ""}`}
                disabled={registrationStatus === "submitting"}
              />
            </div>
            {errors.email && (
              <span className='hm-error-text'>{errors.email}</span>
            )}
          </div>

          <div className='hm-input-group'>
            <div className='hm-input-wrapper'>
              <Lock className='hm-input-icon' size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                placeholder='Create a strong password'
                value={formData.password}
                onChange={handleChange}
                className={`hm-input ${
                  errors.password ? "hm-input-error" : ""
                }`}
                disabled={registrationStatus === "submitting"}
              />
              <button
                type='button'
                className='hm-password-toggle'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className='hm-error-text'>{errors.password}</span>
            )}
          </div>

          <div className='hm-input-group'>
            <div className='hm-input-wrapper'>
              <Phone className='hm-input-icon' size={18} />
              <input
                type='tel'
                name='mobile'
                placeholder='Enter your mobile number'
                value={formData.mobile}
                onChange={handleChange}
                className={`hm-input ${errors.mobile ? "hm-input-error" : ""}`}
                disabled={registrationStatus === "submitting"}
              />
            </div>
            {errors.mobile && (
              <span className='hm-error-text'>{errors.mobile}</span>
            )}
          </div>

          <div className='hm-checkbox-group'>
            <label className='hm-checkbox'>
              <input
                type='checkbox'
                name='receiveOffers'
                checked={formData.receiveOffers}
                onChange={handleChange}
              />
              <span className='hm-checkbox-mark'></span>
              <div className='hm-checkbox-content'>
                <Gift className='hm-checkbox-icon' size={16} />
                <span className='hm-checkbox-text'>
                  Receive exclusive offers and promotions
                </span>
              </div>
            </label>
            <label className='hm-checkbox'>
              <input
                type='checkbox'
                name='agreeToTerms'
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span className='hm-checkbox-mark'></span>
              <div className='hm-checkbox-content'>
                <Shield className='hm-checkbox-icon' size={16} />
                <span className='hm-checkbox-text'>
                  I agree to the{" "}
                  <Link to='/terms' className='hm-form-link'>
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link to='/privacy' className='hm-form-link'>
                    Privacy Policy
                  </Link>
                </span>
              </div>
            </label>
            {errors.agreeToTerms && (
              <span className='hm-error-text'>{errors.agreeToTerms}</span>
            )}
          </div>

          {errors.api && registrationStatus === "error" && (
            <div className='hm-status hm-status-error'>
              <AlertCircle className='hm-status-icon' size={16} />
              <span>{errors.api}</span>
            </div>
          )}

          {registrationStatus === "submitting" && (
            <div className='hm-status hm-status-loading'>
              <Loader className='hm-status-icon hm-spinning' size={16} />
              <span>Creating your account...</span>
            </div>
          )}
          {registrationStatus === "success" && (
            <div className='hm-status hm-status-success'>
              <CheckCircle className='hm-status-icon' size={16} />
              <span>Registration successful! Redirecting...</span>
            </div>
          )}

          <button
            type='submit'
            className='hm-submit-btn'
            disabled={registrationStatus === "submitting"}>
            {registrationStatus === "submitting" ? (
              <Loader className='hm-btn-icon hm-spinning' size={18} />
            ) : (
              <UserPlus className='hm-btn-icon' size={18} />
            )}
            <span>Create Account</span>
          </button>
        </form>

        <div className='hm-form-footer'>
          <div className='hm-divider'>
            <span>Already have an account?</span>
          </div>
          <Link to='/sign-in' className='hm-form-link hm-register-link'>
            Sign In
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

export default RegistrationForm;
