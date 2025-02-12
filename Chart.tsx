import React, { useEffect, useState } from 'react';
import { getPercentDash } from '../../api/analytics';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface RowData {
  projectName: string;
  members: string[];
}

interface MemberData {
  name: string;
  projects: { [key: string]: number };
  totalProjects: number;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, totalProjects, projects } = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-800 mb-2">{name}</p>
        <p className="text-sm text-gray-600">Total Projects: {totalProjects}</p>
        <ul className="mt-2 space-y-1">
          {Object.entries(projects).map(([project, count], index) => (
            <li key={index} className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {project}: {count}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

const ProjectVisualization: React.FC = () => {
  const [membersData, setMembersData] = useState<MemberData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPercentDash();
        const membersMap: { [key: string]: MemberData } = {};

        data.forEach((row: RowData) => {
          row.members.forEach((member: string) => {
            const memberName = member.split('@')[0];
            if (!membersMap[memberName]) {
              membersMap[memberName] = { name: memberName, projects: {}, totalProjects: 0 };
            }
            membersMap[memberName].projects[row.projectName] = (membersMap[memberName].projects[row.projectName] || 0) + 1;
            membersMap[memberName].totalProjects += 1;
          });
        });

        setMembersData(Object.values(membersMap).sort((a, b) => b.totalProjects - a.totalProjects));
      } catch (error) {
        setError('Error fetching project data.');
        console.error('Error fetching project data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {error ? (
        <div className="text-red-500 text-center mt-4">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={membersData}
              dataKey="totalProjects"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150} // Reduced outer radius
              innerRadius={80} // Reduced inner radius
              labelLine={false}
            >
              {membersData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProjectVisualization;
