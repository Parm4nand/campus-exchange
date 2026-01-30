import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import localDatabase from '../services/localDatabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data on first load
    localDatabase.initSampleData();

    // Auto-login as student@nfsu.ac.in for direct local access
    const autoLogin = async () => {
      const storedUser = localStorage.getItem('campusxchange_user');
      const storedUserData = localStorage.getItem('campusxchange_user_data');

      // If we have stored credentials, use them
      if (storedUser && storedUserData) {
        setCurrentUser(JSON.parse(storedUser));
        setUserData(JSON.parse(storedUserData));
      } else {
        // Auto-login as student user
        try {
          console.log('🔐 Auto-login as student@nfsu.ac.in');
          const user = await localDatabase.getUserByEmail('student@nfsu.ac.in');

          if (user) {
            // Clean user object (remove password hash)
            const { password: plainPassword, passwordHash, ...safeUser } = user;

            // Set user in state and localStorage
            const userForAuth = { uid: user.id, email: user.email };
            setCurrentUser(userForAuth);
            setUserData(safeUser);

            localStorage.setItem('campusxchange_user', JSON.stringify(userForAuth));
            localStorage.setItem('campusxchange_user_data', JSON.stringify(safeUser));

            console.log('✅ Auto-login successful:', safeUser.name);
          } else {
            console.warn('⚠️ Student user not found, check sample data initialization');
          }
        } catch (error) {
          console.error('❌ Auto-login failed:', error);
        }
      }

      setLoading(false);
    };

    autoLogin();
  }, []);

  const signup = async (email, password, userInfo) => {
    try {
      // Check if user already exists
      const existingUser = await localDatabase.getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Create user in database ← CHANGED: No userId parameter
      const result = await localDatabase.createUser({
        email,
        password,
        ...userInfo,
        role: email === 'admin@nfsu.ac.in' ? 'admin' :
          email === 'events@nfsu.ac.in' ? 'event_society' : 'student'
      });

      // Check if user creation was successful
      if (!result.success) {
        return { success: false, error: result.error || 'Failed to create user' };
      }

      // Get the created user using the returned userId
      const newUserData = await localDatabase.getUser(result.userId);

      // Set user in state and localStorage
      const userForAuth = { uid: result.userId, email: email };
      setCurrentUser(userForAuth);
      setUserData(newUserData);

      localStorage.setItem('campusxchange_user', JSON.stringify(userForAuth));
      localStorage.setItem('campusxchange_user_data', JSON.stringify(newUserData));

      return { success: true, user: userForAuth };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Login attempt for:', email);

      // Get user first to check if they exist
      const user = await localDatabase.getUserByEmail(email);
      console.log('   User found:', !!user);

      if (!user) {
        console.log('❌ AuthContext: User not found');
        return { success: false, error: 'Invalid email or password' };
      }

      console.log('   User has passwordHash:', !!user.passwordHash);
      console.log('   User has password:', !!user.password);

      // Verify password using the new method
      // Verify password using the new method
      const isValid = await localDatabase.verifyPassword(email, password);
      console.log('   Password verification result:', isValid);

      if (!isValid) {
        // Get user to check status for better error message
        const user = await localDatabase.getUserByEmail(email);

        if (user) {
          if (user.status === 'banned') {
            console.log('❌ AuthContext: User is banned');
            return { success: false, error: 'Account has been banned. Please contact administrator.' };
          }

          if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
            const minutesLeft = Math.ceil((new Date(user.lockUntil) - new Date()) / (1000 * 60));
            console.log('❌ AuthContext: Account is locked');
            return { success: false, error: `Account is temporarily locked. Try again in ${minutesLeft} minutes.` };
          }
        }

        console.log('❌ AuthContext: Invalid credentials');
        return { success: false, error: 'Invalid email or password' };
      }

      // Clean user object (remove password hash)
      const { password: plainPassword, passwordHash, ...safeUser } = user;

      // Set user in state and localStorage
      const userForAuth = { uid: user.id, email: user.email };
      setCurrentUser(userForAuth);
      setUserData(safeUser);

      localStorage.setItem('campusxchange_user', JSON.stringify(userForAuth));
      localStorage.setItem('campusxchange_user_data', JSON.stringify(safeUser));

      console.log('✅ AuthContext: Login successful');
      console.log('   User data:', safeUser);
      return { success: true, user: userForAuth };
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Mock Google login - creates a new user or logs in existing one
      const mockGoogleEmail = `google_${Date.now()}@nfsu.ac.in`;

      // Check if user exists
      let user = await localDatabase.getUserByEmail(mockGoogleEmail);
      if (!user) {
        // Create new user without password for Google auth
        // Create new user without password for Google auth
        const result = await localDatabase.createUser({
          email: mockGoogleEmail,
          name: 'Google User',
          role: 'student',
          campus: 'main',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
        });

        if (!result.success) {
          return { success: false, error: result.error || 'Google login failed' };
        }

        const userId = result.userId; // Get the generated userId
        user = await localDatabase.getUserByEmail(mockGoogleEmail);
      }

      if (!user) {
        return { success: false, error: 'Google login failed' };
      }

      // Clean user object
      const { password: plainPassword, passwordHash, ...safeUser } = user;

      // Set user in state and localStorage
      const userForAuth = { uid: user.id, email: user.email };
      setCurrentUser(userForAuth);
      setUserData(safeUser);

      localStorage.setItem('campusxchange_user', JSON.stringify(userForAuth));
      localStorage.setItem('campusxchange_user_data', JSON.stringify(safeUser));

      return { success: true, user: userForAuth };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Google login failed' };
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      setUserData(null);
      localStorage.removeItem('campusxchange_user');
      localStorage.removeItem('campusxchange_user_data');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');

      await localDatabase.updateUser(currentUser.uid, updates);
      const updatedUserData = await localDatabase.getUser(currentUser.uid);
      setUserData(updatedUserData);

      // Update localStorage
      localStorage.setItem('campusxchange_user_data', JSON.stringify(updatedUserData));

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper function for testing - login as admin
  const loginAsAdmin = async () => {
    return login('admin@nfsu.ac.in', 'admin123');
  };

  // Helper function for testing - login as event society
  const loginAsEventSociety = async () => {
    return login('events@nfsu.ac.in', 'EventSociety@2024');
  };
  // Auto-logout check for banned users
  const checkLoginStatus = useCallback(async () => {
    if (!currentUser?.uid) return { loggedIn: false };

    try {
      const user = await localDatabase.getUser(currentUser.uid);
      if (!user) {
        // User doesn't exist anymore
        await logout();
        return { loggedIn: false, reason: 'User not found' };
      }

      if (user.status === 'banned') {
        // User is banned, auto logout
        await logout();
        return { loggedIn: false, reason: 'Account banned' };
      }

      return { loggedIn: true, user: user };
    } catch (error) {
      console.error('Error checking login status:', error);
      return { loggedIn: false, reason: 'Error checking status' };
    }
  }, [currentUser, logout]);

  // Polling for banned status - checks every 15 seconds
  useEffect(() => {
    if (!currentUser?.uid) return;

    const pollStatus = async () => {
      const status = await checkLoginStatus();
      if (!status.loggedIn && status.reason === 'Account banned') {
        console.log('🚫 Account has been banned. Logged out automatically.');
      }
    };

    // Check immediately on mount
    pollStatus();

    // Then check every 15 seconds
    const intervalId = setInterval(pollStatus, 15000); // 15 seconds

    return () => clearInterval(intervalId);
  }, [currentUser?.uid, checkLoginStatus]);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    loginAsAdmin,
    loginAsEventSociety,
    checkLoginStatus,
    isAdmin: userData?.role === 'admin',
    isEventSociety: userData?.role === 'event_society',
    isLoggedIn: !!currentUser,
    userRole: userData?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
