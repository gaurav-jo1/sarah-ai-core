import React, { useState, useCallback, useMemo } from "react";

import { Upload, FileText, Database, Cloud, Settings } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

type UploadStatus = "success" | "error" | null;

const DataConnectPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);

  const navigate = useNavigate();

  const fileNameDisplay = useMemo(() => {
    if (!selectedFile) return "No file selected";
    const name = selectedFile.name;

    return name.length > 30
      ? `${name.substring(0, 15)}...${name.slice(-10)}`
      : name;
  }, [selectedFile]);

  const handleFileChange = useCallback((file: File | undefined) => {
    setUploadStatus(null);
    if (
      file &&
      (file.type === "text/csv" ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsx"))
    ) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setUploadStatus("error");

      setTimeout(() => setUploadStatus(null), 3000);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0]);
  };

  const handleConnectData = async () => {
    if (!selectedFile) {
      setUploadStatus("error");
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(
        "http://127.0.0.1:8000/product/data_connect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data, res.status);
      setUploadStatus("success");
      setSelectedFile(null);
      navigate("/");
    } catch (err) {
      console.log("Error uploading file:", err);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const buttonClass = `
        w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300
        ${
          selectedFile && !isUploading
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 cursor-pointer"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }
    `;

  return (
    <div className="min-h-full flex flex-col items-center p-4 sm:p-8 bg-white">
      <header className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Connect Your Data
        </h1>
        <p className="text-lg text-gray-500">
          Get started by uploading a file or explore future integration options
          below.
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        {/* --------------------- 1. File Upload Card --------------------- */}
        <div className="lg:w-1/2 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            Upload Local Files (MVP)
          </h2>

          {/* Drag & Drop Zone */}
          <div
            className="p-8 border-4 border-dashed rounded-xl cursor-pointer transition duration-200"
            style={{
              borderColor: selectedFile
                ? "rgb(59 130 246 / 0.7)"
                : uploadStatus === "error"
                ? "rgb(239 68 68 / 0.7)"
                : "rgb(209 213 219 / 0.7)",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              document.getElementById("file-upload-input")?.click()
            }
          >
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-700">
                Drag & drop your file here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or{" "}
                <span className="text-blue-600 font-semibold hover:text-blue-700">
                  browse
                </span>{" "}
                to upload
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: CSV, Excel (.xls, .xlsx)
              </p>
            </div>
            <input
              id="file-upload-input"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* File Status Area */}
          <div className="mt-6">
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <span
                className={`font-mono text-sm truncate ${
                  selectedFile ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {fileNameDisplay}
              </span>
              {selectedFile && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadStatus(null);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Status Messages */}
            <div className="mt-4 h-6 text-center">
              {isUploading && (
                <div className="flex items-center justify-center text-blue-600 font-medium">
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                  Processing data...
                </div>
              )}
              {uploadStatus === "success" && (
                <p className="text-green-600 font-medium">
                  ✅ Data connected successfully!
                </p>
              )}
              {uploadStatus === "error" && (
                <p className="text-red-600 font-medium">
                  ⚠️ Error: Please upload a valid CSV or Excel file.
                </p>
              )}
            </div>

            <button
              onClick={handleConnectData}
              disabled={!selectedFile || isUploading}
              className={buttonClass}
            >
              {isUploading ? "Connecting..." : "Connect Data"}
            </button>
          </div>
        </div>

        {/* --------------------- 2. Coming Soon Section --------------------- */}
        <div className="lg:w-1/2 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Database className="w-6 h-6 mr-2 text-indigo-500" />
            Enterprise Integrations
          </h2>

          <p className="text-gray-600 mb-6">
            We are actively working on expanding our data connectivity options
            to provide seamless integration with your existing systems and cloud
            providers.
          </p>

          <div className="space-y-4">
            {/* Integration Item: Cloud/Drive */}
            <div className="flex items-center p-4 bg-indigo-50 rounded-xl border border-indigo-200 shadow-sm">
              <Cloud className="w-6 h-6 text-indigo-500 shrink-0 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Cloud Storage & Drive
                </h3>
                <p className="text-sm text-indigo-700">
                  Connect Google Drive, Dropbox, and cloud buckets.
                </p>
              </div>
              <span className="ml-auto text-xs font-semibold px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full whitespace-nowrap">
                Q1 '26
              </span>
            </div>

            {/* Integration Item: ERP/Systems */}
            <div className="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
              <Settings className="w-6 h-6 text-purple-500 shrink-0 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Existing ERP Systems
                </h3>
                <p className="text-sm text-purple-700">
                  Direct connections to SAP, Oracle, and custom APIs.
                </p>
              </div>
              <span className="ml-auto text-xs font-semibold px-2 py-1 bg-purple-200 text-purple-800 rounded-full whitespace-nowrap">
                Q2 '26
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-center text-gray-600">
            Need a specific integration?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Let us know
            </a>{" "}
            what's most important to you.
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataConnectPage;
