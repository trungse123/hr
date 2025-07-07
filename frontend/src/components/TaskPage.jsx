import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskPage.modern.css";

export default function TaskPage() {
  const [code, setCode] = useState("");          // Nhập mã NV
  const [userCode, setUserCode] = useState(null); // Đã xác thực
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Khi mở trang, tự lấy userCode từ localStorage nếu có
  useEffect(() => {
    const storedCode = localStorage.getItem('task_user_code');
    if (storedCode) {
      setUserCode(storedCode);
      setCode(storedCode);
    }
  }, []);

  // Lấy tasks khi đã xác thực code
  useEffect(() => {
    if (!userCode) return;
    const fetchTasks = async () => {
      try {
        const res = await axios.get("https://backend-kappa-jade.vercel.app/api/tasks", {
          params: { code: userCode },
        });
        setTasks(res.data);
      } catch (err) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [userCode]);

  // Xác nhận code (giả lập "đăng nhập" khi chấm công xong)
  const handleLogin = () => {
    if (!code) return;
    setUserCode(code.trim());
    localStorage.setItem('task_user_code', code.trim());
    setSuccess("");
  };

  // Hoàn thành tác vụ
  const completeTask = async (id) => {
    setLoading(true);
    try {
      await axios.put(`https://backend-kappa-jade.vercel.app/api/tasks/${id}/complete`);
      setTasks((old) =>
        old.map((t) => (t.id === id ? { ...t, completed: true } : t))
      );
      setSuccess("Đã hoàn thành tác vụ!");
      setTimeout(() => setSuccess(""), 1300);
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    setUserCode(null);
    localStorage.removeItem('task_user_code');
    setCode("");
    setTasks([]);
    setSuccess("");
  };

  return (
    <div className="task-bg-modern">
      <div className="task-modern-card">
        <h2>📝 Công việc trong ngày</h2>
        <div className="modern-desc">
          {userCode
            ? (
                <>
                  Xin chào <b>{userCode}</b>, đây là các nhiệm vụ bạn được giao hôm nay.<br />
                  Chúc bạn hoàn thành xuất sắc nhé!
                  <button
                    onClick={handleLogout}
                    style={{
                      float: "right",
                      marginTop: 4,
                      marginRight: -7,
                      background: "none",
                      border: "none",
                      color: "#c93e56",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: 14,
                      textDecoration: "underline",
                    }}
                    title="Đăng xuất"
                  >
                    Đăng xuất
                  </button>
                </>
              )
            : "Nhập mã nhân viên để xem các công việc được giao trong ngày."
          }
        </div>

        {!userCode && (
          <form
            className="task-modern-input-wrap"
            style={{ marginBottom: 28 }}
            onSubmit={e => { e.preventDefault(); handleLogin(); }}
          >
            <input
              type="text"
              placeholder="Nhập mã nhân viên (VD: NV001)"
              className="task-modern-input"
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={loading}
              autoFocus
              maxLength={12}
            />
            <button
              className="task-modern-btn"
              type="submit"
              disabled={!code.trim()}
            >
              Xác nhận
            </button>
          </form>
        )}

        {success && <div className="task-modern-success">{success}</div>}

        {userCode && (
          <div className="task-modern-tasklist">
            {tasks.length === 0 ? (
              <div className="task-modern-empty">
                Không có nhiệm vụ nào trong ngày.<br />Hãy liên hệ quản lý để được giao việc!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-modern-task-item${task.completed ? " done" : ""}`}
                >
                  <span>
                    {task.description}
                  </span>
                  {!task.completed && (
                    <button
                      className="task-modern-complete-btn"
                      onClick={() => completeTask(task.id)}
                      disabled={loading}
                    >
                      Hoàn thành
                    </button>
                  )}
                  {task.completed && (
                    <span style={{ color: "#36c686", fontWeight: 600 }}>✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
