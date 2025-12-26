import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import StandardInventoryView from "../components/StandardInventoryView";

const InventoryPageDev: React.FC = () => {
  const [viewMode, setViewMode] = useState<"standard" | "ai">("standard");

  return (
    <div className="space-y-8 p-7 bg-slate-50 min-h-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time tracking and intelligent insights.
          </p>
        </div>

        <div className="bg-gray-200 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setViewMode("standard")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === "standard"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            Standard View
          </button>
          <button
            onClick={() => setViewMode("ai")}
            className={`flex items-center px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === "ai"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Insights
          </button>
        </div>
      </header>

      {viewMode === "standard" ? (
        <StandardInventoryView />
      ) : (
        <h1>AI Insights View Coming Soon! 🚀</h1>
      )}
    </div>
  );
};

export default InventoryPageDev;
