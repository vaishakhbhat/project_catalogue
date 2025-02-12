import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { getStatusCount } from '../../api/analytics';

interface ChartData {
  id: number;
  value: number;
  label: string;
}

const statusColors: { [key: string]: string } = {
  "Ongoing": "#34C759",
  "Completed": "#FF9500",
  "Delayed": "#AF52DE",
  "At Risk": "#007AFF",
  "Awaiting Deletion": "#FF0000",
};

const BasicPie: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatusCount();
        
        const statuses = ["At Risk", "Awaiting Deletion"];
        
        
        const transformedData = Object.keys(data).map((key, index) => ({
          id: index,
          value: data[key],
          label: key
        }));

        
        statuses.forEach(status => {
          if (!transformedData.some(item => item.label === status)) {
            transformedData.push({
              id: transformedData.length,
              value: 0,
              label: status
            });
          }
        });

        setChartData(transformedData);
        // Map colors based on the status
        setColors(transformedData.map(item => statusColors[item.label] || '#CCCCCC')); // Default to grey if status is not in color map
      } catch (error) {
        console.error("Error fetching status count:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <PieChart
      colors={colors}
      series={[{ data: chartData }]}
      width={500}
      height={200}
    />
  );
};

export default BasicPie;
