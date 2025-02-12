import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, Member } from '../ProjectInterface';
import { getProjectById, formatDate, updateProject, getMembers } from '../../api/projects';
import ProjectStatusDropdown from './ProjectStatusDropdown';
import { motion } from 'framer-motion';

interface ProjectDetailsProps {
  userRole: string; 
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ userRole }) => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [readmeContent, setReadmeContent] = useState<string>(''); 
  const [isReadmeVisible, setIsReadmeVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectById(id);
        setProject(projectData);
        setEditedProject(projectData);
        
        const membersData = await getMembers();
        setAllMembers(membersData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
  
    fetchData()
  }, [id]);

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject(project);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setReadmeContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const projectToUpdate = {
        ...editedProject!,
        members: editedProject!.members.map((m) => m._id),
        readmeFile: readmeContent
      };

      const updatedProject = await updateProject(id!, projectToUpdate);
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update project:', err);
      setError('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({ ...prev!, [name]: name === 'progressPercent' ? parseInt(value) : value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Project) => {
    const { value } = e.target;
    setEditedProject(prev => ({ ...prev!, [field]: value.split(',').map(item => item.trim()) }));
  };

  const handleRemoveMember = (index: number) => {
    setEditedProject(prev => ({
      ...prev!,
      members: prev!.members.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = e.target.value;
    const memberToAdd = allMembers.find(m => m._id === memberId);
    if (memberToAdd) {
      setEditedProject(prev => ({
        ...prev!,
        members: [...prev!.members, memberToAdd]
      }));
    }
  };

  const handleViewReadme = async () => {
    if (project?.readmeFile) {
      try {
        const fetchedReadmeContent = project.readmeFile; 
        setReadmeContent(fetchedReadmeContent);
        setIsReadmeVisible(true);
      } catch (error) {
        console.error('Error fetching the README file:', error);
        setError('Failed to fetch README content.');
      }
    } else {
      setError('No README file available for this project.');
    }
  };

  const handleCloseReadme = () => {
    setIsReadmeVisible(false);
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center text-2xl text-gray-600">Project not found</div>;
  }

  return (
    <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-indigo-900"
      >
        {isEditing ? 'Edit Project' : project.projectName}
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow-xl rounded-lg overflow-hidden"
      >
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-8 space-y-8">

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="projectName" className="block text-lg font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  id="projectName"
                  value={editedProject!.projectName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="projectManager" className="block text-lg font-medium text-gray-700 mb-2">
                  Project Manager
                </label>
                <input
                  type="text"
                  name="projectManager"
                  id="projectManager"
                  value={editedProject!.projectManager}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={editedProject!.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="gitHubLinks" className="block text-lg font-medium text-gray-700 mb-2">
                  GitHub Link
                </label>
                <input
                  type="text"
                  name="gitHubLinks"
                  id="gitHubLinks"
                  value={editedProject!.gitHubLinks}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="technology" className="block text-lg font-medium text-gray-700 mb-2">
                  Technology (comma-separated)
                </label>
                <input
                  type="text"
                  name="technology"
                  id="technology"
                  value={editedProject!.technology.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'technology')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="resources" className="block text-lg font-medium text-gray-700 mb-2">
                  Resources (comma-separated)
                </label>
                <input
                  type="text"
                  name="resources"
                  id="resources"
                  value={editedProject!.resources.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'resources')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-lg font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={editedProject!.startDate ? editedProject!.startDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <ProjectStatusDropdown editedProject={editedProject} handleInputChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="progressPercent" className="block text-lg font-medium text-gray-700 mb-2">
                  Progress Percentage
                </label>
                <input
                  type="number"
                  name="progressPercent"
                  id="progressPercent"
                  value={editedProject!.progressPercent}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="completionDate" className="block text-lg font-medium text-gray-700 mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  name="completionDate"
                  id="completionDate"
                  value={editedProject!.completionDate ? editedProject!.completionDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="members" className="block text-lg font-medium text-gray-700 mb-3">
                Members
              </label>
              <div className="mt-2 space-y-3 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-md">
                {editedProject!.members.map((member, index) => (
                  <div key={member._id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                    <span className="text-base text-gray-700">{member.name} ({member.email}) ({member.title})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-red-600 hover:text-red-800 text-base font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <select
                onChange={handleAddMember}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Add a member</option>
                {allMembers
                  .filter(member => !editedProject!.members.some(m => m._id === member._id))
                  .map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
              </select>
            </div>

            <div>
            <label htmlFor="readmeFile" className="block text-lg font-medium text-gray-700 mb-2">
              Upload README File (Markdown)
            </label>
            <input
              type="file"
              accept=".md"
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="px-8 py-10">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-lg font-semibold text-gray-900 mb-2">Description</dt>
                <dd className="mt-1 text-base text-gray-700 bg-gray-50 p-4 rounded-lg shadow-inner">{project.description}</dd>
                <dd className="mt-6 font-semibold text-base text-gray-900">README Instructions</dd>
                <button
                  onClick={handleViewReadme}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  View README
                </button>
                {isReadmeVisible && readmeContent && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">README Content</h3>
                    <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">{readmeContent}</pre>
                    <button
                      onClick={handleCloseReadme}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                      Close README
                    </button>
                  </motion.div>
                )}
              </div>
              
              {/* Project details */}
              <DetailItem title="Project Manager" content={project.projectManager} />
              <DetailItem 
                title="GitHub Link" 
                content={
                  <a href={project.gitHubLinks} className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out" target="_blank" rel="noopener noreferrer">
                    {project.gitHubLinks}
                  </a>
                } 
              />
              <DetailItem 
                title="Technology" 
                content={
                  <div className="flex flex-wrap gap-2">
                    {project.technology.map((tech, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                } 
              />
              <DetailItem 
                title="Resources" 
                content={
                  <div className="flex flex-wrap gap-2">
                    {project.resources.map((resource, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {resource}
                      </span>
                    ))}
                  </div>
                } 
              />
              <DetailItem title="Start Date" content={formatDate(project.startDate) || 'N/A'} />
              <DetailItem 
                title="Members" 
                content={
                  <div className="flex flex-wrap gap-3">
                    {project.members.map((member) => (
                      <span key={member._id} className="inline-flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 transition duration-150 ease-in-out hover:bg-gray-200">
                        <span>{member.name}</span>
                        <span className="text-xs text-gray-600">{member.email}</span>
                        <span className="text-xs text-gray-600">{member.title}</span>
                      </span>
                    ))}
                  </div>
                } 
              />
              <DetailItem 
                title="Status" 
                content={
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    project.projectStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.projectStatus === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                    project.projectStatus === 'At Risk' ? 'bg-orange-100 text-orange-800' :
                    project.projectStatus === 'Awaiting Deletion' ? 'bg-red-100 text-red-800' :
                    project.projectStatus === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.projectStatus}
                  </span>
                } 
              />
              <div>
                <dt className="text-lg font-semibold text-gray-900 mb-2">Progress</dt>
                <dd className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${project.progressPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-base text-gray-700 mt-2">{project.progressPercent}%</span>
                </dd>
              </div>
              <DetailItem title="Completion Date" content={formatDate(project.completionDate) || 'N/A'} />
            </dl>
            <div className="mt-8 text-center">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Edit Project
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  </div>
);
}

const DetailItem: React.FC<{ title: string; content: React.ReactNode }> = ({ title, content }) => (
<div>
  <dt className="text-lg font-semibold text-gray-900 mb-2">{title}</dt>
  <dd className="mt-1 text-base text-gray-700">{content}</dd>
</div>
);

export default ProjectDetails;