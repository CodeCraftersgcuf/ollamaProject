type Props = {
  message: {
    role: 'user' | 'assistant' | 'pending';
    content: string;
  };
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user' || message.role === 'pending';

  const isTypingPlaceholder = message.content === '___typing___';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl px-4 py-2 rounded-lg ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'
        }`}
      >
        {isTypingPlaceholder ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
