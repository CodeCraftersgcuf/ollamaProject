import { useState, useRef, useEffect } from 'react';
import { FiSend, FiPlus, FiX } from 'react-icons/fi';

type Props = {
  onSend: (message: string, file?: File | null) => void;
  disabled?: boolean;
  prefill?: string;
};

export default function ChatInput({ onSend, disabled, prefill }: Props) {
  const [input, setInput] = useState(prefill || '');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill !== undefined) setInput(prefill);
  }, [prefill]);

  // Auto-grow textarea height on input change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Grow
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    onSend(input.trim(), file);

    setInput('');
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-2 w-full">
      {file && (
        <div className="relative w-48 h-16 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-black text-sm">
          {file.name}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-1 right-1 text-black hover:text-red-500"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <div className="flex w-full max-w-3xl items-end bg-gray-50 border border-gray-300 rounded-2xl px-4 py-2">
        <button
          type="button"
          onClick={handleFileClick}
          className="text-gray-400 hover:text-black pt-2"
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

        <textarea
          ref={textareaRef}
          placeholder="Ask anything"
          disabled={disabled}
          className="flex-1 bg-transparent text-black px-4 focus:outline-none resize-none max-h-40 overflow-y-auto placeholder:text-gray-400 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          type="submit"
          className="text-gray-400 hover:text-black pt-2"
          disabled={disabled}
        >
          <FiSend size={20} />
        </button>
      </div>
    </form>
  );
}
