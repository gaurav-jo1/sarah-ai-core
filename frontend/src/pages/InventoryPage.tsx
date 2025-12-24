import React from 'react';
import { Hammer, Brain, HardHat } from 'lucide-react';

const InventoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
             <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Intelligence</h1>
          <p className="text-blue-100 text-lg">AI-Powered Stock Management</p>
        </div>

        <div className="p-10 text-center">
          <div className="flex justify-center gap-4 mb-8">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Hammer className="w-8 h-8" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
               <HardHat className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Feature In Development
          </h2>

          <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
            We are currently building advanced AI forecasting models to help you better manage your inventory.
            This feature will allow you to project upcoming month needs with precision.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 inline-block text-left w-full max-w-md">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Coming Soon</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                AI-driven Demand Forecasting
              </li>
               <li className="flex items-center text-slate-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Automated Restock Recommendations
              </li>
               <li className="flex items-center text-slate-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Stockout Prediction Analytics
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;