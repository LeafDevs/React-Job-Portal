import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';

export default function Settings() {
  // State for form fields
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState<{[key: string]: string}>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState('');
  const [resume, setResume] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State to track modified fields
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = 'Settings | HHS';
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    try {
      const response = await fetch('https://api.lesbians.monster/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      if (!data) {
        throw new Error('No data received from server');
      }

      // Handle unauthorized access
      if (data.code === 401) {
        localStorage.removeItem('token');
        window.location.href = "/auth";
        return;
      }

      // Initialize form fields with user data from profile_info
      if (data.profile_info) {
        setBio(data.profile_info.bio || '');
        setSocialLinks(data.profile_info.social_links || {});
        setPortfolio(data.profile_info.portfolio || '');
        setResume(data.profile_info.resume || '');
        setTwoFactorEnabled(data.profile_info.two_factor_auth || false);
        console.log('Initial 2FA state:', data.profile_info.two_factor_auth);
      }

      // Reset modified fields tracking
      setModifiedFields(new Set());
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (setting: string, value: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    try {
      console.log(`Updating setting ${setting} with value:`, value);
      
      const response = await fetch('https://api.lesbians.monster/profile/edit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          setting,
          value
        })
      });

      if (!response.ok) {
        console.error(`Failed to update setting ${setting}. Status:`, response.status);
        throw new Error('Failed to update setting');
      }

      const result = await response.json();
      console.log(`Update result for ${setting}:`, result);

      if (result.code !== 200) {
        throw new Error(result.error || 'Failed to update setting');
      }

      setSuccess('Setting updated successfully');
      setTimeout(() => setSuccess(null), 3000);

      // Update local state with new profile info
      if (result.profile_info) {
        setBio(result.profile_info.bio || '');
        setSocialLinks(result.profile_info.social_links || {});
        setPortfolio(result.profile_info.portfolio || '');
        setResume(result.profile_info.resume || '');
        setTwoFactorEnabled(result.profile_info.two_factor_auth || false);
        console.log('Updated 2FA state:', result.profile_info.two_factor_auth);
      }
      return true;

    } catch (err) {
      const error = err as Error;
      console.error('Error updating setting:', error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const handleFieldChange = async (field: string, value: any) => {
    // Update the field value
    switch(field) {
      case 'bio':
        setBio(value);
        break;
      case 'portfolio':
        setPortfolio(value);
        break;
      case 'resume':
        setResume(value);
        break;
      case 'twofa':
        console.log('Attempting to update 2FA to:', value);
        const success = await updateSetting('two_factor_auth', value);
        console.log('2FA update success:', success);
        if (success) {
          setTwoFactorEnabled(value);
          setModifiedFields(prev => new Set([...prev, 'twofa']));
        }
        return;
    }
    
    // Track modified field
    if (field !== 'twofa') {
      setModifiedFields(prev => new Set([...prev, field]));
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({...prev, [platform]: value}));
    setModifiedFields(prev => new Set([...prev, `socialLinks.${platform}`]));
  };

  const handleProfileUpdate = async () => {
    // Only update modified fields
    for (const field of modifiedFields) {
      if (field.startsWith('socialLinks.')) {
        const platform = field.split('.')[1];
        await updateSetting('social_links', {...socialLinks, [platform]: socialLinks[platform]});
      } else if (field !== 'twofa') { // Skip twofa as it's handled separately
        const value: { [key: string]: any } = {
          bio,
          portfolio,
          resume
        };
        await updateSetting(field, value[field]);
      }
    }
    
    // Clear modified fields after successful update
    setModifiedFields(new Set());
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch('https://api.lesbians.monster/profile/edit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          setting: 'password',
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      const result = await response.json();
      if (result.code !== 200) {
        throw new Error(result.error || 'Failed to change password');
      }

      if(result.code===200) {
        localStorage.removeItem('token');
        window.location.href = "/auth";
      }

      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      <Nav />

      <main className="flex-1 py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {isLoading ? (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <div className="relative">
                  <textarea 
                    value={bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100 resize-none" 
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio Link</label>
                <div className="relative">
                  <input 
                    type="url"
                    value={portfolio}
                    onChange={(e) => handleFieldChange('portfolio', e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume Link</label>
                <div className="relative">
                  <input 
                    type="url"
                    value={resume}
                    onChange={(e) => handleFieldChange('resume', e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Social Links</label>
                {[
                  { platform: 'twitter', url: 'https://twitter.com/' },
                  { platform: 'github', url: 'https://github.com/' },
                  { platform: 'linkedin', url: 'https://linkedin.com/in/' }
                ].map(({ platform, url }) => (
                  <div key={platform} className="flex items-center space-x-4">
                    <span className="text-gray-500 dark:text-gray-400 min-w-[120px]" data-notranslate>
                      {url}
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={platform.charAt(0).toUpperCase() + platform.slice(1) + " username"}
                        value={socialLinks[platform] || ''}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
                <button 
                  onClick={() => setShowPasswordDialog(true)} 
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Change Password
                </button>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => handleFieldChange('twofa', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</span>
                </label>
              </div>

              <button 
                onClick={handleProfileUpdate}
                disabled={modifiedFields.size === 0}
                className={`w-full px-4 py-3 rounded-lg transition-colors ${
                  modifiedFields.size > 0 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Change Password</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="New Password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPasswordDialog(false)}
                    className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer string={"blocky"} />
    </div>
  );
}
