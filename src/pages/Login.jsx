import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Book, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Validate email format
    if (!email.endsWith('@nfsu.ac.in')) {
      setError('Please use a valid NFSU email (@nfsu.ac.in)');
      setLoading(false);
      return;
    }

    // Validate password
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Call Firebase authentication
      console.log('Calling login function...');
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, navigating to marketplace');
        navigate('/marketplace');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
        console.error('Login error:', result.error);
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        navigate('/marketplace');
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    // Auto-submit after a short delay
    setTimeout(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-dark text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)', 
                       backgroundSize: '100px 100px'}}></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">CX</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">CampusXChange</h1>
              <p className="text-white/80 text-lg">NFSU Marketplace</p>
            </div>
          </div>

          <p className="text-xl text-white/90 mb-16 leading-relaxed">
            A secure campus marketplace connecting NFSU students. 
            Buy, sell, and exchange academic resources, electronics, 
            and more within your trusted campus community.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Campus-Verified Security</h3>
              <p className="text-white/80">Exclusive access for NFSU students with verified emails</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Book className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Academic Resources</h3>
              <p className="text-white/80">Textbooks, study materials, and notes at student-friendly prices</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Trusted Community</h3>
              <p className="text-white/80">Connect with verified students from your campus network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">CX</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">CampusXChange</h1>
              <p className="text-surface-600">NFSU Marketplace</p>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-surface-900 mb-3">Welcome Back</h2>
            <p className="text-surface-600">Sign in to your campus marketplace account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
              <p className="text-red-600 text-xs mt-1">
                {error.includes('INVALID_LOGIN') && 'Please check your email and password'}
                {error.includes('user-not-found') && 'Account not found. Please sign up first.'}
                {error.includes('wrong-password') && 'Incorrect password. Please try again.'}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-surface-700 font-medium mb-2">
                NFSU Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@nfsu.ac.in"
                className="input"
                required
                disabled={loading}
              />
              <p className="text-surface-500 text-sm mt-2">
                Must be a valid @nfsu.ac.in email address
              </p>
            </div>

            <div>
              <label className="block text-surface-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" 
                  disabled={loading}
                />
                <span className="text-surface-700">Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-primary-600 font-medium hover:text-primary-700"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-surface-200"></div>
            <div className="px-4 text-surface-500 text-sm">Or continue with</div>
            <div className="flex-1 border-t border-surface-200"></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full p-3 border border-surface-300 rounded-xl hover:bg-surface-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-surface-700">Sign in with Google</span>
          </button>

          {/* Quick Login Buttons */}
          <div className="mt-10 pt-10 border-t border-surface-200">
            <p className="text-center text-surface-600 mb-6 font-medium">Quick Login</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleDemoLogin('student@nfsu.ac.in', 'password123')}
                className="p-4 border border-surface-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <span className="text-blue-600 font-semibold">S</span>
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">Student Account</p>
                    <p className="text-surface-600 text-sm">Browse & buy items</p>
                  </div>
                </div>
                <div className="text-xs text-surface-500">
                  Email: student@nfsu.ac.in<br />
                  Password: password123
                </div>
              </button>
              
              <button
                onClick={() => handleDemoLogin('admin@nfsu.ac.in', 'admin123')}
                className="p-4 border border-surface-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                    <span className="text-purple-600 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">Admin Account</p>
                    <p className="text-surface-600 text-sm">Manage listings</p>
                  </div>
                </div>
                <div className="text-xs text-surface-500">
                  Email: admin@nfsu.ac.in<br />
                  Password: admin123
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-surface-600 text-sm">
              Need an account?{' '}
              <button 
                onClick={() => navigate('/signup')} 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up here
              </button>
            </p>
            <p className="text-surface-500 text-xs mt-4">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms</a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
