import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add navigation hook
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useMutation } from '@tanstack/react-query';
import { sendChatMessage, detectIntent, uploadFile, processFile, translateFile } from '../utils/mutation';
import { getToken } from '../utils/getToken';

type Message = {
  role: 'user' | 'assistant' | 'pending';
  content: string;
};

type Props = {
  selectedChat: string | null;
};

export default function ChatArea({ selectedChat }: Props) {
  const [chatMap, setChatMap] = useState<Record<string, Message[]>>({});
  const [inputDisabled, setInputDisabled] = useState(false);
  const token = getToken();
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // ✅

  const handleAuthError = (err: any) => {
    if (err?.message === "No token found!" || err?.response?.data?.detail === "Invalid token") {
      console.warn("⚠️ Token missing or invalid, redirecting to login...");
      navigate('/login'); // ✅ Redirect
      return true;
    }
    return false;
  };

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!token) throw new Error("No token found!");
      const res = await sendChatMessage({ message, token });
      return res;
    },
    onSuccess: (data, variables) => {
      setInputDisabled(false);
      if (!selectedChat) return;
      setChatMap((prev) => {
        const prevMessages = prev[selectedChat] || [];
        const updated = prevMessages.map((msg) => {
          if (msg.role === 'pending') {
            return { role: 'user', content: variables.message };
          }
          return msg;
        });
        const final = updated.map((msg) => {
          if (msg.content === '___typing___') {
            return { role: 'assistant', content: data };
          }
          return msg;
        });
        return { ...prev, [selectedChat]: final };
      });
    },
    onError: (err: any) => {
      console.error("❌ Message error:", err);
      setInputDisabled(false);
      if (handleAuthError(err)) return; // ✅ Handle auth errors

      if (!selectedChat) return;
      setChatMap((prev) => {
        const prevMessages = prev[selectedChat] || [];
        const updated = prevMessages.map((msg) => {
          if (msg.content === '___typing___') {
            return { role: 'assistant', content: "⚠️ Server error. Try again." };
          }
          return msg;
        });
        return { ...prev, [selectedChat]: updated };
      });
    },
  });

  const { mutate: detectAndUpload } = useMutation({
    mutationFn: async ({ message, file }: { message: string, file: File }) => {
      if (!token) throw new Error("No token found!");
      const formData = new FormData();
      formData.append('file', file);

      const uploadResult = await uploadFile({ data: formData, token });

      const fileFormData = new FormData();
      fileFormData.append('filename', uploadResult.filename);

      if (!message.trim()) {
        return await processFile({ data: fileFormData, token });
      }

      const fixedPrompt = `You must classify the following sentence strictly as either "summarize" or "translate". No other output allowed.\n\nSentence:\n"${message}"`;
      const intent = await detectIntent({ message: fixedPrompt, token });
      console.log("✅ Detected intent:", intent);

      if (intent === 'translate') {
        return await translateFile({ data: fileFormData, token });
      } else {
        return await processFile({ data: fileFormData, token });
      }
    },
    onSuccess: (data, variables) => {
      setInputDisabled(false);
      if (!selectedChat) return;
      setChatMap((prev) => {
        const prevMessages = prev[selectedChat] || [];
        const updated = prevMessages.map((msg) => {
          if (msg.content === '___typing___') {
            return { role: 'assistant', content: data.summary || data.translation || "✅ Completed." };
          }
          return msg;
        });
        return { ...prev, [selectedChat]: updated };
      });
    },
    onError: (err: any) => {
      console.error("❌ File operation error:", err);
      setInputDisabled(false);
      if (handleAuthError(err)) return; // ✅ Handle auth errors

      if (!selectedChat) return;
      setChatMap((prev) => {
        const prevMessages = prev[selectedChat] || [];
        const updated = prevMessages.map((msg) => {
          if (msg.content === '___typing___') {
            return { role: 'assistant', content: "⚠️ Server error. Try again." };
          }
          return msg;
        });
        return { ...prev, [selectedChat]: updated };
      });
    },
  });

  const handleSend = (text: string, file?: File | null) => {
    if (!selectedChat) {
      console.warn("⚠️ No selected chat to send message.");
      return;
    }

    setInputDisabled(true);

    if (file) {
      setChatMap((prev) => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []),
          { role: 'user', content: text ? text : "(Attached File)" },
          { role: 'assistant', content: '___typing___' },
        ],
      }));

      detectAndUpload({ message: text, file });
    } else {
      setChatMap((prev) => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []),
          { role: 'pending', content: text },
          { role: 'assistant', content: '___typing___' },
        ],
      }));

      sendMessage({ message: text });
    }
  };

  const messages = selectedChat ? chatMap[selectedChat] || [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-[#212121]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 px-24">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white opacity-70">
            <h2 className="text-2xl font-medium">What can I help with?</h2>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="w-full bg-[#212121] border-t border-[#444654] sticky bottom-0 z-10">
        <div className="p-4">
          <ChatInput onSend={handleSend} disabled={inputDisabled} />
        </div>
      </div>
    </div>
  );
}
