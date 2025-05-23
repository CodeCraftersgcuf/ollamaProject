import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useMutation } from '@tanstack/react-query';
import {
  sendChatMessage,
  detectIntent,
  uploadFile,
  processFile,
  translateFile
} from '../utils/mutation';
import { getToken } from '../utils/getToken';
import { getChatHistory } from '../utils/query'; // ✅ import

type Message = {
  role: 'user' | 'assistant' | 'pending';
  content: string;
};

type Props = {
  selectedChat: string | null;
  readOnly?: boolean;
};

export default function ChatArea({ selectedChat, readOnly }: Props) {
  const [chatMap, setChatMap] = useState<Record<string, Message>>({});
  const [inputDisabled, setInputDisabled] = useState(false);
  const [replyPrefill, setReplyPrefill] = useState<string | undefined>(undefined);
  const token = getToken();
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleAuthError = (err: any) => {
    if (
      err?.message === "No token found!" ||
      err?.response?.data?.detail === "Invalid token"
    ) {
      console.warn("⚠️ Token missing or invalid, redirecting to login...");
      navigate('/login');
      return true;
    }
    return false;
  };

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!token) throw new Error("No token found!");
      return await sendChatMessage({ message, token });
    },
    onSuccess: (data, variables) => {
      setInputDisabled(false);
      if (!selectedChat) return;

      setChatMap(prev => {
        const updated = (prev[selectedChat] || []).map(msg =>
          msg.role === 'pending' ? { role: 'user', content: variables.message } : msg
        ).map(msg =>
          msg.content === '___typing___' ? { role: 'assistant', content: data } : msg
        );

        return { ...prev, [selectedChat]: updated };
      });
    },
    onError: err => {
      console.error("❌ Message error:", err);
      setInputDisabled(false);
      if (handleAuthError(err)) return;

      if (!selectedChat) return;
      setChatMap(prev => {
        const updated = (prev[selectedChat] || []).map(msg =>
          msg.content === '___typing___'
            ? { role: 'assistant', content: "⚠️ Server error. Try again." }
            : msg
        );
        return { ...prev, [selectedChat]: updated };
      });
    }
  });

  const { mutate: detectAndUpload } = useMutation({
    mutationFn: async ({ message, file }: { message: string, file: File }) => {
      if (!token) throw new Error("No token found!");
      const formData = new FormData();
      formData.append('file', file);
      const uploadResult = await uploadFile({ data: formData, token });

      const fileFormData = new FormData();
      fileFormData.append('filename', uploadResult.filename);

      if (!message.trim()) return await processFile({ data: fileFormData, token });

      const fixedPrompt = `You must classify the following sentence strictly as either "summarize" or "translate". No other output allowed.\n\nSentence:\n"${message}"`;
      const intent = await detectIntent({ message: fixedPrompt, token });
      return intent === 'translate'
        ? await translateFile({ data: fileFormData, token })
        : await processFile({ data: fileFormData, token });
    },
    onSuccess: (data, variables) => {
      setInputDisabled(false);
      if (!selectedChat) return;

      setChatMap(prev => {
        const updated = (prev[selectedChat] || []).map(msg =>
          msg.content === '___typing___'
            ? { role: 'assistant', content: data.summary || data.translation || "✅ Completed." }
            : msg
        );
        return { ...prev, [selectedChat]: updated };
      });
    },
    onError: err => {
      console.error("❌ File operation error:", err);
      setInputDisabled(false);
      if (handleAuthError(err)) return;

      if (!selectedChat) return;
      setChatMap(prev => {
        const updated = (prev[selectedChat] || []).map(msg =>
          msg.content === '___typing___'
            ? { role: 'assistant', content: "⚠️ Server error. Try again." }
            : msg
        );
        return { ...prev, [selectedChat]: updated };
      });
    }
  });

  const handleSend = (text: string, file?: File | null) => {
    if (!selectedChat) return;
    setInputDisabled(true);
    setReplyPrefill(undefined); // Clear prefill after send

    if (file) {
      setChatMap(prev => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []),
          { role: 'user', content: text || "(Attached File)" },
          { role: 'assistant', content: '___typing___' }
        ]
      }));
      detectAndUpload({ message: text, file });
    } else {
      setChatMap(prev => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []),
          { role: 'pending', content: text },
          { role: 'assistant', content: '___typing___' }
        ]
      }));
      sendMessage({ message: text });
    }
  };

  // ✅ Fetch chat history when selectedChat changes (except 'new-chat')
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token || !selectedChat || selectedChat === 'new-chat') return;
      try {
        const result = await getChatHistory(token, selectedChat);
        const messages: Message[] = result.map((item: any) => [
          { role: 'user', content: item.question },
          { role: 'assistant', content: item.answer }
        ]).flat();
        setChatMap(prev => ({ ...prev, [selectedChat]: messages }));
      } catch (err) {
        console.error("❌ Failed to fetch history:", err);
        if (handleAuthError(err)) return;
      }
    };

    fetchHistory();
  }, [selectedChat]);

  const messages = selectedChat ? chatMap[selectedChat] || [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

return (
  <div className="flex-1 flex flex-col h-screen bg-white">
    {/* Message Area */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4 px-24">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-black opacity-70">
          <h2 className="text-2xl font-medium">What can I help with?</h2>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              onReply={
                msg.role === 'assistant'
                  ? (content) =>
                      setReplyPrefill(`> ${content.replace(/\n/g, '\n> ')}\n\n`)
                  : undefined
              }
            />
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>

 {/* Input Bar */}
{!readOnly && (
  <div className="sticky bottom-0 z-10 w-full border-t border-gray-200 bg-white/80 backdrop-blur-md shadow-md">
    <div className="px-4 py-3 max-w-4xl mx-auto">
      <ChatInput onSend={handleSend} disabled={inputDisabled} prefill={replyPrefill} />
    </div>
  </div>
)}

  </div>
);

}
