import React, { useContext } from 'react';
import { useStatusContext } from '../StatusContext';

const ProjectStatusDropdown: React.FC<{ editedProject: any, handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ editedProject, handleInputChange }) => {
  const { statuses, loading, error } = useStatusContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <label htmlFor="projectStatus" className="block text-lg font-medium text-gray-700 mb-2">
        Project Status
      </label>
      <select
        id="projectStatus"
        name="projectStatus"
        value={editedProject!.projectStatus}
        onChange={handleInputChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-lg border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
      >
        {statuses.map((status) => (
          <option key={status._id} value={status.projectStatus}>
            {status.projectStatus}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectStatusDropdown;