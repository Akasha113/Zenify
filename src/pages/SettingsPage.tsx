import React from 'react';
import { motion } from 'framer-motion';
import storage from '../utils/storage';
import Button from '../components/ui/Button';
import { Check, X, Download, Upload, Info, Bell, BellOff } from 'lucide-react';
import { ThemeContext } from '../App';

const SettingsPage: React.FC = () => {
  const themeContext = React.useContext(ThemeContext);
  const [name, setName] = React.useState('');
  const [darkMode, setDarkMode] = React.useState(false);
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');
  const [notifications, setNotifications] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission | null>(null);
  
  // Load settings
  React.useEffect(() => {
    const profile = storage.getUserProfile();
    setName(profile.name || '');
    setDarkMode(profile.settings.theme === 'dark');
    setFontSize(profile.settings.fontSize);
    setNotifications(profile.settings.notifications);
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  
  // Update context when local state changes (for instant feedback)
  React.useEffect(() => {
    themeContext.setFontSize(fontSize);
  }, [fontSize, themeContext]);
  
  React.useEffect(() => {
    themeContext.setNotifications(notifications);
    
    // Request notification permission when user enables notifications
    if (notifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
          if (permission !== 'granted') {
            setError('Notification permission denied. You can enable it in your browser settings.');
          }
        });
      } else if (Notification.permission === 'denied') {
        setError('Notifications are blocked. Please enable them in your browser settings.');
      }
    }
  }, [notifications, themeContext]);
  
  React.useEffect(() => {
    // Only toggle if the context state is different from our local state
    if (darkMode !== themeContext.isDarkMode) {
      themeContext.toggleDarkMode();
    }
  }, [darkMode, themeContext]);
  
  const handleSave = () => {
    try {
      // Just save to storage - context is already updated via useEffect
      storage.updateUserProfile({
        name,
        settings: {
          theme: darkMode ? 'dark' : 'light',
          fontSize,
          notifications,
        },
      });
      
      setSaved(true);
      setError(null);
      
      // Reset saved indicator after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      setSaved(false);
    }
  };
  
  const exportData = () => {
    try {
      const profile = storage.getUserProfile();
      const dataStr = JSON.stringify(profile, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `MindFul Journal-data-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      setError('Failed to export data. Please try again.');
    }
  };
  
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate data structure
        if (!data.settings || !data.mood || !data.journals) {
          throw new Error('Invalid data format');
        }
        
        // Import data
        storage.updateUserProfile(data);
        
        // Update UI
        setName(data.name || '');
        setDarkMode(data.settings.theme === 'dark');
        setFontSize(data.settings.fontSize || 'medium');
        setNotifications(data.settings.notifications || false);
        
        setSaved(true);
        setError(null);
        
        // Reset saved indicator after 3 seconds
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } catch (err) {
        setError('Failed to import data. File may be corrupted or in the wrong format.');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 pt-8 bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950">
      <div className="max-w-5xl mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-semibold text-dark-purple-900 dark:text-dark-purple-100">Settings</h1>
        <p className="text-black dark:text-gray-200">Customize your MindFul Journal experience</p>
      </motion.div>
      
      <motion.div
        className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-6 mb-6 border border-dark-purple-200 dark:border-dark-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-dark-purple-900 dark:text-dark-purple-100">Profile</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-purple-700 dark:text-dark-purple-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-dark-purple-300 dark:border-dark-purple-700 rounded-md bg-white dark:bg-dark-purple-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>
      </motion.div>
      
      <motion.div
        className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-6 mb-6 border border-dark-purple-200 dark:border-dark-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-dark-purple-900 dark:text-dark-purple-100">Appearance</h2>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-black dark:text-white block">
                Dark Mode
              </label>
              <p className="text-xs text-dark-purple-600 dark:text-dark-purple-400 mt-1">
                {darkMode ? 'Dark mode is enabled' : 'Light mode is active'}
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                relative inline-flex items-center h-6 rounded-full w-11
                transition-colors duration-200
              `}
              style={{ backgroundColor: darkMode ? '#6E2B8A' : '#D3C5D9' }}
            >
              <span
                className={`
                  inline-block w-4 h-4 transform rounded-full bg-white
                  ${darkMode ? 'translate-x-6' : 'translate-x-1'}
                  transition-transform duration-200
                `}
              />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-black dark:text-white mb-3">
            Font Size: <span className="text-dark-purple-600 dark:text-dark-purple-400">{fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}</span>
          </label>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`
                  px-4 py-2 rounded-md text-white transition-colors
                  ${fontSize === size 
                    ? '' 
                    : 'bg-dark-purple-200 dark:bg-dark-purple-700 text-dark-purple-900 dark:text-dark-purple-100 hover:bg-dark-purple-300 dark:hover:bg-dark-purple-600'
                  }
                `}
                style={fontSize === size ? { backgroundColor: '#6E2B8A' } : {}}
              >
                <span className={size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-dark-purple-600 dark:text-dark-purple-400 mt-2">
            Adjust the font size for better readability across the entire app
          </p>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-6 mb-6 border border-dark-purple-200 dark:border-dark-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-dark-purple-900 dark:text-dark-purple-100">Notifications</h2>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-black dark:text-white block flex items-center gap-2">
                {notifications ? <Bell size={16} /> : <BellOff size={16} />}
                Daily Reminders
              </label>
              <p className="text-xs text-dark-purple-600 dark:text-dark-purple-400 mt-1">
                {notifications ? (
                  notificationPermission === 'granted'
                    ? 'Notifications enabled - you will receive daily reminders at 9:00 AM'
                    : notificationPermission === 'denied'
                    ? 'Notifications blocked in browser settings'
                    : 'Notifications pending permission'
                ) : (
                  'Notifications disabled'
                )}
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`
                relative inline-flex items-center h-6 rounded-full w-11
                transition-colors duration-200
              `}
              style={{ backgroundColor: notifications ? '#6E2B8A' : '#D3C5D9' }}
            >
              <span
                className={`
                  inline-block w-4 h-4 transform rounded-full bg-white
                  ${notifications ? 'translate-x-6' : 'translate-x-1'}
                  transition-transform duration-200
                `}
              />
            </button>
          </div>
          <p className="text-xs text-dark-purple-600 dark:text-dark-purple-400 mt-2">
            Enable daily mood tracking reminders to stay consistent with your mental wellness journey
          </p>
        </div>
      </motion.div>
      
      <motion.div
        className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-6 mb-6 border border-dark-purple-200 dark:border-dark-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-dark-purple-900 dark:text-dark-purple-100">Data Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#6E2B8A' }}
          >
            <Download size={16} />
            Export Data
          </button>
          
          <label className="block w-full">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#6E2B8A' }}
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload size={16} />
              Import Data
            </button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={importData}
            />
          </label>
        </div>
        
        <div className="mt-4 flex items-start">
          <Info size={16} className="text-dark-purple-600 dark:text-dark-purple-400 mt-1 mr-2 flex-shrink-0" />
          <p className="text-xs text-black dark:text-gray-200">
            Export your data regularly to avoid losing your journal entries and conversation history.
            Note that we store all your data locally in your browser. Clearing your browser data will
            remove all your MindFul Journal information.
          </p>
        </div>
      </motion.div>
      
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button onClick={handleSave} style={{ backgroundColor: '#6E2B8A' }} className="text-white">Save Settings</Button>
        
        {saved && (
          <motion.div
            className="flex items-center text-green-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <Check size={18} className="mr-1" />
            <span>Settings saved</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            className="flex items-center text-red-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <X size={18} className="mr-1" />
            <span>{error}</span>
          </motion.div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;