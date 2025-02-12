import React from 'react';

interface DashboardCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
  >
    <img src={icon} alt={`${title} Icon`} className="h-12 w-12" />
    <div className="ml-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default DashboardCard;