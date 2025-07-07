import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Dữ liệu menu không thay đổi
const menu = [
    { to: "/", label: "Chấm công", end: true },
    { to: "/tasks", label: "Nhiệm vụ" },
    { to: "/events", label: "Sự kiện" },
    { to: "/employees", label: "Nhân viên" },
    { to: "/export", label: "Xuất công" },
];

export default function Layout() {
    // Lấy thông tin vị trí hiện tại để làm key cho AnimatePresence
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* Header được làm gọn gàng hơn */}
            <header className="w-full bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <span className="text-xl font-extrabold text-slate-800 select-none flex items-center gap-2">
                        <span>🚀</span> HR Manager
                    </span>

                    {/* Menu Tabs được thiết kế lại */}
                    <nav className="flex items-center gap-1 sm:gap-2">
                        {menu.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className="relative px-3 sm:px-4 py-2 text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-sky-600"
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.label}
                                        {/* Đây là phần tử tạo ra hiệu ứng gạch chân trượt */}
                                        {isActive && (
                                            <motion.span
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"
                                                layoutId="underline" // Quan trọng: để tạo hiệu ứng trượt
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className="w-full max-w-4xl mx-auto p-4 sm:p-6">
                {/* Bọc Outlet bằng AnimatePresence để tạo hiệu ứng fade khi chuyển trang */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname} // Quan trọng: để AnimatePresence nhận biết sự thay đổi
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.25 }}
                        // Đây là khối "card" chứa nội dung
                        className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
