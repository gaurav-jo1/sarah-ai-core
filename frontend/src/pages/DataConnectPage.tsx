import React, { useState, useCallback, useMemo } from "react";
import { Upload, FileText, Database, Cloud, Settings, CheckCircle, AlertCircle } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

        {/* Header Section (Matches Inventory.tsx style) */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Connect Your Data</h1>
          <p className="text-blue-100 text-lg">
            Seamlessly integrate your business data sources
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column: File Upload (The functional part) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Upload Local Files
                </h2>
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center
                  ${
                    selectedFile
                      ? "border-blue-500 bg-blue-50/50"
                      : uploadStatus === "error"
                      ? "border-red-400 bg-red-50/50"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload-input")?.click()}
                style={{ minHeight: "200px" }}
              >
                <Upload className={`w-12 h-12 mb-4 ${selectedFile ? "text-blue-500" : "text-slate-400"}`} />

                <p className="text-lg font-medium text-slate-700">
                  {selectedFile ? "File selected" : "Drag & drop your file here"}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  or <span className="text-blue-600 font-semibold hover:underline">browse</span> to upload
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  Supported: CSV, Excel (.xls, .xlsx)
                </p>

                <input
                  id="file-upload-input"
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* File Status & Actions */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className={`font-mono text-sm max-w-[200px] truncate ${selectedFile ? "text-slate-700" : "text-slate-400 italic"}`}>
                    {fileNameDisplay}
                  </span>
                  {selectedFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setUploadStatus(null);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  )}
                </div>

                 {/* Status Messages */}
                 <div className="mb-4 min-h-[1.5rem] flex items-center justify-center text-sm">
                  {isUploading && (
                    <span className="flex items-center text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing data...
                    </span>
                  )}
                  {uploadStatus === "success" && (
                     <span className="flex items-center text-green-600 font-medium">
                       <CheckCircle className="w-4 h-4 mr-1.5" />
                       Data connected successfully!
                     </span>
                  )}
                  {uploadStatus === "error" && (
                    <span className="flex items-center text-red-600 font-medium">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      Invalid file type. Please try again.
                    </span>
                  )}
                </div>

                <button
                  onClick={handleConnectData}
                  disabled={!selectedFile || isUploading}
                  className={`
                    w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                    ${
                      selectedFile && !isUploading
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:transform active:scale-95"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isUploading ? "Connecting..." : "Connect Data"}
                </button>
              </div>
            </div>

            {/* Right Column: Coming Soon / Future Integrations */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Enterprise Integrations
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                   We are currently building direct connectors for major cloud storage and ERP systems.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 w-full">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Coming Soon</h3>
                <ul className="space-y-4">
                  {/* Cloud Drive */}
                  <li className="flex items-start">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mr-3 shrink-0">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-slate-700 font-medium">Cloud Storage & Drive</span>
                      <span className="text-xs text-slate-500">Google Drive, Dropbox, S3 buckets</span>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                          Q1 '26
                        </span>
                      </div>
                    </div>
                  </li>

                  {/* ERP */}
                  <li className="flex items-start">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mr-3 shrink-0">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-slate-700 font-medium">ERP System Sync</span>
                      <span className="text-xs text-slate-500">SAP, Oracle, Netsuite direct sync</span>
                       <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                          Q2 '26
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                   <p className="text-xs text-slate-500">
                    Need a specific integration? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact us</a>
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DataConnectPage;
