import React from 'react';
import { useNavigate } from 'react-router';
import { FileText, Mail, ArrowBigRightDash } from 'lucide-react';

const InvoiceIntelligencePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4 tracking-tight drop-shadow-sm">
          Invoice Intelligence
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Upload documents or connect your email to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Card 1: Upload Document */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <FileText className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Document</h2>
          <div className="text-slate-500 mb-8 max-w-xs flex items-center justify-center gap-2">
            Upload your invoice PDF to automatically extract insights.
          </div>

          <button
            onClick={() => navigate('/invoice-intelligence/document')}
            className="group relative inline-flex items-center justify-center cursor-pointer px-8 py-3 font-semibold text-white transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600"
          >
            <ArrowBigRightDash className="w-4 h-4 mr-2" />
            Upload File
          </button>
        </div>

        {/* Card 2: Connect Email */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
            <Mail className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Connect Email</h2>
          <p className="text-slate-500 mb-8 max-w-xs">
            Connect your email to automatically sync and process invoices.
          </p>

          <button
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 shadow-md hover:shadow-lg w-full md:w-auto cursor-not-allowed opacity-90"
            disabled
          >
             <Mail className="w-4 h-4 mr-2" />
            Connect Account
          </button>
        </div>
      </div>

      <div className="mt-12 text-slate-400 text-sm">
        SECURE • ENCRYPTED • PRIVATE
      </div>
    </div>
  );
};

export default InvoiceIntelligencePage;