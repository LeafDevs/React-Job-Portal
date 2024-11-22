import { useState, useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { Mail, Trash2, Star, Send, Archive, Edit3 } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'hiring@company.com',
      to: 'me@example.com',
      subject: 'Interview Invitation',
      content: 'Hi there,\n\nWe would like to invite you for an interview for the Software Developer position. Are you available next Tuesday at 2pm?\n\nBest regards,\nHR Team',
      date: '2024-01-15',
      read: true
    },
    {
      id: '2',
      from: 'support@platform.com', 
      to: 'me@example.com',
      subject: 'Welcome to Our Platform',
      content: 'Welcome!\n\nThank you for joining our platform. Here are some tips to get started...',
      date: '2024-01-14',
      read: false
    },
    {
      id: '3',
      from: 'recruiter@tech.com',
      to: 'me@example.com',
      subject: 'Job Opportunity',
      content: 'Hello,\n\nI came across your profile and wanted to discuss an exciting opportunity at our company...',
      date: '2024-01-13',
      read: true
    }
  ]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [currentFolder, setCurrentFolder] = useState('inbox');

  useEffect(() => {
    document.title = 'Messages | HHS';
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    try {
      const response = await fetch('https://api.lesbians.monster/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://api.lesbians.monster/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setShowComposeDialog(false);
      setNewMessage({ to: '', subject: '', content: '' });
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://api.lesbians.monster/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      <Nav />

      <main className="flex-1 flex py-24">
        {/* Left Sidebar */}
        <div className="w-64 bg-white dark:bg-zinc-800 border-r dark:border-zinc-700 p-4">
          <button
            onClick={() => setShowComposeDialog(true)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
          >
            <Edit3 className="h-4 w-4" />
            New Message
          </button>

          <nav className="space-y-1">
            <button
              onClick={() => setCurrentFolder('inbox')}
              className={`w-full bg-gray-50 dark:bg-zinc-700 flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentFolder === 'inbox' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Mail className="h-4 w-4" />
              Inbox
            </button>
            <button
              onClick={() => setCurrentFolder('starred')}
              className={`w-full bg-gray-50 dark:bg-zinc-700 flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentFolder === 'starred' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Star className="h-4 w-4" />
              Starred
            </button>
            <button
              onClick={() => setCurrentFolder('sent')}
              className={`w-full bg-gray-50 dark:bg-zinc-700 flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentFolder === 'sent' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Send className="h-4 w-4" />
              Sent
            </button>
            <button
              onClick={() => setCurrentFolder('archive')}
              className={`w-full bg-gray-50 dark:bg-zinc-700 flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentFolder === 'archive' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </nav>
        </div>

        {/* Message List */}
        <div className="flex-1 flex">
          <div className={`w-96 border-r dark:border-zinc-700 ${selectedMessage ? '' : 'flex-1'}`}>
            <div className="p-4 border-b dark:border-zinc-700">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="divide-y dark:divide-zinc-700">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer ${
                    message.read ? 'bg-white dark:bg-zinc-800' : 'bg-blue-50 dark:bg-blue-900/20'
                  } ${selectedMessage?.id === message.id ? 'border-l-4 border-blue-600' : ''} hover:bg-gray-50 dark:hover:bg-zinc-700`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{message.from}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{message.date}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{message.subject}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message View */}
          {selectedMessage && (
            <div className="flex-1 bg-white dark:bg-zinc-800">
              <div className="p-6 border-b dark:border-zinc-700">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedMessage.subject}</h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      From: {selectedMessage.from}<br />
                      Date: {selectedMessage.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full">
                      <Archive className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">{selectedMessage.content}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Compose Dialog */}
      {showComposeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">New Message</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To"
                className="w-full p-3 bg-gray-50 dark:bg-zinc-700 border dark:border-zinc-600 rounded-lg text-gray-900 dark:text-white"
                value={newMessage.to}
                onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 bg-gray-50 dark:bg-zinc-700 border dark:border-zinc-600 rounded-lg text-gray-900 dark:text-white"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              />
              <textarea
                placeholder="Write your message..."
                className="w-full h-64 p-3 bg-gray-50 dark:bg-zinc-700 border dark:border-zinc-600 rounded-lg resize-none text-gray-900 dark:text-white"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowComposeDialog(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer string={"blocky"} />
    </div>
  );
}
