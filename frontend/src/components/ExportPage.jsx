import React, { useState } from "react";
import "./ExportPage.modern.css";

export default function ExportPage() {
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    try {
      const res = await fetch("https://backend-alpha-five-96.vercel.app/api/attendance/export");
      if (!res.ok) throw new Error("Tải file thất bại");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2800);
    } catch (err) {
      setSuccess(false);
      alert("Lỗi khi tải file Excel.");
      console.error(err);
    }
  };

  return (
    <div className="export-bg">
      <div className="export-card">
        <div className="export-icon">
          <svg width="58" height="58" fill="none" viewBox="0 0 48 48">
            <rect x="5" y="7" width="38" height="34" rx="7" fill="#e7fbe6" stroke="#31c97b" strokeWidth="2"/>
            <path d="M17 24v7m7-7v7m-7 0h7m8-16H9m16 16v0" stroke="#3dbb75" strokeWidth="2" strokeLinecap="round"/>
            <rect x="13" y="11" width="22" height="2.2" rx="1.1" fill="#31c97b"/>
          </svg>
        </div>
        <h2>Xuất dữ liệu chấm công</h2>
        <div className="export-desc">
          Tải file <b>Excel</b> chứa toàn bộ dữ liệu chấm công của hệ thống.<br />
          Sử dụng trên các phần mềm quản lý nhân sự & kế toán dễ dàng.
        </div>
        <button className="export-btn" onClick={handleExport}>
          <span role="img" aria-label="excel">📥</span> Tải file Excel
        </button>
        {success && <div className="export-success">Tải file thành công!</div>}
      </div>
    </div>
  );
}
