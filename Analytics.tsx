import './Analytics.css';
import StickyHeadTable from './Table';
import BarGraph from './BarGraph';
import BasicPie from './PieChart';
import Chart from './Chart';
import ResourcesByProject from './ResourcesByProject';

export default function Analytics() {
  return (
    <div className="ml-64 p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100 border-b">
              Number of Projects Per Month
            </h2>
            <div className="p-4">
              <BarGraph />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100 border-b">
              Total Projects by Status
            </h2>
            <div className="p-4">
              <BasicPie />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100 border-b">
              Members and Assigned Projects
            </h2>
            <div className="p-4">
              <Chart />
            </div>
          </div>
  
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100 border-b">
              Resources Used
            </h2>
            <div className="p-4">
              <ResourcesByProject />
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100 border-b">
            Project Summaries
          </h2>
          <div className="p-4">
            <StickyHeadTable />
          </div>
        </div>
      </div>
    </div>
  );
}
