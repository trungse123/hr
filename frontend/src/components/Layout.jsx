import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const menu = [
  {
    to: "/",
    label: "Chấm công",
    icon: (
      <svg width="22" height="22" fill="none"><circle cx="11" cy="11" r="9" stroke="#f77f00" strokeWidth="2"/><path d="M11 6.3v4.5l2.5 2" stroke="#f77f00" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    end: true,
  },
  {
    to: "/tasks",
    label: "Nhiệm vụ",
    icon: (
      <svg width="22" height="22" fill="none"><rect x="4" y="5" width="14" height="12" rx="3" stroke="#7b35e9" strokeWidth="2"/><path d="M7 9h8M7 13h5" stroke="#7b35e9" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    to: "/events",
    label: "Sự kiện",
    icon: (
      <svg width="22" height="22" fill="none"><rect x="4" y="6" width="14" height="11" rx="3" stroke="#ff6c2d" strokeWidth="2"/><path d="M8 4v4m6-4v4" stroke="#ff6c2d" strokeWidth="2"/><circle cx="11" cy="13.5" r="2" fill="#ffb86c"/></svg>
    ),
  },
  {
    to: "/employees",
    label: "Nhân viên",
    icon: (
      <svg width="22" height="22" fill="none"><circle cx="11" cy="8" r="3.3" stroke="#6b33c2" strokeWidth="2"/><ellipse cx="11" cy="16.3" rx="6" ry="4" stroke="#6b33c2" strokeWidth="2"/></svg>
    ),
  },
  {
    to: "/export",
    label: "Xuất công",
    icon: (
      <svg width="22" height="22" fill="none"><rect x="4" y="5" width="14" height="12" rx="3" stroke="#34ba7a" strokeWidth="2"/><path d="M11 9v5m0 0-2-2m2 2 2-2" stroke="#34ba7a" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-fuchsia-50 to-cyan-50">
      <nav className="w-full flex flex-col items-center shadow-md bg-white sticky top-0 z-50 px-0">
        <div className="w-full max-w-3xl flex items-center justify-between px-4 pt-3">
          {/* Logo */}
          <span className="text-xl font-extrabold text-orange-500 select-none flex items-center gap-2">
            <span>🚀</span> HR Manager
          </span>
        </div>
        {/* Tabs menu */}
        <div className="w-full max-w-3xl flex gap-2 md:gap-3 px-4 py-2 justify-center flex-wrap">
          {menu.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                "flex flex-col items-center min-w-[72px] md:min-w-[110px] px-3 py-2 rounded-2xl transition-all duration-150 shadow-sm font-semibold mb-1 " +
                (isActive
                  ? "bg-gradient-to-r from-orange-400 to-fuchsia-400 text-white shadow-lg scale-[1.06]"
                  : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-100")
              }
            >
              <span>{item.icon}</span>
              <span className="text-xs md:text-sm font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      {/* Main content */}
      <main className="flex justify-center p-2 sm:p-6 min-h-[88vh]">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
