import React from "react";
import { Routes, Route } from "react-router";
import Sidebar from "./components/layout/Sidebar";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import DataConnectPage from "./pages/DataConnectPage";
import Forecasting from "./pages/Forecasting";
import InventoryPage from "./pages/InventoryPage";
import InvoiceIntelligencePage from "./pages/InvoiceIntelligencePage";
import InvoiceDocumentPage from "./pages/InvoiceDocumentPage";
import InvoiceValidatePage from "./pages/InvoiceValidatePage";

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/data-connect" element={<DataConnectPage />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/invoice-intelligence" element={<InvoiceIntelligencePage />} />
          <Route path="/invoice-intelligence/document" element={<InvoiceDocumentPage />} />
          <Route path="/invoice-intelligence/document/validate" element={<InvoiceValidatePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
