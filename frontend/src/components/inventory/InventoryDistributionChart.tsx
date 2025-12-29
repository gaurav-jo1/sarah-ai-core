import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { InventoryItem } from '../../types/inventory.types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface InventoryDistributionChartProps {
  data: InventoryItem[];
  categoryColors: Record<string, { background: string; border: string }>;
}

export const InventoryDistributionChart: React.FC<InventoryDistributionChartProps> = ({ data, categoryColors }) => {
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
  const total = values.reduce((acc, val) => acc + val, 0);

  // Map colors based on category names from props
  const backgroundColors = labels.map(label => categoryColors[label]?.background || 'rgba(200, 200, 200, 0.7)');
  const borderColors = labels.map(label => categoryColors[label]?.border || 'rgba(200, 200, 200, 1)');

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Inventory Value ($)',
        data: values, // Value in Dollars
        backgroundColor: backgroundColors,
        borderColor: borderColors,
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
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
        formatter: (value: number) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} plugins={[ChartDataLabels]} />;
};
