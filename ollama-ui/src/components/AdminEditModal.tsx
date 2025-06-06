type Props = {
    username: string | null;
    password: string;
    setPassword: (value: string) => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
    updating: boolean;
  };
  
  export default function AdminEditModal({
    username,
    password,
    setPassword,
    onCancel,
    onSubmit,
    updating,
  }: Props) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-tight">
            Update Password for <span className="text-green-700">{username}</span>
          </h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                autoFocus
              />
            </div>
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
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
