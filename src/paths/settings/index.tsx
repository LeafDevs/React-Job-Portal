import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from 'lucide-react';

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userType, setUserType] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    push: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: false,
    emailVisible: false
  });
  const [language, setLanguage] = useState('');
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: ''
  });
  const [theme, setTheme] = useState('light');

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

      setName(data.name || '');
      setEmail(data.email || '');
      setProfilePicture(data.profilePicture || null);
      setUserType(data.type || '');
      setLastLogin(data.lastLogin || '');
      setNotificationSettings(data.notificationSettings || {
        email: false,
        push: false
      });
      setPrivacySettings(data.privacySettings || {
        profileVisible: false,
        emailVisible: false
      });
      setLanguage(data.language || '');
      setSecuritySettings(data.securitySettings || {
        twoFactorEnabled: false,
        lastPasswordChange: ''
      });
      setTheme(data.theme || 'light');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch('https://api.lesbians.monster/user/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          notificationSettings,
          privacySettings,
          language,
          theme
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
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
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profilePicture || "https://github.com/leafdevs.png"} alt={name} />
                  <AvatarFallback>{name ? name.charAt(0) : ''}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                  <p className="text-xs text-gray-400">Last login: {lastLogin}</p>
                  <p className="text-xs text-gray-400">Account type: {userType}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-zinc-700">
              <div onClick={handleProfileUpdate} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Notifications ({notificationSettings?.email ? 'On' : 'Off'})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Privacy ({privacySettings?.profileVisible ? 'Public' : 'Private'})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Language ({language})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div onClick={() => setShowPasswordDialog(true)} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Security ({securitySettings?.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Theme ({theme})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4 dark:text-white">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                />
                <input
                  type="password"
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowPasswordDialog(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
