import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../ProjectInterface';
import { getProjects } from '../../api/projects';

const RejectedProjects: React.FC = () => {
  const [rejectedProjects, setRejectedProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejectedProjects = async () => {
      try {
        setLoading(true);
        const projectData = await getProjects();
        const rejected = projectData.filter(project => project.demoURL === 'Rejected');
        setRejectedProjects(rejected);
      } catch (err) {
        handleError('Failed to load rejected projects', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedProjects();
  }, []);

  const handleError = (message: string, err: any) => {
    console.error(message, err);
    setError(message);
  };

  const filteredProjects = rejectedProjects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 ml-64 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-red-900">Rejected Projects</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 mb-8 rounded text-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="mb-8">
          <input
            type="text"
            className="w-full p-4 text-xl text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
            placeholder="Search rejected projects by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-900 mx-auto"></div>
            <p className="mt-6 text-2xl text-gray-600">Loading rejected projects...</p>
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No rejected projects found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg text-lg">
                  <thead>
                    <tr className="bg-red-100 text-gray-700 text-left text-base leading-normal">
                      <th className="py-3 px-6 font-bold">Project Name</th>
                      <th className="py-3 px-6 font-bold">Status</th>
                      <th className="py-3 px-6 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {filteredProjects.map(project => (
                      <tr key={project._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out">
                        <td className="py-3 px-6">{project.projectName}</td>
                        <td className="py-3 px-6">
                          <span className="px-2 py-1 rounded text-sm font-bold bg-red-100 text-red-600">
                            {project.projectStatus}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <Link
                            to={`/description/${project._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out text-lg"
                          >
                            View Project
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RejectedProjects;