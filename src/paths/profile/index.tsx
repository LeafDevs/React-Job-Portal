import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar, Briefcase, Link, FileText, MapPin, Globe, Heart, MessageCircle, Share2, SmilePlus, ImagePlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

interface Profile {
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

interface SearchResult {
  id: string;
  name: string;
  profile_info: {
    profile_picture?: string;
  };
}

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
      setPosts(Array.isArray(data) ? data : []); // Ensure data is an array
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
      
      // Create a complete post object with all required fields
      const completePost: Post = {
        ...newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        images: base64Images,
        created_at: new Date().toISOString()
      };

      // Update posts state with the new post
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

      // Check if viewing own profile
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      <Nav />

      <main className="flex-1 py-24">
        {/* Search Bar */}
        <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 py-6">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search profiles..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={async (e) => {
                  const token = localStorage.getItem('token');
                  if (e.target.value.length > 2) {
                    try {
                      const response = await fetch(`https://api.lesbians.monster/search/profiles?q=${e.target.value}`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      if (response.ok) {
                        const results = await response.json();
                        console.log(results);
                        // Create or update dropdown with search results
                        const dropdown = document.querySelector('#search-results');
                        if (!dropdown) {
                          const newDropdown = document.createElement('div');
                          newDropdown.id = 'search-results';
                          newDropdown.className = 'absolute z-10 w-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700';
                          
                          const resultsList = document.createElement('div');
                          resultsList.className = 'py-2';
                          
                          results.forEach((result: SearchResult) => {
                            const resultItem = document.createElement('a');
                            resultItem.href = `/profile/${result.id}`;
                            resultItem.className = 'block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700';
                            
                            const resultContent = document.createElement('div');
                            resultContent.className = 'flex items-center';
                            
                            const avatar = document.createElement('div');
                            avatar.className = 'w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-600 mr-3';
                            if (result.profile_info.profile_picture) {
                              avatar.style.backgroundImage = `url(${result.profile_info.profile_picture})`;
                              avatar.style.backgroundSize = 'cover';
                            }
                            
                            const name = document.createElement('span');
                            name.textContent = result.name;
                            
                            resultContent.appendChild(avatar);
                            resultContent.appendChild(name);
                            resultItem.appendChild(resultContent);
                            resultsList.appendChild(resultItem);
                          });
                          
                          newDropdown.appendChild(resultsList);
                          e.target.parentElement?.appendChild(newDropdown);
                        } else {
                          dropdown.innerHTML = '';
                          const resultsList = document.createElement('div');
                          resultsList.className = 'py-2';
                          
                          results.forEach((result: SearchResult) => {
                            const resultItem = document.createElement('a');
                            resultItem.href = `/profile/${result.id}`;
                            resultItem.className = 'block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700';
                            
                            const resultContent = document.createElement('div');
                            resultContent.className = 'flex items-center';
                            
                            const avatar = document.createElement('div');
                            avatar.className = 'w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-600 mr-3';
                            if (result.profile_info.profile_picture) {
                              avatar.style.backgroundImage = `url(${result.profile_info.profile_picture})`;
                              avatar.style.backgroundSize = 'cover';
                            }
                            
                            const name = document.createElement('span');
                            name.textContent = result.name;
                            
                            resultContent.appendChild(avatar);
                            resultContent.appendChild(name);
                            resultItem.appendChild(resultContent);
                            resultsList.appendChild(resultItem);
                          });
                          
                          dropdown.appendChild(resultsList);
                        }
                      }
                    } catch (err) {
                      console.error('Error searching profiles:', err);
                    }
                  }
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[200px] md:h-[300px] w-full">
          {profile?.profile_info.banner && (
            <img 
              src={profile.profile_info.banner}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex items-end">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white dark:border-zinc-900 rounded-full">
                  {profile?.profile_info.profile_picture && (
                    <AvatarImage 
                      src={profile.profile_info.profile_picture}
                      alt={profile.name}
                    />
                  )}
                  <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="ml-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {profile?.name}
                  </h1>
                  <div className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{profile?.type ? profile.type.charAt(0).toUpperCase() + profile.type.slice(1) : ''}</span>
                  </div>
                </div>
              </div>

              {!isOwnProfile ? (
                <button
                  onClick={handleFollow}
                  className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-medium transition ${
                    isFollowing 
                      ? 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              ) : (
                <button
                  onClick={() => setShowCreatePost(!showCreatePost)}
                  className="mt-4 md:mt-0 px-6 py-2 rounded-full font-medium bg-blue-500 text-white hover:bg-blue-600"
                >
                  Create Post
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="mt-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {profile?.profile_info.bio}
              </p>

              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                {profile?.profile_info.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.profile_info.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
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

          {/* Create Post Form */}
          {showCreatePost && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-lg bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white resize-none mb-4"
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                {postImages.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const newImages = [...postImages];
                        newImages.splice(index, 1);
                        setPostImages(newImages);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      ×
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
                    className="cursor-pointer flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 bg-transparent"
                  >
                    <ImagePlus className="h-4 w-4" />
                    <span className="ml-2">({postImages.length}/4)</span>
                  </label>

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 bg-transparent"
                  >
                    <SmilePlus className="h-4 w-4" />
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Post
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute z-10">
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
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        {profile?.profile_info.profile_picture && (
                          <AvatarImage
                            src={profile.profile_info.profile_picture}
                            alt={profile.name}
                          />
                        )}
                        <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {profile?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isOwnProfile && (
                      <div className="relative">
                        <button 
                          onClick={() => {
                            const dropdown = document.getElementById(`dropdown-${post.id}`);
                            if (dropdown) {
                              dropdown.classList.toggle('hidden');
                            }
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        <div 
                          id={`dropdown-${post.id}`}
                          className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-700 ring-1 ring-black ring-opacity-5 z-10"
                        >
                          <div className="py-1">
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
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-600 bg-transparent"
                            >
                              Delete Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {post.content}
                  </p>

                  {post.images && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                    <button className="flex items-center space-x-2 bg-transparent">
                      <Heart className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-transparent">
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-transparent">
                      <Share2 className="h-5 w-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">This user hasn't posted anything yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer string="blocky" />
    </div>
  );
}
