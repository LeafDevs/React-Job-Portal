import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from 'lucide-react';
import Footer from '@/components/ui/footer';
function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
  <div className={`bg-[#f7efd7] text-[#341A00] min-h-screen flex flex-col items-center justify-center w-full`}>
      <Card className="bg-white text-[#341A00] p-8 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-4">
            {isLogin ? 'Login' : 'Register'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border border-[#C7AC59] rounded-lg"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-[#C7AC59] rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-[#C7AC59] rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#341A00] text-[#C7AC59] p-2 rounded-lg font-semibold hover:bg-[#C7AC59] hover:text-[#341A00] transition duration-200"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={toggleAuthMode}
              className="text-[#C7AC59] hover:underline"
            >
              {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              className="w-full bg-white text-gray-700 p-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 border border-gray-300 flex items-center justify-center"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
              {isLogin ? 'Login with Google' : 'Register with Google'}
            </button>
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}

export default Auth;
