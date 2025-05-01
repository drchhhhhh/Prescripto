import { useState } from 'react';
import { User, Lock } from "lucide-react";
import '../../index.css';
import loginImage from '../../assets/login.png';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log('Login attempt with:', { userId, password });
  };

  // Define styles directly to ensure they're applied
  const pageStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#f5f5f5'
  };

  const containerStyle = {
    width: '730px',
    height: '425px',
    margin: 'auto',
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };  

  const leftSideStyle = {
    width: '50%',
    backgroundColor: '#d1d1d1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const rightSideStyle = {
    width: '50%',
    backgroundColor: '#ffffff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const headingStyle = {
    fontSize: '25px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#388E3C',
    marginBottom: '5px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    color: '#333'
  };

  const inputContainerStyle = {
    position: 'relative'
  };

  const iconContainerStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none'
  };

  const inputStyle = {
    width: '100%',
    height: '35px',
    padding: '12px 12px 12px 40px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none'
  };

  const buttonContainerStyle = {
    paddingTop: '16px',
    display: 'flex',
    justifyContent: 'center'
  };

  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    width: '167px',
    height: '46px',
    padding: '12px',
    backgroundColor: isHovered ? '#4CAF50' : '#388E3C',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Left side - Image placeholder */}
        <div style={leftSideStyle}>
          <img src={loginImage} alt="Login Visual" style={{ width: '100%', height: '425'}} />
        </div>
        
        {/* Right side - Login form */}
        <div style={rightSideStyle}>
          <h2 style={headingStyle}>Sign In</h2>
          
          <form style={formStyle} onSubmit={handleLogin}>
            <div style={inputGroupStyle}>
              <label htmlFor="userId" style={labelStyle}>
                User ID
              </label>
              <div style={inputContainerStyle}>
                <div style={iconContainerStyle}>
                  <User size={20} color="#388E3C" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  style={inputStyle}
                />
              </div>
            </div>
            
            <div style={inputGroupStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <div style={inputContainerStyle}>
                <div style={iconContainerStyle}>
                  <Lock size={20} color="#388E3C" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  style={inputStyle}
                />
              </div>
            </div>
            
            <div style={buttonContainerStyle}>
              <button
                type="submit"
                style={buttonStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;