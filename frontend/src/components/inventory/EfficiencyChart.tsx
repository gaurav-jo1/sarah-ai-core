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
import type { InventoryItem } from '../../types/inventory.types';

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
  categoryColors: Record<string, { background: string; border: string }>;
}

export const EfficiencyChart: React.FC<EfficiencyChartProps> = ({ data, categoryColors }) => {
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

  const backgroundColors = labels.map(label => categoryColors[label]?.background || 'rgba(200, 200, 200, 0.7)');
  const borderColors = labels.map(label => categoryColors[label]?.border || 'rgba(200, 200, 200, 1)');

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Sell-Through Rate (%)',
        data: efficiencyRates,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'x' as const,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            max: 100, // Percentage
            title: {
                display: true,
                text: 'Sell-Through Rate (%)'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Category'
            }
        }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Stock Efficiency by Category',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
