import React, { useState, useRef } from "react";
import {
  FileCheck,
  Package,
  CreditCard,
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

const InvoiceDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    navigate("/invoice-intelligence");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="w-full max-w-7xl mb-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {uploadedFile && (
        <div className="w-full max-w-7xl mb-8 flex flex-col items-center md:items-start">
          <div className="flex items-center bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm w-full md:w-auto">
            <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
            <div className="mr-8">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Active Document
              </p>
              <p className="text-lg font-bold text-slate-800 truncate max-w-md">
                {uploadedFile.name}
              </p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors ml-auto text-slate-400 hover:text-red-500"
              aria-label="Remove file"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {/* Card 1: Upload PDF */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <Upload className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">Upload PDF</h2>
          <p className="text-slate-500 mb-6 text-sm">
            {uploadedFile
              ? "Upload a new file to replace the current one."
              : "Upload your invoice PDF to start analysis."}
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <button
            onClick={handleUploadClick}
            className="w-full py-3 font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-md hover:shadow-lg cursor-pointer"
          >
            {uploadedFile ? "Replace File" : "Upload File"}
          </button>
        </div>

        {/* Card 2: Validate Against PO */}
        <div
          className={`rounded-2xl shadow-lg border p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300 ${
            uploadedFile
              ? "bg-emerald-50 border-emerald-200"
              : "bg-white border-slate-100"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              uploadedFile
                ? "bg-white text-emerald-600 shadow-sm"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <FileCheck className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Validate Against PO
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Cross-check invoice details against the original Purchase Order.
          </p>

          <button
            disabled={!uploadedFile}
            onClick={() =>
              navigate("/invoice-intelligence/document/validate", {
                state: { file: uploadedFile },
              })
            }
            className={`w-full py-3 font-semibold text-white transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg ${
              uploadedFile
                ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 cursor-pointer"
                : "bg-slate-300 cursor-not-allowed text-slate-500"
            }`}
          >
            Validate Now
          </button>
        </div>

        {/* Card 3: Update Inventory */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden group">
          <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
            Coming Soon
          </div>
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
            <Package className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Update Inventory
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Automatically update stock levels based on invoice items.
          </p>

          <button
            disabled
            className="w-full py-3 font-semibold text-slate-400 transition-all duration-200 bg-slate-100 rounded-full cursor-not-allowed"
          >
            Update Inventory
          </button>
        </div>

        {/* Card 4: Initiate Payment */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
            Coming Soon
          </div>
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
            <CreditCard className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Initiate Payment
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Schedule or process payment for the validated invoice.
          </p>

          <button
            disabled
            className="w-full py-3 font-semibold text-slate-400 transition-all duration-200 bg-slate-100 rounded-full cursor-not-allowed"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDocumentPage;
