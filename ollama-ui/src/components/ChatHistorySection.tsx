import { useQuery } from '@tanstack/react-query';
import { getChatHistory, getUserFiles } from '../utils/query';
import { getToken } from '../utils/getToken';
import ChatMessage from './ChatMessage';

type Props = {
  selectedAdmin: string | null;
};

export default function ChatHistorySection({ selectedAdmin }: Props) {
  const token = getToken();

  const { data: chats = [], isLoading, error } = useQuery({
    queryKey: ['chatHistory', selectedAdmin],
    queryFn: async () => {
      if (!token) throw new Error('No token found!');
      if (!selectedAdmin) return [];
      return await getChatHistory(token, selectedAdmin);
    },
    enabled: !!selectedAdmin,
  });

  const {
    data: files = [],
    isLoading: loadingFiles,
    error: fileError,
  } = useQuery({
    queryKey: ['userFiles', selectedAdmin],
    queryFn: async () => {
      if (!token) throw new Error('No token found!');
      if (!selectedAdmin) return [];
      return await getUserFiles(token, selectedAdmin); // ✅ Fixed: Pass selectedAdmin to API
    },
    enabled: !!selectedAdmin,
  });

  if (!selectedAdmin) {
    return <p className="text-gray-400">Select an admin to view their chat and file history.</p>;
  }

  if (isLoading || loadingFiles) {
    return <p className="text-gray-400">Loading data...</p>;
  }

  if (error || fileError) {
    return <p className="text-red-500">Failed to load data.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Uploaded Files Section */}
      <div>
        <h3 className="text-black text-lg font-bold mb-2">📂 Uploaded Files</h3>
        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded by {selectedAdmin}.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            {files.map((file: any, index: number) => (
              <li key={index}>
                <span className="text-black">{file.filename}</span>
                <span className="text-gray-500 ml-2 text-xs">
                  (Uploaded: {new Date(file.uploaded_at).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat History Section */}
      <div>
        <h3 className="text-black text-lg font-bold mb-2">💬 Chat History</h3>
        {chats.length === 0 ? (
          <p className="text-gray-500">No chat history found for {selectedAdmin}.</p>
        ) : (
          chats.map((chat, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 space-y-2">
              <ChatMessage message={{ role: 'user', content: chat.question }} />
              <ChatMessage message={{ role: 'assistant', content: chat.answer }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
