import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar, Briefcase, Link, FileText, MapPin, Globe, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface Profile {
  name: string;
  type: string;
  email: string;
  created_at: string;
  profile_info: {
    profilePicture: string;
    bio: string;
    banner: string;
    social_links: {
      [key: string]: string;
    };
    portfolio: string;
    resume: string;
    location?: string;
  };
}

// interface Post {
//   id: string;
//   content: string;
//   created_at: string;
//   likes: number;
//   comments: number;
//   shares: number;
//   image?: string;
// }

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  //const [posts, setPosts] = useState<Post[]>([]);

  const posts = [
    {
      id: '1',
      content: 'Just completed a major project using React and TypeScript! Really excited about how it turned out. Check out the live demo in my portfolio 🚀',
      created_at: '2024-01-15T14:30:00Z',
      likes: 42,
      comments: 8,
      shares: 3,
      image: 'https://lesbians.monster/images/portfolio.webp'
    },
    {
      id: '2',
      content: 'Attended an amazing tech conference today. Met some brilliant developers and learned about the latest trends in web development. #TechConf2024 #WebDev',
      created_at: '2024-01-14T09:15:00Z',
      likes: 28,
      comments: 5,
      shares: 2
    },
    {
      id: '3',
      content: 'Excited to announce that I\'ll be speaking at the upcoming JavaScript Conference! Topic: "Building Scalable Applications with React". See you there! 🎤',
      created_at: '2024-01-13T18:45:00Z',
      likes: 76,
      comments: 12,
      shares: 15
    }
  ];

  useEffect(() => {
    document.title = 'Profile | HHS';
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    try {
      const response = await fetch(`https://api.lesbians.monster/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      <Nav />

      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-[200px] md:h-[300px] w-full">
          <img 
            src={profile?.profile_info.banner || "https://via.placeholder.com/1500x500"} 
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          {/* Profile Header */}
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex items-end">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white dark:border-zinc-900 rounded-full">
                  <AvatarImage 
                    src={profile?.profile_info.profilePicture || "https://github.com/leafdevs.png"} 
                    alt={profile?.name}
                    className="rounded-full"
                  />
                  <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{profile?.name}</h1>
                  <div className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{profile?.type}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    isFollowing 
                      ? 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-lg">{profile?.profile_info.bio}</p>

              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                {profile?.profile_info.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.profile_info.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {profile?.created_at}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{profile?.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {profile?.profile_info.portfolio && (
                  <a 
                    href={profile.profile_info.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    <span>Portfolio</span>
                  </a>
                )}
                {profile?.profile_info.resume && (
                  <a 
                    href={profile.profile_info.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Resume</span>
                  </a>
                )}
                {Object.entries(profile?.profile_info.social_links || {}).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    <span>{platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2K</div>
              <div className="text-gray-600 dark:text-gray-400">Followers</div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">843</div>
              <div className="text-gray-600 dark:text-gray-400">Following</div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">56</div>
              <div className="text-gray-600 dark:text-gray-400">Posts</div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6 mb-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={profile?.profile_info.profilePicture || "https://github.com/leafdevs.png"}
                      alt={profile?.name}
                    />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{profile?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {post.content.split(/\s+/).map((word, i) => (
                    word.startsWith('#') ? (
                      <span key={i} className="text-blue-500 hover:underline cursor-pointer">{word} </span>
                    ) : (
                      <span key={i}>{word} </span>
                    )
                  ))}
                </p>
                
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="Post attachment" 
                    className="rounded-lg mb-4 w-full"
                  />
                )}
                
                <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                  <button className="flex items-center space-x-2 hover:text-red-500">
                    <Heart className="h-5 w-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-blue-500">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-500">
                    <Share2 className="h-5 w-5" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer string={"blocky"} />
    </div>
  );
}
