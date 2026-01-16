import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AuthContext } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, isLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (register(email, password, name)) {
        navigate('/');
      } else {
        setError('Email already in use. Please try a different email or sign in.');
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
            Start your mental wellness journey today
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          className="bg-white dark:bg-dark-purple-800 rounded-lg shadow-lg p-8 border border-dark-purple-200 dark:border-dark-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-dark-purple-900 dark:text-dark-purple-100 mb-6">
            Create Account
          </h2>

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
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={18} className="text-dark-purple-600 dark:text-dark-purple-400" />}
              required
            />

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} className="text-dark-purple-600 dark:text-dark-purple-400" />}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={18} className="text-dark-purple-600 dark:text-dark-purple-400" />}
              required
            />

            {/* Password Requirements */}
            <motion.div
              className="p-3 bg-dark-purple-50 dark:bg-dark-purple-900 rounded-lg text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-dark-purple-900 dark:text-dark-purple-100 font-semibold mb-2">
                Password Requirements:
              </p>
              <div className="space-y-1 text-dark-purple-700 dark:text-dark-purple-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className={password.length >= 6 ? 'text-green-500' : 'text-gray-400'} />
                  <span>At least 6 characters</span>
                </div>
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#6E2B8A' }}
              className="w-full text-white mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </motion.div>

        {/* Sign In Link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-dark-purple-700 dark:text-dark-purple-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-dark-purple-600 dark:text-dark-purple-400 hover:text-dark-purple-900 dark:hover:text-dark-purple-200 transition-colors"
              style={{ color: '#6E2B8A' }}
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
