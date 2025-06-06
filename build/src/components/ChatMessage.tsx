type Props = {
  message: {
    role: 'user' | 'assistant' | 'pending';
    content: string;
  };
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user' || message.role === 'pending';
  const isTypingPlaceholder = message.content === '___typing___';

  // Detect if message looks like it contains code (simple version)
  const content = message?.content ?? '';
  const isCodeBlock = content.trim().startsWith("```") && content.trim().endsWith("```");


  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl px-4 py-3 rounded-lg text-white ${isUser ? 'bg-[#303030]' : 'bg-[#303030]'}`}>
        {/* Typing animation */}
        {isTypingPlaceholder ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
          </div>
        ) : isCodeBlock ? (
          <pre className="bg-[#2e2e2e] p-4 rounded-md overflow-x-auto text-sm font-mono">
            {content.replace(/^```|```$/g, '')}
          </pre>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}

      </div>
    </div>
  );
}
