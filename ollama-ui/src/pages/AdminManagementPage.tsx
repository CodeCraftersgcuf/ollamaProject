import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createAdmin, deleteAdmin, listAdmins, updateAdminPassword } from '../utils/mutation';
import { getToken } from '../utils/getToken';
import AdminSidebar from '../components/AdminSidebar';
import AdminCreateModal from '../components/AdminCreateModal';
import AdminEditModal from '../components/AdminEditModal';
import ChatHistorySection from '../components/ChatHistorySection';

export default function AdminManagementPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editUsername, setEditUsername] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

  const token = getToken();

  const { data: admins = [], refetch: refetchAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!token) throw new Error('No token found!');
      return await listAdmins(token);
    },
  });

  const { mutate: createAdminMutate, isPending: creating } = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('No token found!');
      return await createAdmin({ username, password, token });
    },
    onSuccess: () => {
      setUsername('');
      setPassword('');
      setShowCreateModal(false);
      refetchAdmins();
    },
  });

  const { mutate: deleteAdminMutate } = useMutation({
    mutationFn: async (usernameToDelete: string) => {
      if (!token) throw new Error('No token found!');
      return await deleteAdmin({ username: usernameToDelete, token });
    },
    onSuccess: () => {
      refetchAdmins();
    },
  });

  const { mutate: updatePasswordMutate, isPending: updatingPassword } = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('No token found!');
      return await updateAdminPassword({ username: editUsername!, password: editPassword, token });
    },
    onSuccess: () => {
      setEditUsername(null);
      setEditPassword('');
      setShowEditModal(false);
      refetchAdmins();
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    createAdminMutate();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPassword) return;
    updatePasswordMutate();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar
        admins={admins}
        onEdit={(adminUsername) => {
          setEditUsername(adminUsername);
          setShowEditModal(true);
        }}
        onDelete={(adminUsername) => deleteAdminMutate(adminUsername)}
        onSelect={(username) => setSelectedAdmin(username)} // ✅ THIS LINE IS MISSING
      />

      {/* Main Content */}
      <div className="flex-1 bg-[#212121] p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-white font-bold">Admin Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            + Create Admin
          </button>
        </div>

        {/* Chat History Section */}
        <div className="mt-10">
          <h2 className="text-2xl text-white mb-4">🧠 Recent Chat History</h2>

          <ChatHistorySection selectedAdmin={selectedAdmin} />

        </div>
      </div>


      {/* Modals */}
      {showCreateModal && (
        <AdminCreateModal
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          onCancel={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
          creating={creating}
        />
      )}

      {showEditModal && (
        <AdminEditModal
          username={editUsername}
          password={editPassword}
          setPassword={setEditPassword}
          onCancel={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          updating={updatingPassword}
        />
      )}
    </div>
  );
}
