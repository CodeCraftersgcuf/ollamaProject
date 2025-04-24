import { useState, useRef } from 'react';
import { FiMic, FiSend, FiPlus, FiX } from 'react-icons/fi';

type Props = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    onSend(input.trim());
    setInput('');
    setFile(null);
    setUploadProgress(null);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(null); // Reset after simulated upload
      }
    }, 200);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(null);
    fileInputRef.current!.value = ''; // reset input
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 pb-4 flex justify-center flex-col items-center gap-2">
      {/* File Preview */}
      {file && (
        <div className="relative w-32 h-24 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg overflow-hidden">
          <div className="absolute top-0 right-0 z-10">
            <button
              onClick={handleRemoveFile}
              className="bg-gray-800 rounded-full text-white text-xs p-1 hover:bg-red-600"
            >
              <FiX />
            </button>
          </div>
          <div className="w-full h-full flex items-center justify-center text-sm text-white p-2 text-center">
            {file.name}
          </div>
          {uploadProgress !== null && (
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
          )}
        </div>
      )}

      {/* Chat Input */}
      <div className="w-full max-w-4xl flex items-center rounded-2xl bg-[#2a2a2a] border border-[#3a3a3a] px-3 py-2 gap-2 shadow-sm">
        {/* Left Icons */}
        <div className="flex items-center gap-2 text-gray-400">
          <button type="button" className="hover:text-white" onClick={handleFileClick}>
            <FiPlus />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Input */}
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-400 outline-none"
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Right Icons */}
        <div className="flex items-center gap-2 text-gray-400">
          <button type="submit" className="hover:text-white">
            <FiSend />
          </button>
        </div>
      </div>
    </form>
  );
}
