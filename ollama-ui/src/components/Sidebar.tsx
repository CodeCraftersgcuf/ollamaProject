import { useQuery } from '@tanstack/react-query';
import { getToken, getUserInfo } from '../utils/getToken';
import { listAdmins } from '../utils/mutation';
import { FiSettings } from 'react-icons/fi';

type SidebarProps = {
  isOpen: boolean;
  selectedChat: string | null;
  onSelect: (label: string) => void;
};

export default function Sidebar({ isOpen, selectedChat, onSelect }: SidebarProps) {
  const token = getToken();
  const user = getUserInfo();

  const {
    data: admins = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!token) throw new Error('No token found!');
      return await listAdmins(token);
    },
    enabled: user?.role === 'superadmin',
  });

  if (user?.role !== 'superadmin') return null;

  return (
    <div
      className={`${isOpen ? 'w-72' : 'w-0'
        } bg-white transition-all duration-300 overflow-hidden border-r border-gray-200 min-h-screen fixed left-0 top-0 z-30 h-screen`}
    >
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-black font-bold text-lg">Chat Admins</h1>
          <a
            href="http://localhost:5173/admin-management"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-black"
            title="Settings"
          >
            <FiSettings size={20} />
          </a>

        </div>

        <div className="flex-1 overflow-y-auto text-sm text-black px-2 py-4 space-y-3 bg-white">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-2 mb-4 text-left"
            onClick={() => onSelect('new-chat')}
          >
            Super Admin Chat
          </button>

          <div className="flex items-center justify-between px-2 mb-1">
            <h2 className="text-xs uppercase text-gray-500">Admins</h2>

          </div>
          {isLoading ? (
            <p className="text-gray-400 text-xs px-2">Loading...</p>
          ) : isError ? (
            <p className="text-red-500 text-xs px-2">Failed to load admins</p>
          ) : admins.length === 0 ? (
            <p className="text-gray-500 text-xs px-2">No admins found.</p>
          ) : (
            <ul className="space-y-1">
              {admins.map((admin: any) => (
                <SidebarItem
                  key={admin._id}
                  label={admin.username}
                  active={selectedChat === admin.username}
                  onClick={() => onSelect(admin.username)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* <div className="text-xs text-gray-500 px-4 py-2 border-t border-[#2b2b2b]">
          © 2025
        </div> */}
      </div>
    </div>
  );
}

type SidebarItemProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

function SidebarItem({ label, active, onClick }: SidebarItemProps) {
  return (
    <li
      onClick={onClick}
      className={`px-3 py-2 rounded-md cursor-pointer truncate ${active
        ? 'bg-gray-200 text-black'
        : 'hover:bg-gray-100 hover:text-black text-gray-700'
        }`}
    >
      {label}
    </li>
  );
}
