import React, { memo } from 'react';
import { Select, MenuItem, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserTableProps {
  users: User[];
  onDelete: (user: User) => void;
  onStatusChange: (user: User) => void;
  onRoleChange: (user: User, newRole: string) => void;
}

const UserTable: React.FC<UserTableProps> = memo(({ users, onDelete, onStatusChange, onRoleChange }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user._id}>
            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Select
                value={user.role}
                onChange={(e) => onRoleChange(user, e.target.value as string)}
                className="w-full"
                aria-label={`Change role for ${user.name}`}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="member">Member</MenuItem>
              </Select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Switch
                checked={user.status === 'active'}
                onChange={() => onStatusChange(user)}
                color="primary"
                aria-label={`Change status for ${user.name}`}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => onDelete(user)}
                className="text-red-600 hover:text-red-900"
                aria-label={`Delete ${user.name}`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default UserTable;