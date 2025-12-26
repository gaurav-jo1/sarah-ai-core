import axios from "axios";
import { Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { EfficiencyChart } from "./EfficiencyChart";
import { DollarSign, Activity, AlertTriangle } from "lucide-react";
import type { InventoryItem } from "../types/inventory.types";
import { InventoryDistributionChart } from "./InventoryDistributionChart";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
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
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
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
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Low Stock Alerts</h3>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
          <p className="text-sm text-gray-400 mt-1">Products below 20% stock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
          <InventoryDistributionChart data={data} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
          <EfficiencyChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default StandardInventoryView;
