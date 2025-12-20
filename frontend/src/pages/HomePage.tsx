import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  Database,
  TrendingUp,
  Sparkles,
  DollarSign,
  ShoppingBag,
  Package,
} from "lucide-react";
import {
  metricsResponseSchema,
  type metricsResponse,
} from "../types/product.types";
import { TopProductsChart } from "../components/TopProductsChart";
import { RevenueChart } from "../components/RevenueChart";

const HomePage: React.FC = () => {
  const [dataExists, setDataExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<metricsResponse | null>(null);

  useEffect(() => {
    const checkDataStatus = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/product/metrics"
        );

        // validate response data
        const parsed = metricsResponseSchema.parse(response.data);

        if (Object.keys(parsed).length > 0) {
          setDataExists(true);
          setMetrics(parsed);
        } else {
          setDataExists(false);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const status = err.response.status;
          console.log("Status:", status);
          setDataExists(false);

          if (status === 404) {
            console.log("Data not found — show empty state message");
          }

          if (status === 500) {
            console.log("Server error — show retry button");
            setError("Could not connect to the API server.");
          }
        } else {
          console.log("Unexpected or network error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkDataStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl text-indigo-500 animate-pulse">
          <Sparkles className="inline w-6 h-6 mr-2" />
          Analyzing AI readiness...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 p-7">
      {/* --- Welcome Heading (Appears ONLY if dataExists is false) --- */}
      {!dataExists && (
        <header className="text-center mb-10 p-6 rounded-3xl bg-gray-100 border border-indigo-200 shadow-lg">
          <h1 className="text-6xl font-extrabold text-gray-900 leading-snug tracking-tighter">
            Welcome to the{" "}
            <span className="text-indigo-600">Sarah AI Core</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-4xl mx-auto font-light">
            Real-time AI demand forecasting with automated reorder points,
            anomaly detection, and actionable recommendations.
          </p>
        </header>
      )}

      {/* --- Conditional Rendering based on Data Status --- */}
      {dataExists && metrics ? (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Monthly Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign className="w-24 h-24 text-indigo-600 transform rotate-12" />
              </div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-500">
                  Monthly Revenue
                </h3>
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-bold text-gray-900">
                  $
                  {metrics.latest_monthly_revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-green-500 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Latest Month
                </p>
              </div>
            </div>

            {/* 2. Units Sold */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShoppingBag className="w-24 h-24 text-blue-600 transform -rotate-12" />
              </div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-500">
                  Units Sold
                </h3>
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.latest_units_sold.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Total volume</p>
              </div>
            </div>

            {/* 3. Stock on Hand */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Package className="w-24 h-24 text-orange-600 transform -rotate-6" />
              </div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-500">
                  Stock on Hand
                </h3>
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.latest_stock_on_hand.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Current Inventory</p>
              </div>
            </div>

            {/* 4. Top Products Chart */}
            <div className="h-full">
              <TopProductsChart topProducts={metrics.top_products} />
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <RevenueChart monthlyRevenue={metrics.monthly_revenue} />
        </div>
      ) : (
        <section className="text-center p-16 mt-10 border border-indigo-200 rounded-3xl bg-gray-100 shadow-lg">
          <div className="relative inline-block mb-8">
            <div className="p-4 bg-indigo-50 rounded-full border-4 border-indigo-100">
              <Database className="w-16 h-16 text-indigo-500" />
            </div>
          </div>

          {/* Updated Heading and Message */}
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Welcome! Let's Connect Your Data
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto font-light">
            It looks like you're new here. Sarah AI Core needs your product
            demand history to begin generating accurate forecasts and actionable
            inventory suggestions.
          </p>

          {/* Softened Button Design */}
          <Link
            to="/data-connect"
            className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-semibold rounded-xl shadow-lg text-white bg-indigo-500 hover:bg-indigo-600 transition duration-300 transform hover:scale-[1.02] ring-2 ring-indigo-200 ring-offset-2"
          >
            <Database className="w-6 h-6 mr-3" />
            Start by Connecting Data
          </Link>

          {/* Optional: Add a subtle fallback message for actual API error */}
          {error && (
            <div className="mt-8 text-sm text-red-500">
              **Technical Note:** There was an issue connecting to the
              forecasting service. Please try again later.
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default HomePage;
