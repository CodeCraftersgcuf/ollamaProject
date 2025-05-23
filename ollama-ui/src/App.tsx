import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar isOpen={sidebarOpen} selectedChat={selectedChat} onSelect={setSelectedChat} />
      
      <div
        className="flex-1 flex flex-col"
        style={{ paddingLeft: sidebarOpen ? 288 : 0 }} // 72 * 4 = 288px
      >
        {/* Top bar with logout button */}
        <div className="fixed right-0 top-0 z-30 flex items-center p-2 bg-white border-b border-gray-200" style={{ left: sidebarOpen ? 288 : 0 }}>
          {user?.role === 'superadmin' && (
            <button
              className="bg-white px-3 py-1 rounded-md hover:bg-gray-200 text-black mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '🡸' : '🡺'}
            </button>
          )}
          <button
            className="ml-auto flex items-center gap-1 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        <div className={user?.role === 'superadmin' ? 'pt-12' : ''}>
          <ChatArea selectedChat={selectedChat} readOnly={selectedChat !== 'new-chat'} />
        </div>
      </div>
    </div>
  );
}
