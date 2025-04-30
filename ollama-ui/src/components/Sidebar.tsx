import { useQuery } from '@tanstack/react-query';
import { getToken, getUserInfo } from '../utils/getToken';
import { listAdmins } from '../utils/mutation';

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
        } bg-[#111111] transition-all duration-300 overflow-hidden border-r border-[#2b2b2b] min-h-screen`}
    >
      <div className="h-full flex flex-col bg-[#111111]">
        <div className="p-4 border-b border-[#2b2b2b]">
          <h1 className="text-white font-bold text-lg">Chat Admins</h1>
        </div>

        <div className="flex-1 overflow-y-auto text-sm text-white px-2 py-4 space-y-3 bg-[#111111]">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 mb-4 text-left"
            onClick={() => onSelect('new-chat')}
          >
            + New Chat
          </button>

          <div className="flex items-center justify-between px-2 mb-1">
            <h2 className="text-xs uppercase text-gray-400">Admins</h2>
            <a
              href="http://localhost:5173/admin-management"
              className="text-[11px] text-blue-400 hover:underline"
            >
              Manage Them
            </a>
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

        <div className="text-xs text-gray-500 px-4 py-2 border-t border-[#2b2b2b]">
          © 2025 HMS Tech
        </div>
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
        ? 'bg-gray-700 text-white'
        : 'hover:bg-gray-800 hover:text-white text-gray-300'
        }`}
    >
      {label}
    </li>
  );
}
