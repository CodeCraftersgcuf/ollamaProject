import { useState } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Modal component for API key creation
function CreateApiKeyModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
    setTouched(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm p-6 relative">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Create new API key
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className={`w-full border rounded-lg px-3 py-2 mb-4 outline-none text-black ${
              !name && touched
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
            placeholder="Name of the API key"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            autoFocus
          />
          {!name && touched && (
            <div className="text-xs text-red-500 mb-2">
              Please enter a name for the API key.
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500"
              disabled={!name.trim()}
            >
              Create API key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ApiKeyGenerationPage() {
  const [apiKeys, setApiKeys] = useState<{ name: string; key: string }[]>(
    () => {
      // Load from localStorage on mount
      const stored = localStorage.getItem("apiKeys");
      return stored ? JSON.parse(stored) : [];
    }
  );
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Save to localStorage whenever apiKeys changes
  function saveApiKeys(keys: { name: string; key: string }[]) {
    setApiKeys(keys);
    localStorage.setItem("apiKeys", JSON.stringify(keys));
  }

  const handleCreateApiKey = (name: string) => {
    const newKey = "sk-" + Math.random().toString(36).slice(2, 18);
    const updated = [...apiKeys, { name, key: newKey }];
    saveApiKeys(updated);
  };

  const handleDeleteApiKey = (idx: number) => {
    const updated = apiKeys.filter((_, i) => i !== idx);
    saveApiKeys(updated);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-10">
      <CreateApiKeyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateApiKey}
      />
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">API keys</h1>
        <p className="text-gray-700 text-sm mb-6">
          <span className="block mt-2 text-gray-600">
            <strong>Note:</strong> This application is designed to work with Ollama installed locally on your machine. Please ensure you have Ollama running to enable all AI features and API key management.
          </span>
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Key</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold">Last used</th>
                <th className="py-3 px-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-4 text-center text-gray-500 text-sm"
                  >
                    No API key, you can{" "}
                    <span className="font-medium text-black">
                      Create new API key.
                    </span>
                  </td>
                </tr>
              ) : (
                apiKeys.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-700">
                      {item.key}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400">-</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        title="Delete API Key"
                        onClick={() => handleDeleteApiKey(idx)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full bg-black hover:bg-gray-900 text-white font-semibold shadow transition"
        >
          <FiPlus /> Create new API key
        </button>
      </div>
    </div>
  );
}
