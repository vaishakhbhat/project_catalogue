import React, { useEffect, useState } from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { getMonthlyCompletion } from '../../api/analytics';

const xAxisData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const chartColors = ['#7AC555', '#FFA500', '#E4CCFD', '#76A5EA'];

const BarGraph: React.FC = () => {
  const [monthlyCompletions, setMonthlyCompletions] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMonthlyCompletion();
        setMonthlyCompletions(response.monthlyCompletions);
      } catch (error) {
        console.error("Error fetching monthly completions:", error);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <BarChart
        colors={chartColors}
        series={[{ data: monthlyCompletions }]}
        height={200}
        width={600}
        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
        margin={{ top: 10, bottom: 20, left: 30, right: 20 }}
      />
    </div>
  );
};

export default BarGraph;
