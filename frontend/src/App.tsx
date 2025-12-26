import React from "react";
import { Routes, Route } from "react-router";
import Sidebar from "./components/Sidebar";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import DataConnectPage from "./pages/DataConnectPage";
import Forecasting from "./pages/Forecasting";
import InventoryPageDev from "./pages/InventoryPageDev";

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
          <Route path="/inventory" element={<InventoryPageDev />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;


