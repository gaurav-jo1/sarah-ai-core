import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const Menus = [
    { title: "Home", path: "/", src: <HomeIcon /> },
    { title: "Chat", path: "/chat", src: <ChatIcon /> },
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
            <div className={`duration-400 ${open && "rotate-360"}`}>
               <LogoIcon />
            </div>
          </div>

          {/* Close Button: Only visible when Open */}
          {open && (
            <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                <XMarkIcon />
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
                <span className={`${!open && "hidden"} origin-left duration-200`}>
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
        </Routes>
      </div>
    </div>
  );
};

export default App;

// --- ICONS (Added XMarkIcon, removed Chevron) ---

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500 bg-white rounded-lg p-1">
     <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
)

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);