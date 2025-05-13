import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: text },
      {
        role: 'assistant',
        content: "I'm LLaMA responding to your message: " + text,
      },
    ];
    setMessages(newMessages);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>
      <div className="border-t border-gray-700 p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
