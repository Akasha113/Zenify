import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import JournalPage from './pages/JournalPage';
import MoodPage from './pages/MoodPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Services
import storage from './utils/storage';

// Context
import { AuthProvider } from './context/AuthContext';

// Theme Context
export const ThemeContext = React.createContext({
  isDarkMode: false,
  fontSize: 'medium' as 'small' | 'medium' | 'large',
  notifications: false,
  toggleDarkMode: () => {},
  setFontSize: (size: 'small' | 'medium' | 'large') => {},
  setNotifications: (enabled: boolean) => {},
});

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');
  const [notifications, setNotifications] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Initialize storage and theme
  React.useEffect(() => {
    storage.initializeStorage();
    const profile = storage.getUserProfile();
    
    setIsDarkMode(profile.settings.theme === 'dark');
    setFontSize(profile.settings.fontSize || 'medium');
    setNotifications(profile.settings.notifications || false);
    
    // Check admin status
    setIsAdmin(profile.isAdmin || false);
  }, []);

  // Update theme on document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update font size on document
  React.useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  // Handle notifications
  React.useEffect(() => {
    if (notifications) {
      // Request notification permission if not already granted
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Set up daily reminder at 9 AM
      const checkAndNotify = () => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        // Show notification at 9:00 AM
        if (hour === 9 && minute === 0) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('MindFul Journal Reminder', {
              body: 'Time to check in with your mood and journal your thoughts!',
              icon: '/logo.png',
              badge: '/logo.png',
            });
          }
        }
      };

      // Check every minute
      const interval = setInterval(checkAndNotify, 60000);

      return () => clearInterval(interval);
    }
  }, [notifications]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSetFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
  };

  const handleSetNotifications = (enabled: boolean) => {
    setNotifications(enabled);
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ isDarkMode, fontSize, notifications, toggleDarkMode, setFontSize: handleSetFontSize, setNotifications: handleSetNotifications }}>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="mood" element={<MoodPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="about" element={<AboutPage />} />
              {isAdmin && <Route path="admin" element={<AdminPage />} />}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;