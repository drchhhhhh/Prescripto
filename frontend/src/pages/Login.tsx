import { useState } from 'react';
import { User, Lock } from "lucide-react";
import loginImage from '../assets/react.svg';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { userId, password });
  };

  return (
    <div className="flex min-h-screen font-poppins bg-gray-100">
      <div className="w-[730px] h-[425px] m-auto flex rounded-lg overflow-hidden shadow-lg">
        {/* Left side - Image */}
        <div className="w-1/2 bg-gray-300 flex items-center justify-center">
          <img src={loginImage} alt="Login Visual" className="w-full h-[425px] object-cover" />
        </div>

        {/* Right side - Login form */}
        <div className="w-1/2 bg-white p-6 flex flex-col justify-center">
          <h2 className="text-[25px] font-semibold text-center text-green-700 mb-1">
            Sign In
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            {/* User ID */}
            <div className="flex flex-col gap-1">
              <label htmlFor="userId" className="text-[13px] font-medium text-gray-800">
                User ID
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
                  placeholder="Enter User ID"
                  className="w-full h-[35px] pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-[13px] font-medium text-gray-800">
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
                className={`w-[167px] h-[46px] px-6 py-3 text-white font-semibold text-[16px] rounded-full transition-colors duration-300 ${
                  isHovered ? 'bg-green-500' : 'bg-green-700'
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
