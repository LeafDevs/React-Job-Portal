import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Overlay from '../components/Overlay';

const getTimestamp = () => {
  return new Date().toISOString();
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/v1/prism/auth/login';
    const payload = { email, password };
    try {
      console.log(`[${getTimestamp()}] Submitting form with payload:`, payload);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(`[${getTimestamp()}] ${isLogin ? 'Login' : 'Register'} response:`, data);
      if (response.ok) {
        console.log(`[${getTimestamp()}] Token received:`, data.token);
        const token = data.token;
        localStorage.setItem('token', token);
        console.log(`[${getTimestamp()}] Token stored in localStorage:`, token);
        navigate('/dash');
      }
    } catch (error) {
      console.error(`[${getTimestamp()}] Error:`, error);
    }
  };

  const handleGoogleSignIn = () => {
    // Handle Google Sign In logic here
    console.log(`[${getTimestamp()}] Sign in with Google`);
  };

  return (
    <>
      <Overlay />
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#341A00]">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-50 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#341A00]">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-[#341A00] rounded-md shadow-sm placeholder-[#341A00] focus:outline-none focus:ring-[#341A00] focus:border-[#341A00] sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#341A00]">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-[#341A00] rounded-md shadow-sm placeholder-[#341A00] focus:outline-none focus:ring-[#341A00] focus:border-[#341A00] sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#C7AC59] bg-[#341A00] hover:bg-[#4A2500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#341A00]"
                >
                  {isLogin ? 'Sign in' : 'Register'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#341A00]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-[#341A00]">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex justify-center items-center py-2 px-4 border border-[#341A00] rounded-md shadow-sm text-sm font-medium text-[#341A00] bg-white hover:bg-gray-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
                  Sign in with Google
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#341A00]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-[#341A00]">
                    {isLogin ? 'New to our platform?' : 'Already have an account?'}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`[${getTimestamp()}] Toggling form mode to ${isLogin ? 'Register' : 'Login'}`);
                    setIsLogin(!isLogin);
                  }}
                  className="text-sm font-medium text-[#341A00] hover:text-[#4A2500]"
                >
                  {isLogin ? 'Create a new account' : 'Sign in to your account'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
