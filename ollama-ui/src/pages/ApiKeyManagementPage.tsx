import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function ApiKeyManagementPage() {
  const [apiKeys, setApiKeys] = useState<
    { name: string; key: string; created: string; lastUsed: string | null }[]
  >([]);

  // Simulate API key creation
  const handleCreateApiKey = () => {
    const now = new Date();
    const newKey = {
      name: `Key ${apiKeys.length + 1}`,
      key: "sk-" + Math.random().toString(36).slice(2, 18),
      created: now.toLocaleString(),
      lastUsed: null,
    };
    setApiKeys((prev) => [...prev, newKey]);
  };

  const handleDeleteApiKey = (idx: number) => {
    setApiKeys((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-black font-bold">API keys</h1>
          <button
            onClick={handleCreateApiKey}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
          >
            <FiPlus /> Create new API key
          </button>
        </div>
        <p className="text-gray-700 text-sm mb-6">
       
          <span className="block mt-2 text-gray-600">
            <strong>Note:</strong> This application is designed to work with Ollama installed locally on your machine. Please ensure you have Ollama running to enable all AI features and API key management.
          </span>
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-500">Name</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-500">Key</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-500">Created</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-500">Last used</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400 text-sm">
                    No API key, you can <span className="text-green-700 font-medium">Create new API key.</span>
                  </td>
                </tr>
              ) : (
                apiKeys.map((key, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4">{key.name}</td>
                    <td className="py-2 px-4 font-mono text-xs text-gray-700">{key.key}</td>
                    <td className="py-2 px-4 text-xs">{key.created}</td>
                    <td className="py-2 px-4 text-xs">{key.lastUsed || "-"}</td>
                    <td className="py-2 px-4">
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Delete API Key"
                        onClick={() => handleDeleteApiKey(idx)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
