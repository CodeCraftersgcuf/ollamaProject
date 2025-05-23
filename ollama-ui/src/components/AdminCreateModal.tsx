import { useRef, useState } from "react";

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
    onSubmit(e, imageFile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl text-black mb-4">Create New Subadmin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subadmin Name */}
          <input
            type="text"
            placeholder="Subadmin Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none"
          />
          {/* Subadmin Image */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Subadmin Image
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 hover:bg-gray-300 focus:outline-none"
                  tabIndex={-1}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">
                      Select
                      <br />
                      Image
                    </span>
                  )}
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full text-red-500 w-6 h-6 flex items-center justify-center shadow"
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
              {imagePreview && (
                <span className="text-xs text-gray-500">Image selected</span>
              )}
            </div>
          </div>
          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
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
