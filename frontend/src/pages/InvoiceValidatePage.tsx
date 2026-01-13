import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

import type { ApiResponse, LocationState } from "../types/invoice.types";
import ValidationSummaryCards from "../components/invoice/ValidationSummaryCards";
import ValidationTable from "../components/invoice/ValidationTable";
import IssuerDetailsCard from "../components/invoice/IssuerDetailsCard";

const InvoiceValidatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const file = state?.file;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!file) {
      navigate("/invoice-intelligence/document");
      return;
    }

    const validateInvoice = async () => {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      if (file) formData.append("file", file);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/invoice/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setApiResponse(response.data);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(
          err.message || "An error occurred while validating the invoice."
        );
      } finally {
        setIsLoading(false);
      }
    };

    validateInvoice();
  }, [file, navigate]);

  const handleBack = () => {
    navigate("/invoice-intelligence/document");
  };

  // If redirected, might be null briefly
  if (!file && isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8 font-sans text-slate-800">
      {/* Header Navigation */}
      <div className="w-full max-w-7xl mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <div className="bg-white p-2 rounded-full border border-slate-200 mr-3 group-hover:border-indigo-200 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Documents</span>
        </button>
      </div>

      <div className="w-full max-w-7xl">
        {/* Title Section */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Invoice Audit
          </h1>
          <p className="text-slate-500 flex items-center">
            Validating{" "}
            <span className="font-medium text-slate-800 mx-1">
              {file?.name || "Document"}
            </span>{" "}
            against Purchase Order records.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Analyzing Document
            </h3>
            <p className="text-slate-500">
              Extracting line items and verifying prices...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !apiResponse && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Validation Failed
            </h3>
            <p className="text-slate-500 mb-8 max-w-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success / Results State */}
        {apiResponse && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Issuer Details */}
            <IssuerDetailsCard details={apiResponse.issuer_details} />

            {/* Summary & Validation Cards */}
            <ValidationSummaryCards
              invoice={apiResponse.invoice_summary}
              po={apiResponse.po_summary}
              lineItems={apiResponse.response}
            />

            {/* Detailed Table */}
            <ValidationTable items={apiResponse.response} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceValidatePage;
