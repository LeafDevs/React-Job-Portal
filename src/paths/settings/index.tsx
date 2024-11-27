import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';

export default function Settings() {
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

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('No data received from server');
      }

      setBio(data.bio || '');
      setSocialLinks(data.socialLinks || {});
      setPortfolio(data.portfolio || '');
      setResume(data.resume || '');
      setTwoFactorEnabled(data.twoFactorEnabled || false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const updateSetting = async (setting: string, value: any) => {
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
          setting,
          value
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      const result = await response.json();
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
      }

    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleProfileUpdate = async () => {
    await updateSetting('bio', bio);
    await updateSetting('social_links', socialLinks);
    await updateSetting('portfolio', portfolio);
    await updateSetting('resume', resume);
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
      const response = await fetch('https://api.lesbians.monster/user/password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
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

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 resize-none" 
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfolio Link</label>
              <input 
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume Link</label>
              <input 
                type="url"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Social Links</label>
              {['twitter', 'github', 'linkedin'].map(platform => (
                <div key={platform} className="mt-2">
                  <input
                    type="url"
                    placeholder={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    value={socialLinks[platform] || ''}
                    onChange={(e) => setSocialLinks({...socialLinks, [platform]: e.target.value})}
                    className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
              <button 
                onClick={() => setShowPasswordDialog(true)} 
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</span>
              </label>
            </div>

            <button 
              onClick={handleProfileUpdate}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                />
                <input
                  type="password"
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowPasswordDialog(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
