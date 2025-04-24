import { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  selectedChat: string | null;
};

export default function ChatArea({ selectedChat }: Props) {
  // Stores all messages by chat name
  const [chatMap, setChatMap] = useState<Record<string, Message[]>>({});

  const handleSend = (text: string) => {
    if (!selectedChat) return;

    const prevMessages = chatMap[selectedChat] || [];
    const newMessages = [
      ...prevMessages,
      { role: 'user', content: text },
      { role: 'assistant', content: "Hey! I'm doing great, thanks for asking — how about you? 😊" },
    ];

    setChatMap({
      ...chatMap,
      [selectedChat]: newMessages,
    });
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
