import { useRef, useState } from "react";
import { FiEye, FiEyeOff, FiPlus, FiTrash2, FiExternalLink } from "react-icons/fi";

type Props = {
  username: string;
  password: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent, imageFile?: File | null) => void;
  creating: boolean;
};

export default function AdminCreateModal({
  username,
  password,
  setUsername,
  setPassword,
  onCancel,
  onSubmit,
  creating,
}: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>(
    {}
  );
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!username || !password) return;
    onSubmit(e, imageFile);
  };

  // Simulate API key generation (replace with real API call as needed)
  const handleGenerateApiKey = () => {
    const newKey = "sk-" + Math.random().toString(36).slice(2, 18);
    setApiKeys((prev) => [...prev, newKey]);
  };

  const handleDeleteApiKey = (idx: number) => {
    setApiKeys((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-tight">
          Create New Subadmin
        </h2>
      
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <button
                type="button"
                onClick={handleImageClick}
                className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-green-500 focus:outline-none transition"
                tabIndex={-1}
                aria-label="Select image"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center">
                    Click to
                    <br />
                    add image
                  </span>
                )}
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full text-red-500 w-7 h-7 flex items-center justify-center shadow hover:bg-red-50"
                  title="Remove image"
                >
                  ×
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <span className="mt-2 text-xs text-gray-500">
              {imagePreview ? "Image selected" : "JPG, PNG, or GIF"}
            </span>
          </div>
          {/* Subadmin Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subadmin Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              className={`w-full p-2 rounded-lg bg-gray-50 text-black border ${
                !username && touched.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              } focus:outline-none focus:ring-2 transition`}
              autoFocus
            />
            {!username && touched.username && (
              <div className="text-red-500 text-xs mt-1">
                Please enter subadmin name.
              </div>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={`w-full p-2 rounded-lg bg-gray-50 text-black border ${
                  !password && touched.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                } focus:outline-none focus:ring-2 transition pr-10`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {!password && touched.password && (
              <div className="text-red-500 text-xs mt-1">Please enter password.</div>
            )}
          </div>
          {/* API Key Management */}
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
