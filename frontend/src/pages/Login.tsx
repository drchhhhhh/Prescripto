import { useState } from 'react';
import { User, Lock } from "lucide-react";
import loginImage from '../assets/login.svg';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router';

const LoginPage = () => {
  const { handleLogin } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // THESE ARE USE FOR ERROR HANDLERS ADD A ERROR POPUPS WITH THESE
  const [isWrongCreds, setIsWrongCreds] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        try {
            const isSuccess = await handleLogin(userId, password);

            if (isSuccess) {
                setIsWrongCreds(false)
                setIsServerError(false)
                navigate(from, { replace: true });
            } else {
                setIsWrongCreds(true)
                console.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setIsServerError(true)
            console.error('An error occurred. Please try again later.', error);
        }
  }

  return (
    <div className="flex min-h-screen font-poppins bg-primaryBG">
      <div className="w-[730px] h-[425px] m-auto flex rounded-lg overflow-hidden shadow-lg">
        {/* Left side - Image */}
        <div className="w-1/2 bg-gray-300 flex items-center justify-center">
          <img src={loginImage} alt="Login Visual" className="w-full h-[425px] object-cover" />
        </div>

        {/* Right side - Login form */}
        <div className="w-1/2 bg-white p-6 flex flex-col justify-center">
          <h2 className="text-[25px] font-semibold text-center text- mb-1">
            Sign In
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* User ID */}
            <div className="flex flex-col gap-1">
              <label htmlFor="userId" className="text-[13px] font-medium text-gray-800 text-left">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User size={20} className="text-green-700" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter Username"
                  className="w-full h-[35px] pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-[13px] font-medium text-gray-800 text-left">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={20} className="text-green-700" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full h-[35px] pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className={`w-[167px] h-[46px] px-6 py-3 text-white font-semibold text-[16px] rounded-md transition-colors duration-300 ${
                  isHovered ? 'bg-darkGreen' : 'bg-primaryGreen'
                }`}
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
