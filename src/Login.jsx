import { useState, useContext } from 'react';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';
import { UserContext } from './context/UserContext';
import logo from './assets/logo.png'; // Ensure this path is correct

function Login() {
  const { handleLoginSuccess } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/gym_back/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          remember_me: formData.rememberMe
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('gymAdminToken', data.token);
      localStorage.setItem('gymAdminUser', JSON.stringify(data.user));
      handleLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url('./src/assets/bg.jpg')`, // Replace with correct public path if used
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f4b8b',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="card shadow-lg border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-header text-white text-center py-4" style={{ backgroundColor: '#1f4b8b' }}>
          <img src={logo} alt="PK Fitness" style={{ height: '50px' }} className="mb-2" />
          <h2 className="mb-0">PK FITNESS</h2>
          <p className="mb-0">Sign in to manage your gym</p>
        </div>

        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle size={18} className="me-2" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              {/* <a href="#" className="text-primary text-decoration-none">
                Forgot password?
              </a> */}
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 d-flex justify-content-center align-items-center"
              style={{ backgroundColor: '#1f4b8b', color: 'white' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <LogIn size={18} className="me-2" />
              )}
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted">© 2025 PK Fitness</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
