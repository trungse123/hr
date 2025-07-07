import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttendancePage.modern.css";

export default function AttendancePage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem("attendance_user_code");
    if (savedCode) setCode(savedCode);
  }, []);

  const handleCheck = async (type) => {
    if (!code) {
      setMessage("Vui lòng nhập mã nhân viên.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`https://backend-kappa-jade.vercel.app/api/${type}`, {
        code,
      });
      setMessage(res.data.message);

      // Khi thành công, lưu code vào localStorage
      if (
        res.data.message &&
        /(thành công|success|chấm công vào|chấm công ra)/i.test(res.data.message)
      ) {
        localStorage.setItem("attendance_user_code", code.trim());
        setShowTick(true);
        setTimeout(() => setShowTick(false), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    setCode("");
    localStorage.removeItem("attendance_user_code");
  };

  return (
    <div className="attendance-bg-modern">
      <div className="attendance-modern-card">
        <h2>Chấm công</h2>
        <div className="modern-desc">
          Nhập mã nhân viên để <b>chấm công vào</b> hoặc <b>chấm công ra</b>.
        </div>
        <div className="attendance-modern-input-wrap">
          <span className="attendance-modern-icon-user">
            <svg width="22" height="22" fill="none"><circle cx="11" cy="7" r="4.2" stroke="#7367ff" strokeWidth="2"/><ellipse cx="11" cy="16.2" rx="7.2" ry="4.2" stroke="#7367ff" strokeWidth="2"/></svg>
          </span>
          <input
            type="text"
            placeholder="Nhập mã nhân viên"
            className="attendance-modern-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading || showTick}
            autoFocus
          />
        </div>

        <div className="attendance-modern-btn-group">
          <button
            className="attendance-modern-btn"
            onClick={() => handleCheck("checkin")}
            disabled={loading || showTick}
          >
            Chấm công vào
          </button>
          <button
            className="attendance-modern-btn checkout"
            onClick={() => handleCheck("checkout")}
            disabled={loading || showTick}
          >
            Chấm công ra
          </button>
        </div>

        {/* Thêm nút Đăng xuất nếu đã có code */}
        {code && (
          <div style={{ textAlign: "right", width: "100%" }}>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#e95454",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: 14,
                textDecoration: "underline",
                marginRight: -2
              }}
              onClick={handleLogout}
              tabIndex={-1}
            >Đổi mã nhân viên</button>
          </div>
        )}

        {message && (
          <div className="attendance-message">{message}</div>
        )}

        {showTick && (
          <div className="attendance-modern-tick-success">
            <div className="tick-animate-wrap">
              <svg className="tick-animate-svg" viewBox="0 0 46 46">
                <circle className="tick-animate-circle" cx="23" cy="23" r="20" />
                <path
                  className="tick-animate-path"
                  d="M14.5 24.5 L21.5 31 L32 17"
                />
              </svg>
            </div>
            <div className="attendance-modern-success-title">
              Chấm công thành công!
            </div>
            <div className="attendance-modern-success-desc">
              Hẹn gặp lại bạn vào ca tiếp theo 👋
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
