import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { InventoryItem } from '../types/inventory.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EfficiencyChartProps {
  data: InventoryItem[];
}

export const EfficiencyChart: React.FC<EfficiencyChartProps> = ({ data }) => {
  // 1. Group by Category and Calculate Sell-Through Rate
  // Sell-Through Rate = (Units Sold / (Opening Stock + Stock Received)) * 100

  const categoryStats: Record<string, { sold: number; totalStock: number }> = {};

  data.forEach((item) => {
    if (!categoryStats[item.Category]) {
      categoryStats[item.Category] = { sold: 0, totalStock: 0 };
    }
    categoryStats[item.Category].sold += item.Units_Sold;
    categoryStats[item.Category].totalStock += (item.Opening_Stock + item.Stock_Received);
  });

  const labels = Object.keys(categoryStats);
  const efficiencyRates = labels.map((cat) => {
    const { sold, totalStock } = categoryStats[cat];
    return totalStock > 0 ? (sold / totalStock) * 100 : 0;
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Sell-Through Rate (%)',
        data: efficiencyRates,
        backgroundColor: 'rgba(99, 102, 241, 0.6)', // Indigo-500 equivalent
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
        x: {
            beginAtZero: true,
            max: 100, // Percentage
            title: {
                display: true,
                text: 'Sell-Through Rate (%)'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Category'
            }
        }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Efficiency by Category',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
