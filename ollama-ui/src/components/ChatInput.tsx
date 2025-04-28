import { useState, useRef } from 'react';
import { FiSend, FiPlus, FiX } from 'react-icons/fi';

type Props = {
  onSend: (message: string, file?: File | null) => void;
  disabled?: boolean; // ✅ Accept disabled prop
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    onSend(input.trim(), file); 

    setInput('');
    setFile(null);
  };

  const handleFileClick = () => {
    if (disabled) return; // ⬅️ prevent click when disabled
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-2">
      {file && (
        <div className="relative w-48 h-16 bg-[#212121] border border-[#565869] rounded-md flex items-center justify-center text-white text-sm">
          {file.name}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-1 right-1 text-white hover:text-red-500"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <div className="flex w-full max-w-3xl items-center bg-[#2f2f33] border border-[#565869] rounded-2xl px-4 py-3">
        <button
          type="button"
          onClick={handleFileClick}
          className="text-gray-400 hover:text-white"
          disabled={disabled}
        >
          <FiPlus size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          type="text"
          placeholder="Ask anything"
          disabled={disabled} // ✅ disable input if sending
          className="flex-1 bg-transparent text-white px-4 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          className="text-gray-400 hover:text-white"
          disabled={disabled} // ✅ disable send button if sending
        >
          <FiSend size={20} />
        </button>
      </div>
    </form>
  );
}
