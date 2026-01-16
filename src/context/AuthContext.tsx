import React from 'react';
import storage from '../utils/storage';
import emailService from '../utils/emailService';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => false,
  register: () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  // Initialize auth from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('mindful_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }

    // Initialize with demo admin user on first load
    let allUsers = JSON.parse(localStorage.getItem('mindful_users') || '[]');
    
    if (allUsers.length === 0) {
      console.log('Initializing demo users on app startup...');
      const demoAdmin = {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        isAdmin: true,
      };
      const demoUser = {
        id: '2',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo User',
        isAdmin: false,
      };
      allUsers = [demoAdmin, demoUser];
      localStorage.setItem('mindful_users', JSON.stringify(allUsers));
      console.log('Demo users initialized:', allUsers);
    } else {
      console.log('Users already exist in localStorage:', allUsers);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple validation - in real app, this would be an API call
    if (!email || !password) {
      console.log('Login failed: empty email or password');
      return false;
    }

    // Trim whitespace
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Ensure demo users always exist
    let allUsers = JSON.parse(localStorage.getItem('mindful_users') || '[]');
    if (allUsers.length === 0) {
      console.log('No users found, initializing demo users...');
      const demoAdmin = {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        isAdmin: true,
      };
      const demoUser = {
        id: '2',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo User',
        isAdmin: false,
      };
      allUsers = [demoAdmin, demoUser];
      localStorage.setItem('mindful_users', JSON.stringify(allUsers));
      console.log('Demo users initialized:', allUsers);
    }

    console.log('Attempting login with:', trimmedEmail);
    console.log('Available users:', allUsers.map((u: any) => u.email));

    // Check if user exists in localStorage
    const existingUser = allUsers.find((u: any) => {
      const emailMatch = u.email.toLowerCase() === trimmedEmail;
      const passwordMatch = u.password === trimmedPassword;
      console.log(`Checking user ${u.email}: email=${emailMatch}, password=${passwordMatch}, stored="${u.password}", entered="${trimmedPassword}"`);
      return emailMatch && passwordMatch;
    });

    if (existingUser) {
      console.log('Login successful for:', existingUser.email);
      const userData: User = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        isAdmin: existingUser.isAdmin || false,
      };
      setUser(userData);
      localStorage.setItem('mindful_user', JSON.stringify(userData));
      
      // Also sync with storage profile
      storage.updateUserProfile({
        name: existingUser.name,
        isAdmin: existingUser.isAdmin || false,
      });

      // Send login confirmation email
      emailService.sendLoginConfirmationEmail(existingUser.email, existingUser.name);
      
      return true;
    }

    console.log('Login failed: user not found or password mismatch');
    return false;
  };

  const register = (email: string, password: string, name: string): boolean => {
    // Validation
    if (!email || !password || !name) return false;
    if (password.length < 6) return false;

    // Check if user already exists
    const allUsers = JSON.parse(localStorage.getItem('mindful_users') || '[]');
    if (allUsers.some((u: any) => u.email === email)) {
      return false; // User already exists
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this should be hashed!
      name,
      isAdmin: false,
    };

    allUsers.push(newUser);
    localStorage.setItem('mindful_users', JSON.stringify(allUsers));

    // Auto-login after registration
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: false,
    };
    setUser(userData);
    localStorage.setItem('mindful_user', JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindful_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
