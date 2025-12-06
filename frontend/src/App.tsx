import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router";
import { Home, MessageSquare, X, Menu, Database } from "lucide-react";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import DataConnectPage from "./pages/DataConnectPage";

const App: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const location = useLocation();

  const Menus = [
    { title: "Home", path: "/", src: <Home className="w-5 h-5" /> },
    {
      title: "Chat",
      path: "/chat",
      src: <MessageSquare className="w-5 h-5" />,
    },
    {
      title: "Data Connect",
      path: "/data-connect",
      src: <Database className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* SIDEBAR */}
      <div
        className={` ${
          open ? "w-72" : "w-20"
        } bg-slate-900 h-screen p-5 pt-8 relative duration-300`}
      >
        {/* HEADER: Logo & Close Button */}
        <div className="flex justify-between items-center mb-6">
          {/* Logo Group: Hovering here opens the sidebar */}
          <div
            className="flex gap-x-4 items-center cursor-pointer"
            onMouseEnter={() => !open && setOpen(true)}
          >
            <Menu className="w-8 h-8 text-blue-500 bg-white rounded-lg p-1" />
          </div>

          {/* Close Button: Only visible when Open */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {/* Lucide Close Icon */}
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* MENU ITEMS */}
        <ul className="pt-2 space-y-2">
          {Menus.map((Menu, index) => (
            <li key={index}>
              <Link
                to={Menu.path}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-slate-800 text-gray-300 text-sm items-center gap-x-4
                ${location.pathname === Menu.path && "bg-slate-800 text-white"}
                `}
              >
                <div className="min-w-5">{Menu.src}</div>
                <span
                  className={`
                    transition-all duration-300
                    whitespace-nowrap overflow-hidden
                    ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}
                  `}
                >
                  {Menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 h-screen overflow-y-auto p-7">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/data-connect" element={<DataConnectPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
