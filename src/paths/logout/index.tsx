import { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = '/auth';
  }, []);

  return null; // Optionally, you can return a loading spinner or message here
};

export default Logout;
