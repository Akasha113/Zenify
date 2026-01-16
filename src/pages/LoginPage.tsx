import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const { login, isLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (login(email, password)) {
        // Show success message briefly before navigating
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-purple-50 via-white to-dark-purple-100 dark:from-dark-purple-950 dark:via-dark-purple-900 dark:to-dark-purple-950 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#6E2B8A' }}
          >
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-dark-purple-900 dark:text-dark-purple-100">
            MindFul Journal
          </h1>
          <p className="text-dark-purple-600 dark:text-dark-purple-400 mt-2">
            Welcome back to your mental wellness companion
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-8 border border-dark-purple-200 dark:border-dark-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-dark-purple-900 dark:text-dark-purple-100 mb-6">
            Sign In
          </h2>

          {showSuccessMessage && (
            <motion.div
              className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg flex items-start gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Check size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-green-700 dark:text-green-300 text-sm">
                <p className="font-semibold">Login Successful! 🎉</p>
                <p className="mt-1">A confirmation email has been sent to {email}</p>
                <p className="text-xs mt-1 opacity-90">Redirecting to home page...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="mb-4 p-4 bg-dark-purple-100 dark:bg-dark-purple-900 border border-dark-purple-300 dark:border-dark-purple-600 rounded-lg flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={20} className="text-dark-purple-600 dark:text-dark-purple-400 flex-shrink-0" />
              <p className="text-dark-purple-700 dark:text-dark-purple-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} className="text-dark-purple-600 dark:text-dark-purple-400" />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} className="text-dark-purple-600 dark:text-dark-purple-400" />}
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#6E2B8A' }}
              className="w-full text-white mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            className="mt-6 p-4 bg-dark-purple-50 dark:bg-dark-purple-900 rounded-lg border border-dark-purple-200 dark:border-dark-purple-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs font-semibold text-dark-purple-900 dark:text-dark-purple-100 mb-2">
              Demo Account:
            </p>
            <p className="text-xs text-dark-purple-700 dark:text-dark-purple-300">
              Email: <span className="font-mono">demo@example.com</span>
            </p>
            <p className="text-xs text-dark-purple-700 dark:text-dark-purple-300">
              Password: <span className="font-mono">demo123</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-dark-purple-700 dark:text-dark-purple-300">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-dark-purple-600 dark:text-dark-purple-400 hover:text-dark-purple-900 dark:hover:text-dark-purple-200 transition-colors"
              style={{ color: '#6E2B8A' }}
            >
              Sign up here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
