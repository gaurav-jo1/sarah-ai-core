import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface RevenueChartProps {
  monthlyRevenue: Record<string, number>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  monthlyRevenue,
}) => {
  const sortedKeys = Object.keys(monthlyRevenue).sort((a, b) => {
    const months: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const parseDate = (dateStr: string) => {
      const parts = dateStr.split("-");
      if (parts.length !== 2) return new Date(0); // Fallback
      const [mon, year] = parts;
      return new Date(parseInt(year), months[mon] ?? 0, 1);
    };
    return parseDate(a).getTime() - parseDate(b).getTime();
  });
  const labels = sortedKeys;
  const dataPoints = sortedKeys.map((key) => monthlyRevenue[key]);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Monthly Revenue",
        data: dataPoints,
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-500">Revenue Trend</h3>
        <p className="text-sm text-gray-400">
          Monthly breakdown over the last period
        </p>
      </div>
      <div className="h-[300px] w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
