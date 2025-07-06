import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPage.css";

// Helper
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

function Calendar({ markedDates = [], selected, onSelect, monthYear, onMonthChange }) {
  const currYear = monthYear.year, currMonth = monthYear.month;
  const selDate = selected ? new Date(selected) : new Date();
  const daysInMonth = getDaysInMonth(currMonth, currYear);
  const firstDay = getFirstDayOfMonth(currMonth, currYear);

  const markedSet = new Set(markedDates
    .filter(date => {
      const d = new Date(date);
      return d.getFullYear() === currYear && d.getMonth() === currMonth;
    })
    .map(date => Number(new Date(date).getDate()))
  );
  const weeks = [];
  let week = [];
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  while (week.length < 7) week.push(null);
  weeks.push(week);

  const prevMonth = () => {
    let m = currMonth - 1, y = currYear;
    if (m < 0) { m = 11; y--; }
    onMonthChange({ year: y, month: m });
  };
  const nextMonth = () => {
    let m = currMonth + 1, y = currYear;
    if (m > 11) { m = 0; y++; }
    onMonthChange({ year: y, month: m });
  };

  return (
    <div className="calendar-root">
      <div className="calendar-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <button className="calendar-nav-btn" onClick={prevMonth}>&lt;</button>
        <b>{currMonth + 1}/{currYear}</b>
        <button className="calendar-nav-btn" onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-days">{"CN T2 T3 T4 T5 T6 T7".split(" ").map(d => <span key={d}>{d}</span>)}</div>
      <div className="calendar-weeks">
        {weeks.map((w, i) =>
          <div className="calendar-week" key={i}>
            {w.map((d, j) => {
              const isSelected = d && selDate.getFullYear() === currYear && selDate.getMonth() === currMonth && selDate.getDate() === d;
              const hasMark = markedSet.has(d);
              return (
                <span
                  key={j}
                  className={
                    "calendar-cell"
                    + (isSelected ? " selected" : "")
                    + (hasMark ? " event" : "")
                  }
                  onClick={() => d && onSelect(`${currYear}-${(currMonth + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`)}
                >
                  {d || ""}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Chuẩn hóa ngày yyyy-mm-dd
const formatDate = (d) => {
  if (!d) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    return dt.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

function AdminPage() {
  // Tab State
  const [tab, setTab] = useState(0);

  // Chấm công
  const today = new Date();
  const [attendanceMonth, setAttendanceMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState([]);
  const [attendanceMarkedDates, setAttendanceMarkedDates] = useState([]);

  // Tác vụ
  const [taskMonth, setTaskMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedTaskDate, setSelectedTaskDate] = useState(today.toISOString().slice(0, 10));
  const [tasks, setTasks] = useState([]);
  const [tasksMarkedDates, setTasksMarkedDates] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ code: "", description: "" });

  // Sự kiện
  const [eventMonth, setEventMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [calendarDate, setCalendarDate] = useState(today.toISOString().slice(0, 10));
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", event_date: today.toISOString().slice(0, 10), notes: "" });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Chấm công - fetch ngày có data trong tháng và data của ngày chọn
  useEffect(() => {
    const monthStr = `${attendanceMonth.year}-${(attendanceMonth.month + 1).toString().padStart(2, "0")}`;
    axios.get("https://hr-5ozw.onrender.com/api/attendance/dates-in-month", { params: { month: monthStr } })
      .then(res => setAttendanceMarkedDates(res.data || []));
  }, [attendanceMonth]);

  useEffect(() => {
    setLoading(true);
    axios.get("https://hr-5ozw.onrender.com/api/attendance/all", { params: { date: selectedDate } })
      .then(res => setAttendance(res.data))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const handleSelectAttendanceDate = dateStr => {
    setSelectedDate(dateStr);
    const d = new Date(dateStr);
    if (d.getFullYear() !== attendanceMonth.year || d.getMonth() !== attendanceMonth.month) {
      setAttendanceMonth({ year: d.getFullYear(), month: d.getMonth() });
    }
  };

  // Tác vụ - fetch ngày có data trong tháng và data của ngày chọn
  useEffect(() => {
    const monthStr = `${taskMonth.year}-${(taskMonth.month + 1).toString().padStart(2, "0")}`;
    axios.get("https://hr-5ozw.onrender.com/api/tasks/dates-in-month", { params: { month: monthStr } })
      .then(res => setTasksMarkedDates(res.data || []));
  }, [taskMonth]);

  useEffect(() => {
    setLoading(true);
    axios.get("https://hr-5ozw.onrender.com/api/tasks/all", { params: { date: selectedTaskDate } })
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, [selectedTaskDate]);

  const handleSelectTaskDate = dateStr => {
    setSelectedTaskDate(dateStr);
    const d = new Date(dateStr);
    if (d.getFullYear() !== taskMonth.year || d.getMonth() !== taskMonth.month) {
      setTaskMonth({ year: d.getFullYear(), month: d.getMonth() });
    }
  };

  // === SAO CHÉP TÁC VỤ ĐẾN CUỐI THÁNG ===
  const handleDuplicateTasks = async () => {
    if (!window.confirm("Bạn muốn sao chép tất cả tác vụ ngày này cho toàn bộ ngày còn lại của tháng?")) return;
    try {
      await axios.post("https://hr-5ozw.onrender.com/api/tasks/duplicate-to-end-of-month", {
        date: selectedTaskDate
      });
      // reload task, reload ngày có task của tháng
      const res = await axios.get("https://hr-5ozw.onrender.com/api/tasks/all", { params: { date: selectedTaskDate } });
      setTasks(res.data);
      const d = new Date(selectedTaskDate);
      const monthStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const dres = await axios.get("https://hr-5ozw.onrender.com/api/tasks/dates-in-month", { params: { month: monthStr } });
      setTasksMarkedDates(dres.data || []);
      alert("Sao chép thành công!");
    } catch (e) {
      alert("Sao chép thất bại!");
    }
  };

  // === XÓA TÁC VỤ ===
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Bạn có chắc muốn xóa tác vụ này?")) return;
    try {
      await axios.delete(`https://hr-5ozw.onrender.com/api/tasks/${taskId}`);
      // Reload task & calendar
      const res = await axios.get("https://hr-5ozw.onrender.com/api/tasks/all", { params: { date: selectedTaskDate } });
      setTasks(res.data);
      const d = new Date(selectedTaskDate);
      const monthStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const dres = await axios.get("https://hr-5ozw.onrender.com/api/tasks/dates-in-month", { params: { month: monthStr } });
      setTasksMarkedDates(dres.data || []);
    } catch {
      alert("Xóa thất bại!");
    }
  };

  // Sự kiện (all event trong db)
  useEffect(() => {
    setLoading(true);
    axios.get("https://hr-5ozw.onrender.com/api/events")
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  }, [tab]);

  const handleSelectEventDate = dateStr => {
    setCalendarDate(dateStr);
    const d = new Date(dateStr);
    if (d.getFullYear() !== eventMonth.year || d.getMonth() !== eventMonth.month) {
      setEventMonth({ year: d.getFullYear(), month: d.getMonth() });
    }
  };

  // Tạo tác vụ
  const handleCreateTask = async () => {
    try {
      await axios.post("https://hr-5ozw.onrender.com/api/tasks", {
        code: taskForm.code,
        description: taskForm.description
      });
      setShowTaskModal(false);
      setTaskForm({ code: "", description: "" });
      const res = await axios.get("https://hr-5ozw.onrender.com/api/tasks/all", { params: { date: selectedTaskDate } });
      setTasks(res.data);
    } catch (err) {
      alert("Lỗi khi tạo task!");
    }
  };

  // Tạo sự kiện
  const handleCreateEvent = async () => {
    try {
      await axios.post("https://hr-5ozw.onrender.com/api/events", {
        title: eventForm.title,
        event_date: formatDate(eventForm.event_date),
        notes: eventForm.notes
      });
      setShowEventModal(false);
      setEventForm({ title: "", event_date: today.toISOString().slice(0, 10), notes: "" });
      const evRes = await axios.get("https://hr-5ozw.onrender.com/api/events");
      setEvents(evRes.data);
    } catch (err) {
      alert("Lỗi khi tạo sự kiện!");
    }
  };

  // Xoá sự kiện
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sự kiện này?")) return;
    try {
      await axios.delete(`https://hr-5ozw.onrender.com/api/events/${id}`);
      const evRes = await axios.get("https://hr-5ozw.onrender.com/api/events");
      setEvents(evRes.data);
    } catch (err) {
      alert("Không thể xoá sự kiện!");
    }
  };

  // Event detail theo ngày chọn calendar
  const eventsOfCalendarDate = events.filter(ev => ev.event_date === calendarDate);

  return (
    <div className="ad-root">
      <div className="ad-card">
        <div className="ad-title">
          <span className="ad-logo"></span>
          HỆ THỐNG QUẢN TRỊ NHÂN SỰ
        </div>
        {/* Tabs */}
        <div className="ad-tabs">
          <button className={tab === 0 ? "ad-tab active" : "ad-tab"} onClick={() => setTab(0)}>Bảng chấm công</button>
          <button className={tab === 1 ? "ad-tab active" : "ad-tab"} onClick={() => setTab(1)}>Danh sách tác vụ</button>
          <button className={tab === 2 ? "ad-tab active" : "ad-tab"} onClick={() => setTab(2)}>Sự kiện</button>
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            {/* TAB 1: Chấm công */}
            {tab === 0 && (
              <section className="ad-section" style={{ padding: 0 }}>
                <div className="event-layout">
                  <div className="event-detail">
                    <div className="ad-checklist-title">📅 Bảng chấm công</div>
                    <div style={{ marginBottom: 10, color: "#007bff" }}><b>Ngày:</b> {selectedDate}</div>
                    {attendance.length === 0 ? (
                      <p className="ad-empty">Không có dữ liệu chấm công ngày này.</p>
                    ) : (
                      <table className="ad-table" style={{ marginTop: 8 }}>
                        <thead>
                          <tr>
                            <th>Tên nhân viên</th>
                            <th>Mã NV</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.name}</td>
                              <td>{item.code}</td>
                              <td>{item.check_in || "Chưa vào"}</td>
                              <td>{item.check_out || "Chưa ra"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="event-calendar">
                    <Calendar
                      markedDates={attendanceMarkedDates}
                      selected={selectedDate}
                      onSelect={handleSelectAttendanceDate}
                      monthYear={attendanceMonth}
                      onMonthChange={setAttendanceMonth}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* TAB 2: Danh sách tác vụ */}
            {tab === 1 && (
              <section className="ad-section" style={{ padding: 0 }}>
                <div className="event-layout">
                  <div className="event-detail">
                    <div className="ad-checklist-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                      <span>📝 Danh sách tác vụ</span>
                      <div>
                        <button className="ad-btn" style={{ marginRight: 8 }} onClick={handleDuplicateTasks}>
                          Sao chép tác vụ đến cuối tháng
                        </button>
                        <button className="ad-btn" onClick={() => setShowTaskModal(true)}>+ Tạo tác vụ</button>
                      </div>
                    </div>
                    <div style={{ marginBottom: 10, color: "#007bff" }}><b>Ngày:</b> {selectedTaskDate}</div>
                    {tasks.length === 0 ? (
                      <p className="ad-empty">Không có tác vụ nào trong ngày này.</p>
                    ) : (
                      <table className="ad-table" style={{ marginTop: 8 }}>
                        <thead>
                          <tr>
                            <th>Tên nhân viên</th>
                            <th>Mã NV</th>
                            <th>Nội dung</th>
                            <th>Hoàn thành</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task, idx) => (
                            <tr key={idx}>
                              <td>{task.name}</td>
                              <td>{task.code}</td>
                              <td>{task.description}</td>
                              <td>{task.completed ? "✅" : "❌"}</td>
                              <td>
                                <button
                                  className="ad-btn ad-btn-danger"
                                  style={{ padding: "4px 10px" }}
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {/* Modal tạo task */}
                    {showTaskModal && (
                      <div className="ad-modal">
                        <div className="ad-modal-content">
                          <h3>Tạo tác vụ mới</h3>
                          <input placeholder="Mã NV" value={taskForm.code}
                            onChange={e => setTaskForm({ ...taskForm, code: e.target.value })} />
                          <input placeholder="Nội dung" value={taskForm.description}
                            onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
                          <div className="ad-modal-actions">
                            <button className="ad-btn" onClick={handleCreateTask}>Tạo</button>
                            <button className="ad-btn" onClick={() => setShowTaskModal(false)}>Huỷ</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="event-calendar">
                    <Calendar
                      markedDates={tasksMarkedDates}
                      selected={selectedTaskDate}
                      onSelect={handleSelectTaskDate}
                      monthYear={taskMonth}
                      onMonthChange={setTaskMonth}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: Sự kiện */}
            {tab === 2 && (
              <section className="ad-section" style={{ padding: 0 }}>
                <div className="event-layout">
                  <div className="event-detail">
                    <div className="ad-checklist-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>🎉 Sự kiện</span>
                      <button className="ad-btn" onClick={() => {
                        setEventForm({ ...eventForm, event_date: calendarDate });
                        setShowEventModal(true);
                      }}>+ Tạo sự kiện</button>
                    </div>
                    <div style={{ marginBottom: 10, color: "#007bff" }}><b>Ngày:</b> {calendarDate}</div>
                    {eventsOfCalendarDate.length === 0
                      ? <p style={{ marginTop: 8 }}>Không có sự kiện nào.</p>
                      : (
                        <ul style={{ marginTop: 8 }}>
                          {eventsOfCalendarDate.map(ev => (
                            <li key={ev.id} style={{ marginBottom: 18 }}>
                              <b style={{ fontSize: 18 }}>{ev.title}</b>
                              {ev.notes && <div style={{ marginTop: 4, fontStyle: "italic", color: "#333" }}>{ev.notes}</div>}
                              <div>
                                <button
                                  className="ad-btn ad-btn-danger"
                                  style={{ marginTop: 7, background: "#e84545" }}
                                  onClick={() => handleDeleteEvent(ev.id)}
                                >
                                  Xoá sự kiện
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )
                    }
                  </div>
                  <div className="event-calendar">
                    <Calendar
                      markedDates={events.map(ev => ev.event_date)}
                      selected={calendarDate}
                      onSelect={handleSelectEventDate}
                      monthYear={eventMonth}
                      onMonthChange={setEventMonth}
                    />
                  </div>
                </div>
                {showEventModal && (
                  <div className="ad-modal">
                    <div className="ad-modal-content">
                      <h3>Tạo sự kiện mới</h3>
                      <input placeholder="Tên sự kiện" value={eventForm.title}
                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
                      <input type="date" value={eventForm.event_date}
                        onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })} />
                      <textarea placeholder="Ghi chú" value={eventForm.notes}
                        onChange={e => setEventForm({ ...eventForm, notes: e.target.value })} />
                      <div className="ad-modal-actions">
                        <button className="ad-btn" onClick={handleCreateEvent}>Tạo</button>
                        <button className="ad-btn" onClick={() => setShowEventModal(false)}>Huỷ</button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <div className="ad-footer">© 2025 Quản lý bởi bạn & CodeGPT</div>
      </div>
    </div>
  );
}

export default AdminPage;
