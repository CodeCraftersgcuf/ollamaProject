type Props = {
  admins: any[];
  onEdit: (username: string) => void;
  onDelete: (username: string) => void;
  onSelect: (username: string) => void;
};

export default function AdminSidebar({ admins, onEdit, onDelete, onSelect }: Props) {
  const handleDelete = (username: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete admin "${username}"?`);
    if (confirmed) {
      onDelete(username);
    }
  };

  return (
    <div className="w-72 bg-white text-black p-6 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center border-b border-gray-300 pb-2">Admins</h2>

      <ul className="space-y-3">
        {admins.length > 0 ? (
          admins.map((admin) => (
            <li
              key={admin._id}
              className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-3 py-2"
            >
              <span
                onClick={() => onSelect(admin.username)}
                className="cursor-pointer hover:text-blue-600 font-medium"
              >
                {admin.username}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(admin.username)}
                  className="text-sm text-yellow-600 hover:text-yellow-500 transition"
                  title="Edit admin"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(admin.username)}
                  className="text-sm text-red-600 hover:text-red-500 transition"
                  title="Delete admin"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm text-center mt-4">No admins found</li>
        )}
      </ul>
    </div>
  );
}
