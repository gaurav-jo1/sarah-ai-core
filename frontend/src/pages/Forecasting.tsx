import React, { useState } from "react";
import UnitsForecast from "../components/UnitsForecast";
import RevenueForecast from "../components/RevenueForecast";

const Forecasting: React.FC = () => {
  const [metric, setMetric] = useState<"Units" | "Revenue">("Units");

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-6">
          {/* Toggle Switch */}
          <div className="flex justify-start">
            <div className="bg-gray-100 p-1 rounded-lg items-center inline-flex">
              <button
                onClick={() => setMetric("Units")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  metric === "Units"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Units
              </button>
              <button
                onClick={() => setMetric("Revenue")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  metric === "Revenue"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Revenue
              </button>
            </div>
          </div>

          <div className="w-full">
            {metric == "Units" ? (
              <UnitsForecast />
            ) : (
              <RevenueForecast />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
