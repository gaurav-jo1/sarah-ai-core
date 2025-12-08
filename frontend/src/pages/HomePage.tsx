import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Database, TrendingUp, Sparkles } from "lucide-react";
import { DataResponseSchema} from "../types/product.types";

const HomePage: React.FC = () => {
  const [dataExists, setDataExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDataStatus = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/product/data"
        );

        // validate response data
        const parsed = DataResponseSchema.parse(response.data);

        // console.log("Length of the response:", response.data.length);

        if (parsed.length > 0) {
          setDataExists(true);
        } else {
          setDataExists(false);
        }

      } catch (err) {
        console.error("Error fetching data status:", err);
        setDataExists(false);
        setError("Could not connect to the API server.");
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
    <div className="space-y-16">
      {/* --- Welcome Heading (Appears ONLY if dataExists is false) --- */}
      {!dataExists && (
        <header className="text-center mb-10 p-6 rounded-3xl bg-gray-100 border border-indigo-200">
          <h1 className="text-6xl font-extrabold text-gray-900 leading-snug tracking-tighter">
            Welcome to the{" "}
            <span className="text-indigo-600">Mini Sarah AI</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-4xl mx-auto font-light">
            Real-time AI demand forecasting with automated reorder points,
            anomaly detection, and actionable recommendations.
          </p>
        </header>
      )}

      {/* --- Conditional Rendering based on Data Status --- */}
      {dataExists ? (
        <section className="p-12 border border-green-200 rounded-2xl bg-green-50/70 text-center shadow-lg transition duration-500">
          <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800">
            Data Ready for Forecasting!
          </h2>
          <p className="text-green-700 mt-2 text-lg">
            Your data is connected. Proceed with the next steps to view insights
            and demand forecasts.
          </p>
        </section>
      ) : (
        <section className="text-center p-16 mt-10 border border-indigo-200 rounded-3xl bg-gray-100 shadow-2xl shadow-indigo-100/50">
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
            It looks like you're new here. Mini Sarah AI needs your product
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
