type SidebarProps = {
    isOpen: boolean;
    selectedChat: string | null;
    onSelect: (label: string) => void;
  };
  
  export default function Sidebar({ isOpen, selectedChat, onSelect }: SidebarProps) {
    return (
      <div
        className={`${
          isOpen ? 'w-72' : 'w-0'
        } bg-[#111111] transition-all duration-300 overflow-hidden border-r border-[#2b2b2b] h-full`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-[#2b2b2b]">
            <h1 className="text-white font-bold text-lg">ChatGPT 4o</h1>
          </div>
  
          <div className="flex-1 overflow-y-auto text-sm text-white px-2 py-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div>
              <h2 className="text-xs uppercase text-gray-400 px-2 mb-1">Yesterday</h2>
              <ul className="space-y-1">
                {[
                  "Digital Marketing Job Post",
                  "Coordinates to Address Conve",
                  "Submit button loader implem",
                  "Center form styling",
                  "Blade section issue",
                  "AI Proposal Generation Panel",
                  "Genetic Algorithm Application",
                  "Create Excel Table VBA",
                ].map(label => (
                  <SidebarItem
                    key={label}
                    label={label}
                    active={selectedChat === label}
                    onClick={() => onSelect(label)}
                  />
                ))}
              </ul>
            </div>
  
            <div>
              <h2 className="text-xs uppercase text-gray-400 px-2 mt-4 mb-1">Previous 7 Days</h2>
              <ul className="space-y-1">
                {[
                  "WooCommerce Store Proposal",
                  "Generate Windows Info Script",
                  "PM2 Log Commands",
                  "Convert React to HTML",
                  "Nmap Host Down Fix",
                  "Check Composer Installation",
                ].map(label => (
                  <SidebarItem
                    key={label}
                    label={label}
                    active={selectedChat === label}
                    onClick={() => onSelect(label)}
                  />
                ))}
              </ul>
            </div>
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
        className={`px-3 py-2 rounded-md cursor-pointer truncate ${
          active
            ? 'bg-gray-700 text-white'
            : 'hover:bg-gray-800 hover:text-white text-gray-300'
        }`}
      >
        {label}
      </li>
    );
  }
  