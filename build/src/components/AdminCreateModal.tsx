type Props = {
    username: string;
    password: string;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
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
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-[#2f2f33] p-8 rounded-lg w-96">
          <h2 className="text-xl text-white mb-4">Create New Admin</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-[#40414f] text-white border border-[#565869] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#40414f] text-white border border-[#565869] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  