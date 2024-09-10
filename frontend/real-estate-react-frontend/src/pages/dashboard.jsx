import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';  // Ensure all chart types are automatically registered

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);

  // Fetch chart data from the backend
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/visualize_query', {
          query: "Show sales by month for 2024"
        });

        const { labels, data, chartType } = response.data;
        setChartData({ labels, data, chartType });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  // Helper function to return the appropriate chart component
  const renderChart = () => {
    const chartConfig = {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Sales in 2024',
          data: chartData.data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };

    // Render chart dynamically based on chartType
    switch (chartData.chartType) {
      case 'bar':
        return <Bar data={chartConfig} />;
      case 'line':
        return <Line data={chartConfig} />;
      case 'pie':
        return <Pie data={chartConfig} />;
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div>
      <h2>Generated Chart</h2>
      {chartData ? renderChart() : <p>Loading chart...</p>}
    </div>
  );
};

export default Dashboard;

