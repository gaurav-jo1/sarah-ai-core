import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { InventoryItem } from '../types/inventory.types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface InventoryDistributionChartProps {
  data: InventoryItem[];
}

export const InventoryDistributionChart: React.FC<InventoryDistributionChartProps> = ({ data }) => {
  const categoryValues: Record<string, number> = {};

  data.forEach((item) => {
    const value = item.Stock_On_Hand * item.Cost_Per_Unit;
    if (categoryValues[item.Category]) {
      categoryValues[item.Category] += value;
    } else {
      categoryValues[item.Category] = value;
    }
  });

  const labels = Object.keys(categoryValues);
  const values = Object.values(categoryValues);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Inventory Value ($)',
        data: values, // Value in Dollars
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Inventory Value by Category',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};
