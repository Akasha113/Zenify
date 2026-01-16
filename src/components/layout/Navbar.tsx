import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, Sun, Moon, LogOut, User, Shield } from 'lucide-react';
import { ThemeContext } from '../../App';
import { AuthContext } from '../../context/AuthContext';
import storage from '../../utils/storage';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = React.useContext(ThemeContext);
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const profile = storage.getUserProfile();
    setIsAdmin(profile.isAdmin || false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      className="bg-dark-purple-50 dark:bg-dark-purple-900 shadow-md border-b border-dark-purple-200 dark:border-dark-purple-700 z-10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-dark-purple-700 dark:text-dark-purple-300 hover:text-dark-purple-900 dark:hover:text-dark-purple-100 hover:bg-dark-purple-100 dark:hover:bg-dark-purple-800 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <motion.div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#6E2B8A' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain size={20} className="text-white" />
              </motion.div>
              <span className="ml-2 text-xl font-semibold text-dark-purple-900 dark:text-dark-purple-100">MindFul Journal</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-dark-purple-100 dark:hover:bg-dark-purple-800 transition-colors"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-dark-purple-300" />
              ) : (
                <Moon size={20} className="text-dark-purple-700" />
              )}
            </button>

            <Link to="/about">
              <motion.button
                className="px-4 py-2 text-sm font-medium text-dark-purple-700 dark:text-dark-purple-300 hover:text-dark-purple-900 dark:hover:text-dark-purple-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: '#6E2B8A' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={16} className="mr-2" />
                {user?.name || 'Account'}
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-dark-purple-800 border border-dark-purple-200 dark:border-dark-purple-700 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="px-4 py-3 border-b border-dark-purple-200 dark:border-dark-purple-700">
                    <p className="text-sm font-medium text-dark-purple-900 dark:text-dark-purple-100">
                      {user?.name}
                    </p>
                    <p className="text-xs text-dark-purple-600 dark:text-dark-purple-400">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-sm text-dark-purple-700 dark:text-dark-purple-300 hover:bg-dark-purple-100 dark:hover:bg-dark-purple-700"
                  >
                    <User size={16} className="mr-2" />
                    View Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-sm text-dark-purple-700 dark:text-dark-purple-300 hover:bg-dark-purple-100 dark:hover:bg-dark-purple-700 border-t border-dark-purple-200 dark:border-dark-purple-700"
                  >
                    <span>⚙️</span>
                    <span className="ml-2">Settings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-dark-purple-100 dark:hover:bg-dark-purple-700 border-t border-dark-purple-200 dark:border-dark-purple-700 font-medium"
                    >
                      <Shield size={16} className="mr-2" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-dark-purple-700 dark:text-dark-purple-300 hover:bg-dark-purple-100 dark:hover:bg-dark-purple-700 border-t border-dark-purple-200 dark:border-dark-purple-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;