import React, { useEffect, useState } from 'react';
import { Project } from '../ProjectInterface';
import { getProjects } from '../../api/projects'; 
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384', '#36A2EB', '#FFCE56'];

const ResourcesByProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Prepare data for Recharts
  const resourceProjects: { [key: string]: string[] } = {};

  projects.forEach(({ resources, projectName }) => {
    resources.forEach(resource => {
      if (!resourceProjects[resource]) {
        resourceProjects[resource] = [];
      }
      resourceProjects[resource].push(projectName);
    });
  });

  const data = Object.keys(resourceProjects).map((resource, index) => ({
    name: resource,
    value: resourceProjects[resource].length,
    projects: resourceProjects[resource].join(', '),
  }));

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto" style={{ height: 370 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({ name }) => name}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={({ payload }) => {
              if (payload && payload.length) {
                const { name, projects } = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <strong>{name}</strong>
                    <p>Projects: {projects}</p>
                  </div>
                );
              }
              return null;
            }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResourcesByProject;
