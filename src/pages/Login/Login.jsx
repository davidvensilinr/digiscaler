import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import { login } from '../../services/api';
=======
import usersData from '../../data/users.json';
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

<<<<<<< HEAD
    // Call backend
    login(email, password)
      .then((data) => {
        const user = data.user;
        onLogin(user.email, user);
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
=======
    // Simulate API call delay
    setTimeout(() => {
      const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const allUsers = [...usersData.users, ...localUsers];
      const user = allUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        // Notify parent (App) of successful login
        onLogin(user.email, {
          name: user.name,
          email: user.email,
          type: user.type,
          avatar: user.creatorData?.profilePic || user.avatar || '',
        });
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 800);
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/signup/creator">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;