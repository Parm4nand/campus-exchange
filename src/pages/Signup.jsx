import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    campus: 'main',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate username format
    const cleanUsername = formData.name.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9._-]/g, '')
      .substring(0, 20);

    if (cleanUsername.length < 3) {
      setError('Name must be at least 3 characters for username generation');
      return;
    }

    if (!/^[a-z]/.test(cleanUsername)) {
      setError('Username must start with a letter');
      return;
    }

    // Validate passwords
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate name
    if (formData.name.length < 2) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(formData.email, formData.password, {
        name: formData.name,
        campus: formData.campus,
        phone: formData.phone
      });

      if (result.success) {
        // Redirect to marketplace after successful signup
        navigate('/marketplace');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-surface-900 mb-8"
        >
          <ArrowLeft size={18} />
          Back to login
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-surface-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">CX</span>
            </div>
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Create Account</h2>
            <p className="text-surface-600">Join the NFSU campus marketplace</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-surface-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-surface-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  NFSU Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@nfsu.ac.in"
                className="input"
                required
                disabled={loading}
              />
              <p className="text-surface-500 text-sm mt-1">
                Must be a valid @nfsu.ac.in email address
              </p>
            </div>
            {/* Username/Public ID Preview */}
            {formData.name && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <label className="block text-blue-700 font-medium mb-1">
                  Your Username
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-blue-900 font-bold">@{formData.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9._-]/g, '').substring(0, 20)}</span>
                  <span className="text-blue-600 text-sm">(auto-generated from your name)</span>
                </div>
                <p className="text-blue-600 text-xs mt-1">
                  This is your unique ID. Others can find you using this.
                </p>
              </div>
            )}

            {/* Campus */}
            <div>
              <label className="block text-surface-700 font-medium mb-2">Campus</label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="input"
                disabled={loading}
              >
                <option value="main">Main Campus</option>
                <option value="north">North Campus</option>
                <option value="south">South Campus</option>
              </select>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-surface-700 font-medium mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="input"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-surface-700 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  required
                  minLength="6"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-surface-500 text-sm mt-1">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-surface-700 font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 bg-surface-50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-surface-600">
                I agree to the CampusXChange{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>.
                I confirm I am an NFSU student.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-8 pt-8 border-t border-surface-200 text-center">
            <p className="text-surface-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Secure & Verified</p>
                <p className="text-xs text-blue-700">
                  Your account is protected and only visible to verified NFSU students.
                  All transactions are campus-verified for safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
