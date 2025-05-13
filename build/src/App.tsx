import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { getUserInfo } from './utils/getToken'; // ✅ import

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>('new-chat');

  const navigate = useNavigate();
  const user = getUserInfo(); // ✅ get user info from token

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) navigate('/login');
  }, []);

  return (
    <div className="flex h-screen bg-[#111111] text-white">
      <Sidebar isOpen={sidebarOpen} selectedChat={selectedChat} onSelect={setSelectedChat} />
      
      <div className="flex-1 flex flex-col">
        {user?.role === 'superadmin' && (
          <div className="p-2 border-b border-gray-700">
            <button
              className="bg-black px-3 py-1 rounded-md hover:bg-gray-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '🡸' : '🡺'}
            </button>
          </div>
        )}

        <ChatArea selectedChat={selectedChat} readOnly={selectedChat !== 'new-chat'} />
      </div>
    </div>
  );
}
