import React, { useState, useEffect, useRef } from "react";
import { Sparkles, RefreshCw, Trash2, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import type { AiInsightsResponse } from "../../types/inventory.types";

interface RestockItem {
  id: string;
  productName: string;
  currentStock: number;
  forecastedDemand: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AiInsightsView: React.FC = () => {
  const [data, setData] = useState<AiInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showRestockPlan, setShowRestockPlan] = useState(false);
  const [restockItems, setRestockItems] = useState<RestockItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const restockPlanRef = useRef<HTMLElement>(null);

  const loadingMessages = [
    "Analyzing historical sales data...",
    "Detecting seasonal patterns...",
    "Predicting future demand trends...",
    "Optimizing inventory levels...",
    "Generating actionable insights...",
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGeneratePlan = () => {
    if (data?.inventory) {
      const items = data.inventory.map((item, index) => ({
        id: `item-${index}`,
        productName: item.product_name,
        currentStock: item.stock_on_hand,
        forecastedDemand: item.replenishment_needed, // Using replenishment_needed as initial forecast
      }));
      setRestockItems(items);
      setShowRestockPlan(true);
      // Scroll to bottom after state update
      setTimeout(() => {
        restockPlanRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  const handleUpdateForecast = (id: string, value: number) => {
    setRestockItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, forecastedDemand: value } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setRestockItems((items) => items.filter((item) => item.id !== id));
  };

  const handleExecutePlan = () => {
    setOrderPlaced(true);
  };

  const fetchData = async () => {
    setLoading(true);
    setLoadingStep(0);

    try {
      let url = "http://127.0.0.1:8000/inventory/insight";
      const response = await axios.get<AiInsightsResponse>(url);

      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch forecast data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: false,
        text: "Inventory vs Forecasted Needs",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  const chartData = {
    labels: data?.inventory.map((item) => item.product_name) || [],
    datasets: [
      {
        label: "Current Stock",
        data: data?.inventory.map((item) => item.stock_on_hand) || [],
        backgroundColor: "rgba(99, 102, 241, 0.8)", // Indigo
        borderRadius: 4,
      },
      {
        label: "Replenishment Needed",
        data: data?.inventory.map((item) => item.replenishment_needed) || [],
        backgroundColor: "rgba(244, 63, 94, 0.8)", // Rose/Red for urgency
        borderRadius: 4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 relative overflow-hidden rounded-3xl bg-slate-50/50">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 to-purple-50/50 opacity-50"></div>

        {/* Pulsing Orb Effects */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20 animate-pulse rounded-full"></div>
          <div className="bg-white p-6 rounded-full shadow-xl shadow-indigo-100 relative z-10 animate-bounce-slow">
             <Sparkles className="w-12 h-12 text-indigo-600 animate-spin-slow" />
          </div>

          {/* Orbiting particles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-100 rounded-full animate-spin-reverse-slower opacity-60">
             <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full blur-[1px]"></div>
          </div>
        </div>

        <div className="mt-8 text-center bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 relative z-10 h-8">
           <span className="text-xl font-semibold animate-fade-in-up key={loadingStep}">
             {loadingMessages[loadingStep]}
           </span>
        </div>

        <div className="mt-2 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-ping"
                style={{ animationDelay: `${i * 200}ms` }}
              ></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Sparkles className="w-48 h-48 text-white transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">AI Inventory Intelligence</h2>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Leveraging advanced forecasting models and LLMs to provide you with
            actionable insights and automated management strategies.
          </p>
        </div>
      </motion.div>

      {/* AI Insights Chart */}
      <motion.section
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            Projected Inventory Needs
          </h3>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="h-80 w-full">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </motion.section>

      {/* AI Summary */}
      <motion.section
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Strategic Analysis
          </h3>
        </div>

        <div className="prose prose-indigo max-w-none text-gray-600">
          <ReactMarkdown>{data?.summary || ""}</ReactMarkdown>
        </div>
      </motion.section>

      {!showRestockPlan && !orderPlaced && (
        <section className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGeneratePlan}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Generate AI Restock Plan
          </motion.button>
        </section>
      )}

      <AnimatePresence>
        {showRestockPlan && !orderPlaced && (
          <motion.section
            ref={restockPlanRef}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              Review Restock Plan
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Forecasted Demand (3M)</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <AnimatePresence>
                    {restockItems.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{item.productName}</td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {item.currentStock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={item.forecastedDemand}
                            onChange={(e) =>
                              handleUpdateForecast(item.id, parseInt(e.target.value) || 0)
                            }
                            className="w-24 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                            title="Remove Item"
                          >
                            <Trash2 className="w-5 h-5 cursor-pointer" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExecutePlan}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium shadow-md shadow-green-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                Execute AI Restock Plan
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {orderPlaced && (
        <motion.section
          className="bg-green-50 rounded-2xl border border-green-100 p-12 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800">
              Order Placed Successfully!
            </h3>
            <p className="text-green-600 max-w-md mx-auto">
              Your AI-optimized restock plan has been executed. Orders have been
              sent to your suppliers.
            </p>
            <button
              onClick={() => {
                setOrderPlaced(false);
                setShowRestockPlan(false);
              }}
              className="mt-6 text-sm text-green-700 font-medium hover:underline"
            >
              Start New Plan
            </button>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};
