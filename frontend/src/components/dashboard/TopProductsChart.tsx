import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { CreditCard } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopProductsChartProps {
  topProducts: Record<string, number>;
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({
  topProducts,
}) => {
  const labels = Object.keys(topProducts);
  const dataPoints = Object.values(topProducts);

  const data = {
    labels,
    datasets: [
      {
        label: "Units Sold",
        data: dataPoints,
        backgroundColor: [
          "rgba(147, 51, 234, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(192, 132, 252, 0.7)",
          "rgba(216, 180, 254, 0.7)",
        ],
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        display: false,
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <CreditCard className="w-24 h-24 text-purple-600 transform rotate-6" />
      </div>
      <div className="flex items-center mb-4 z-10">
        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-500">Top Products</h3>
      </div>

      <div className="grow min-h-[150px] relative z-10 bg-transparent">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
