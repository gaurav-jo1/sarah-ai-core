import React, { useMemo, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import type { RevenueResponse } from "../types/revenue.types";

const RevenueForecast: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("All");
  const [forecastData, setForecastData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productNames, setProductNames] = useState<Record<string, string>>({});

  const fetchForecast = async (productId: string) => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/forecast/revenue";
      const params: Record<string, string> = {};

      if (productId && productId !== "All") {
        params.product_id = productId;
      }

      const response = await axios.get<RevenueResponse>(url, { params });
      setForecastData(response.data);

      if (response.data.products_name) {
          setProductNames(response.data.products_name);
      }

    } catch (error) {
      console.error("Failed to fetch forecast data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(selectedProduct);
  }, [selectedProduct]);

  const bridgeIndex = useMemo(() => {
    if (!forecastData || !forecastData.data) return -1;
    return forecastData.data.length - 1;
  }, [forecastData]);

  const chartData = useMemo(() => {
    if (!forecastData) return null;

    const historical = forecastData.data;
    const predictions = forecastData.prediction;

    const labels = [
      ...historical.map((d) => d.period),
      ...predictions.map((d) => d.period),
    ];

    const historicalDataPoints = [
      ...historical.map((d) => d.revenue),
      ...Array(predictions.length).fill(null),
    ];

    const lastHistorical = historical[historical.length - 1];
    const lastHistoricalValue = lastHistorical ? lastHistorical.revenue : null;

    const predictionDataPoints = [
      ...Array(historical.length - 1).fill(null),
      lastHistoricalValue,
      ...predictions.map((d) => d.predictions),
    ];

    const upperDataPoints = [
      ...Array(historical.length - 1).fill(null),
      lastHistoricalValue,
      ...predictions.map((d) => d["revenue_0.9"]),
    ];

    const lowerDataPoints = [
      ...Array(historical.length - 1).fill(null),
      lastHistoricalValue,
      ...predictions.map((d) => d.revenue_0_1),
    ];

    const predictionPointRadius = predictionDataPoints.map((_, index) =>
        index === bridgeIndex ? 0 : 4
    );

    const predictionPointHoverRadius = predictionDataPoints.map((_, index) =>
        index === bridgeIndex ? 0 : 6
    );

    return {
      labels,
      datasets: [
        {
          label: "Historical Revenue",
          data: historicalDataPoints,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Prediction (0.9 Upper)",
          data: upperDataPoints,
          borderColor: "transparent",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          pointRadius: 0,
          fill: 3,
          tension: 0.3,
        },
        {
          label: "Predicted Revenue",
          data: predictionDataPoints,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderDash: [5, 5],
          tension: 0.3,
          pointRadius: predictionPointRadius,
          pointHoverRadius: predictionPointHoverRadius,
        },
        {
          label: "Prediction (0.1 Lower)",
          data: lowerDataPoints,
          borderColor: "transparent",
          pointRadius: 0,
          backgroundColor: "transparent",
          fill: false,
          tension: 0.3,
        },
      ],
    };
  }, [forecastData, bridgeIndex]);

  const options: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
          filter: (item) => {
            return (
              item.text === "Historical Revenue" || item.text === "Predicted Revenue"
            );
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
            }
        },
        filter: (tooltipItem) => {
            if (tooltipItem.dataset.label === "Predicted Revenue" && tooltipItem.dataIndex === bridgeIndex) {
                return false;
            }
            return true;
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter, sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue",
          font: {
            family: "Inter, sans-serif",
            weight: "bold",
          },
        },
        grid: {
          color: "#f3f4f6",
        },
        border: {
          display: false,
        },
        ticks: {
            callback: (value) => {
                if (typeof value === 'number') {
                     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(value);
                }
                return value;
            }
        }
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  }), [bridgeIndex]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Revenue Forecasting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Projected revenue trends
          </p>
        </div>

        {/* Product Dropdown */}
        <div className="relative">
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            disabled={loading}
            className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="All">All Products</option>
            {Object.entries(productNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary / Insights - MOVED TO TOP */}
      {forecastData && forecastData.prediction.length > 0 && (
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 max-w-sm">
          <p className="text-sm text-gray-500">Next Month Prediction</p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(forecastData.prediction[0].predictions)}{" "}
          </p>
        </div>
      )}

      {/* Main Chart Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedProduct === "All"
              ? "All Products"
              : productNames[selectedProduct] || selectedProduct}{" "}
            - Forecast
          </h2>
          {loading && (
            <span className="text-xs font-medium text-blue-500 animate-pulse">
              Updating...
            </span>
          )}
        </div>

        <div className="h-[400px] w-full relative">
            {chartData ? (
                <Line options={options} data={chartData} />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    {loading ? 'Loading data...' : 'No data available'}
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default RevenueForecast;
