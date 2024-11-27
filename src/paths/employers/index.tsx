import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { User } from 'lucide-react';

interface Employer {
  id: string;
  name: string;
  email: string;
  created_at: string;
  profile_info: {
    profile_picture?: string;
    bio: string;
    location?: string;
  };
}

export default function Employers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    document.title = 'Employers | HHS';
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.lesbians.monster/employers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employers');
      }

      const data = await response.json();
      console.log(data);
      if (data.code === 200) {
        setEmployers(data.employers);
      } else {
        throw new Error('Invalid response format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employers:', err);
      setError('Failed to load employers');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 py-16">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-black">
      <Nav />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Employers
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employers.map((employer) => (
            <Link
              key={employer.id}
              to={`/profile/${employer.id}`}
              className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-zinc-700/30 hover:scale-105 transition-transform"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  {employer.profile_info.profile_picture ? (
                    <img
                      src={employer.profile_info.profile_picture}
                      alt={employer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {employer.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {employer.profile_info.location || 'Location not set'}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {employer.profile_info.bio}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer string="blocky" />
    </div>
  );
}
