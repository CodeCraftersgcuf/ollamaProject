type Props = {
    message: {
      role: 'user' | 'assistant';
      content: string;
    };
  };
  
  export default function ChatMessage({ message }: Props) {
    const isUser = message.role === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-xl px-4 py-2 rounded-lg ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'
          }`}
        >
          {message.content}
        </div>
      </div>
    );
  }
  