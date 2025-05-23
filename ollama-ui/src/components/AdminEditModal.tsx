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
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-xl text-black mb-4">Update Password for {username}</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
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
