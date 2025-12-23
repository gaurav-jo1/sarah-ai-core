import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { Home, MessageSquare, X, Menu, Database, ChartNoAxesCombined, Package } from "lucide-react";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [headerHovered, setHeaderHovered] = useState(false);
  const location = useLocation();

  const Menus = [
    { title: "Home", path: "/", src: <Home className="w-5 h-5" /> },
    { title: "Chat", path: "/chat", src: <MessageSquare className="w-5 h-5" /> },
    { title: "Forecasting", path: "/forecasting", src: <ChartNoAxesCombined className="w-5 h-5" /> },
    { title: "Inventory", path: "/inventory", src: <Package className="w-5 h-5" /> },
    { title: "Data Connect", path: "/data-connect", src: <Database className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } bg-white h-screen p-5 pt-8 relative duration-300 border-r border-gray-200 flex flex-col`}
    >
      {/* HEADER: Logo & Close/Open Logic */}
      <div className="flex justify-between items-center mb-6 h-10">
        <div
          className="flex items-center justify-center w-full cursor-pointer h-full"
          onClick={() => !open && setOpen(true)}
          onMouseEnter={() => setHeaderHovered(true)}
          onMouseLeave={() => setHeaderHovered(false)}
        >
          {open ? (
            <div className="flex justify-between items-center w-full">
              <span className="text-xl font-bold bg-gradient-to-tr from-blue-600 to-blue-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
                Sarah AI
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // Closed State
            <div className="flex items-center justify-center w-full h-full">
              {headerHovered ? (
                <Menu className="w-6 h-6 text-blue-600 animate-in fade-in zoom-in duration-200" />
              ) : (
                <span className="text-xl font-bold text-blue-600 animate-in fade-in zoom-in duration-200">
                  S
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MENU ITEMS */}
      <ul className="space-y-2">
        {Menus.map((menu, index) => {
          const isActive = location.pathname === menu.path;
          return (
            <li key={index}>
              <Link
                to={menu.path}
                className={`flex rounded-lg p-2 cursor-pointer text-sm items-center gap-x-4
                  transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div
                  className={`min-w-5 ${
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {menu.src}
                </div>
                <span
                  className={`
                    transition-all duration-300 origin-left
                    whitespace-nowrap overflow-hidden
                    ${open ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-5 hidden"}
                  `}
                >
                  {menu.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
