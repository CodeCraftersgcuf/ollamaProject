import { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '../utils/mutation';
import { getToken } from '../utils/getToken';

type Message = {
  role: 'user' | 'assistant' | 'pending'; // pending used internally
  content: string;
};

type Props = {
  selectedChat: string | null;
};

export default function ChatArea({ selectedChat }: Props) {
  const [chatMap, setChatMap] = useState<Record<string, Message[]>>({});
  const token = getToken(); // 👈 Grab token from localStorage

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      console.log("📤 Sending message to API:", message);
      if (!token) throw new Error("No token found!");
      const res = await sendChatMessage({ message, token });
      console.log("✅ API Response:", res);
      return res; // res is string
    },
    onSuccess: (data, variables) => {
      console.log("✅ Mutation success:", data, variables);

      if (!selectedChat) return;

      setChatMap((prev) => {
        const prevMessages = prev[selectedChat] || [];

        const updatedMessages = prevMessages.map((msg) => {
          if (msg.role === 'pending') {
            return { role: 'user', content: variables.message };
          }
          return msg;
        });

        // Now replace "thinking..." assistant message
        const finalMessages = updatedMessages.map((msg) => {
          if (msg.content === '___typing___') {
            return { role: 'assistant', content: data };
          }
          return msg;
        });

        return {
          ...prev,
          [selectedChat]: finalMessages,
        };
      });
    },
    onError: (err: any) => {
      console.error("❌ Mutation error:", err);
    },
  });

  const handleSend = (text: string) => {
    if (!selectedChat) {
      console.warn("⚠️ No selected chat to send message.");
      return;
    }

    console.log("🛜 User sending:", text);

    // Optimistically show user's pending message
    setChatMap((prev) => ({
      ...prev,
      [selectedChat]: [
        ...(prev[selectedChat] || []),
        { role: 'pending', content: text },
        { role: 'assistant', content: '___typing___' }, // 🔥 Typing placeholder
      ],
    }));

    // Now actually send to API
    sendMessage({ message: text });
  };

  const messages = selectedChat ? chatMap[selectedChat] || [] : [];

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-70">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
              alt="Chat Logo"
              className="w-12 h-12 mb-4"
            />
            <h2 className="text-xl font-medium">
              {selectedChat ? 'Start chatting in: ' + selectedChat : 'How can I help you today?'}
            </h2>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#2d2d2d] p-4 bg-black">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
