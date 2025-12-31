import axios from "axios";
import { Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { EfficiencyChart } from "./EfficiencyChart";
import { DollarSign, Activity, AlertTriangle } from "lucide-react";
import type { InventoryItem } from "../../types/inventory.types";
import { InventoryDistributionChart } from "./InventoryDistributionChart";
import { motion } from "framer-motion";

// Vibrant color palette for categories
const VIBRANT_COLORS = [
  { background: 'rgba(239, 68, 68, 0.8)', border: 'rgba(220, 38, 38, 1)' }, // Vibrant Red
  { background: 'rgba(59, 130, 246, 0.8)', border: 'rgba(37, 99, 235, 1)' }, // Electric Blue
  { background: 'rgba(245, 158, 11, 0.8)', border: 'rgba(217, 119, 6, 1)' }, // Vibrant Amber
  { background: 'rgba(16, 185, 129, 0.8)', border: 'rgba(5, 150, 105, 1)' }, // Emerald Green
  { background: 'rgba(139, 92, 246, 0.8)', border: 'rgba(124, 58, 237, 1)' }, // Purple
  { background: 'rgba(236, 72, 153, 0.8)', border: 'rgba(219, 39, 119, 1)' }, // Hot Pink
  { background: 'rgba(14, 165, 233, 0.8)', border: 'rgba(2, 132, 199, 1)' }, // Sky Blue
  { background: 'rgba(251, 146, 60, 0.8)', border: 'rgba(234, 88, 12, 1)' }, // Vibrant Orange
  { background: 'rgba(168, 85, 247, 0.8)', border: 'rgba(147, 51, 234, 1)' }, // Vivid Purple
  { background: 'rgba(34, 197, 94, 0.8)', border: 'rgba(22, 163, 74, 1)' }, // Lime Green
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const StandardInventoryView: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInventoryData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/inventory");

        setData(response.data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    getInventoryData();
  }, []);

  // Dynamically generate color mapping based on actual categories in the data
  const categoryColorMap = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.map(item => item.Category)));
    const colorMap: Record<string, { background: string; border: string }> = {};

    uniqueCategories.forEach((category, index) => {
      colorMap[category] = VIBRANT_COLORS[index % VIBRANT_COLORS.length];
    });

    return colorMap;
  }, [data]);

  const totalInventoryValue = data.reduce(
    (acc, item) => acc + item.Stock_On_Hand * item.Cost_Per_Unit,
    0
  );

  const totalUnitsSold = data.reduce((acc, item) => acc + item.Units_Sold, 0);
  const totalStockAvailable = data.reduce(
    (acc, item) => acc + item.Opening_Stock + item.Stock_Received,
    0
  );

  const overallSellThroughRate =
    totalStockAvailable > 0 ? (totalUnitsSold / totalStockAvailable) * 100 : 0;

  const lowStockCount = data.filter(
    (item) => item.Stock_On_Hand < item.Opening_Stock * 0.2 // Simplified threshold
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl text-indigo-500 animate-pulse">
          <Sparkles className="inline w-6 h-6 mr-2" />
          Loading Inventory Metrics...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Inventory Value</h3>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            $
            {totalInventoryValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Cost value of stock on hand
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Sell-Through Rate</h3>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {overallSellThroughRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Efficiency of stock turnover
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Low Stock Alerts</h3>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
          <p className="text-sm text-gray-400 mt-1">Products below 20% stock</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md"
          variants={itemVariants}
        >
          <InventoryDistributionChart data={data} categoryColors={categoryColorMap} />
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md"
          variants={itemVariants}
        >
          <EfficiencyChart data={data} categoryColors={categoryColorMap} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StandardInventoryView;
