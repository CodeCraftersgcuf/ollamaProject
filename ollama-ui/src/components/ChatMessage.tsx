import { FiCornerUpLeft } from 'react-icons/fi';

type Props = {
  message: {
    role: 'user' | 'assistant' | 'pending';
    content: string;
  };
  onReply?: (content: string) => void;
};

export default function ChatMessage({ message, onReply }: Props) {
  const isUser = message.role === 'user' || message.role === 'pending';
  const isTypingPlaceholder = message.content === '___typing___';

  // Detect if message looks like it contains code (simple version)
  const content = message?.content ?? '';
  const isCodeBlock = content.trim().startsWith("```") && content.trim().endsWith("```");


  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl px-4 py-3 rounded-lg text-black ${isUser ? 'bg-gray-100' : 'bg-gray-200'} relative`}>
        {/* Typing animation */}
        {isTypingPlaceholder ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
          </div>
        ) : isCodeBlock ? (
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono text-black">
            {content.replace(/^```|```$/g, '')}
          </pre>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}

        {/* Reply button for assistant messages */}
        {!isUser && onReply && !isTypingPlaceholder && (
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
            title="Reply"
            onClick={() => onReply(content)}
          >
            <FiCornerUpLeft size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
