import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { Mail, Calendar, MapPin, Globe, SmilePlus, ImagePlus, X, User, Trash2 } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  type: string;
  email: string;
  created_at: string;
  profile_info: {
    profile_picture?: string;
    bio: string;
    banner?: string;
    social_links: {
      [key: string]: string;
    };
    portfolio: string;
    resume: string;
    location?: string;
  };
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number; 
  shares: number;
  images?: string[];
}

// interface SearchResult {
//   id: string;
//   name: string;
//   profile_info: Profile['profile_info'];
// }

interface UserData {
  id: string;
  following: string[];
}

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [canPost, setCanPost] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    document.title = 'Profile | HHS';
    fetchProfile();
    fetchPosts();
  }, [id]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api.lesbians.monster/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      console.log(data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const uploadPost = async (post: Post) => {
    try {
      const token = localStorage.getItem('token');
      const imagePromises = postImages.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert image to base64'));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const response = await fetch('https://api.lesbians.monster/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: post.content,
          images: base64Images
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      
      const completePost: Post = {
        ...newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        images: base64Images,
        created_at: new Date().toISOString()
      };

      setPosts(prevPosts => [completePost, ...(Array.isArray(prevPosts) ? prevPosts : [])]);
      
      setNewPostContent('');
      setPostImages([]);
      setShowCreatePost(false);

    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api.lesbians.monster/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      setProfile(profileData);

      const selfResponse = await fetch('https://api.lesbians.monster/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!selfResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData: UserData = await selfResponse.json();
      setIsFollowing(userData.following?.includes(profileData.id.toString()) || false);
      setIsOwnProfile(userData.id === profileData.id);

      setCanPost(profileData.type === 'employer' || profileData.type === 'admin');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api.lesbians.monster/follow/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          follow_id: id,
          action: isFollowing ? 'unfollow' : 'follow'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error updating follow status:', err);
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
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-black">
      <Nav />
      <main className="relative">
        {/* Profile Banner */}
        <div className="h-[500px] w-full relative">
          {profile?.profile_info.banner ? (
            <img 
              src={profile.profile_info.banner}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
          )}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-40 relative z-10">
          {/* Profile Card */}
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-12 border border-white/20 dark:border-zinc-700/30">
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <div className="mb-8">
                <div className="h-40 w-40 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-700 shadow-2xl">
                  {profile?.profile_info.profile_picture ? (
                    <img 
                      src={profile.profile_info.profile_picture}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-4 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {profile?.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {profile?.type ? profile.type.charAt(0).toUpperCase() + profile.type.slice(1) : ''}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  {profile?.profile_info.bio}
                </p>
              </div>

              {!isOwnProfile ? (
                <button
                  onClick={handleFollow}
                  className={`px-10 py-3 rounded-full font-medium text-lg transition-all ${
                    isFollowing 
                      ? 'bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-600'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              ) : (
                canPost && (
                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className="px-10 py-3 rounded-full font-medium text-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:opacity-90 transition-all"
                  >
                    Create Post
                  </button>
                )
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full">
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">
                    <MapPin className="h-6 w-6 mx-auto mb-2" />
                    <span>{profile?.profile_info.location || 'Location not set'}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">
                    <Mail className="h-6 w-6 mx-auto mb-2" />
                    <span>{profile?.email}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-400">
                    <Globe className="h-6 w-6 mx-auto mb-2" />
                    <span>Portfolio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Post Form */}
          {showCreatePost && canPost && (
            <div className="mt-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-8 border border-white/20 dark:border-zinc-700/30">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full p-6 rounded-2xl bg-white/50 dark:bg-zinc-700/50 text-gray-900 dark:text-white resize-none mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 mb-6">
                {postImages.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-2xl overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        const newImages = [...postImages];
                        newImages.splice(index, 1);
                        setPostImages(newImages);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (postImages.length + files.length <= 4) {
                        setPostImages([...postImages, ...files]);
                      }
                    }}
                  />
                  <label
                    htmlFor="image-upload"
                    className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                  >
                    <ImagePlus className="h-6 w-6" />
                  </label>

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <SmilePlus className="h-6 w-6" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    const newPost: Post = {
                      id: Date.now().toString(),
                      content: newPostContent,
                      created_at: new Date().toISOString(),
                      likes: 0,
                      comments: 0,
                      shares: 0
                    };
                    uploadPost(newPost);
                  }}
                  disabled={!newPostContent.trim()}
                  className="px-8 py-3 rounded-xl font-medium text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  Share
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute z-20 mt-2">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) => {
                      setNewPostContent(newPostContent + emojiObject.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Posts */}
          <div className="mt-8 space-y-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-8 border border-white/20 dark:border-zinc-700/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        {profile?.profile_info.profile_picture ? (
                          <img
                            src={profile.profile_info.profile_picture}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {profile?.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isOwnProfile && canPost && (
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          try {
                            const response = await fetch(`https://api.lesbians.monster/posts/${post.id}/delete`, {
                              method: 'GET',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              }
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to delete post');
                            }
                            
                            setPosts(posts.filter(p => p.id !== post.id));
                          } catch (err) {
                            console.error('Error deleting post:', err);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-xl transition-colors bg-transparent"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    {post.content}
                  </p>

                  {post.images && (
                    <div className="grid grid-cols-2 gap-4">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full aspect-video object-cover rounded-2xl"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-12 text-center border border-white/20 dark:border-zinc-700/30">
                <p className="text-gray-600 dark:text-gray-400 text-xl">No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="mt-20">
        <Footer string="blocky" />
      </div>
    </div>
  );
}

