// src/App.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>('Digital Marketing Job Post');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); // If no token, go to login
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar isOpen={sidebarOpen} selectedChat={selectedChat} onSelect={setSelectedChat} />
      <div className="flex-1 flex flex-col">
        <div className="p-2 bg-black border-b border-gray-700">
          <button
            className="bg-black px-3 py-1 rounded-md hover:bg-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '🡸' : '🡺'}
          </button>
        </div>
        <ChatArea selectedChat={selectedChat} />
      </div>
    </div>
  );
}
