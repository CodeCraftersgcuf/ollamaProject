// src/pages/LoginPage.tsx

import { useState } from 'react';
import { login } from '../utils/mutation';
import { useNavigate } from 'react-router-dom'; // for redirection after login

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ username: email, password });
      localStorage.setItem('authToken', data.token); // Save token
      navigate('/'); // After login, go to Home
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold mb-8 text-center text-black">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Input */}
          <div className="relative">
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`peer w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600`}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-gray-500 text-sm left-4 top-2.5 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-green-600"
            >
              Email address
            </label>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute text-gray-500 text-sm left-4 top-2.5 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-green-600"
            >
              Password
            </label>

            {/* Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

   

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Continue
          </button>
        </form>

     
      </div>
    </div>
  );
}
