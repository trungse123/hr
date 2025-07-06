import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventPage.modern.css";

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}
function pad(n) { return n < 10 ? "0" + n : n; }

export default function EventPage() {
  const today = new Date();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Lấy sự kiện từ API
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Sự kiện của tháng đang xem
  const monthStr = `${calendarYear}-${pad(calendarMonth + 1)}`;
  const eventsByDay = {};
  events.forEach(ev => {
    if (ev.event_date.startsWith(monthStr)) {
      const day = Number(ev.event_date.split("-")[2]);
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  // Sự kiện của ngày được chọn
  const selectedDateStr = `${calendarYear}-${pad(calendarMonth + 1)}-${pad(selectedDay)}`;
  const selectedDayEvents = events.filter(ev => ev.event_date === selectedDateStr);

  // Tạo sự kiện
  const addEvent = async () => {
    if (!title || !date) return;
    try {
      await axios.post("http://127.0.0.1:5000/api/events", {
        title,
        event_date: date,
        notes,
      });
      setTitle("");
      setDate("");
      setNotes("");
      setMessage("Đã tạo sự kiện.");
      fetchEvents();
      // Nếu sự kiện tạo trong tháng hiện tại thì tự highlight
      const [y, m, d] = date.split("-").map(Number);
      if (y === calendarYear && m === calendarMonth + 1) setSelectedDay(d);
    } catch (err) {
      setMessage("Lỗi khi tạo sự kiện.");
    }
  };

  // Xoá sự kiện
  const deleteEvent = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/api/events/${id}`);
    fetchEvents();
  };

  // Tạo mảng ngày lịch
  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=CN
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; ++i) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; ++d) calendarCells.push(d);

  return (
    <div className="event-bg">
      <div className="event-calendar-card">
        <h2>Lịch sự kiện</h2>
        {/* Form tạo sự kiện */}
        <form
          className="event-calendar-form"
          onSubmit={e => { e.preventDefault(); addEvent(); }}>
          <input
            type="text"
            placeholder="Tên sự kiện"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={50}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ghi chú"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            maxLength={70}
          />
          <button type="submit">Thêm sự kiện</button>
        </form>
        {message && <div className="event-calendar-message">{message}</div>}

        {/* Calendar */}
        <div className="event-calendar-wrap">
          <div className="event-calendar-month">
            <button
              onClick={() => {
                if (calendarMonth === 0) {
                  setCalendarMonth(11); setCalendarYear(calendarYear - 1);
                } else setCalendarMonth(calendarMonth - 1);
              }}
              type="button"
              aria-label="Tháng trước"
            >&lt;</button>
            <div className="event-calendar-title">
              {`Tháng ${calendarMonth + 1}/${calendarYear}`}
            </div>
            <button
              onClick={() => {
                if (calendarMonth === 11) {
                  setCalendarMonth(0); setCalendarYear(calendarYear + 1);
                } else setCalendarMonth(calendarMonth + 1);
              }}
              type="button"
              aria-label="Tháng sau"
            >&gt;</button>
          </div>
          <div className="event-calendar-grid">
            {["CN","T2","T3","T4","T5","T6","T7"].map(d =>
              <div className="event-calendar-day" key={d}>{d}</div>
            )}
            {calendarCells.map((d, i) => d === null ? (
              <div className="event-calendar-cell" key={`empty-${i}`} />
            ) : (
              <div
                key={d}
                className={
                  "event-calendar-cell" +
                  (eventsByDay[d] ? " has-event" : "") +
                  (d === selectedDay ? " selected" : "")
                }
                onClick={() => setSelectedDay(d)}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        {/* Sự kiện trong ngày đã chọn */}
        <div className="event-eventlist">
          <div className="event-calendar-title" style={{fontSize:'1.05rem',margin:"8px 0 4px 0",color:"#ff9542",fontWeight:600}}>
            Sự kiện ngày {pad(selectedDay)}/{pad(calendarMonth+1)}/{calendarYear}
          </div>
          {selectedDayEvents.length === 0 ? (
            <div className="event-calendar-empty">
              Không có sự kiện nào.
            </div>
          ) : (
            selectedDayEvents.map(ev => (
              <div className="event-eventitem" key={ev.id}>
                <div className="event-eventitem-title">{ev.title}</div>
                <div className="event-eventitem-date">{ev.event_date}</div>
                {ev.notes && <div className="event-eventitem-notes">{ev.notes}</div>}
                <button
                  className="event-eventitem-delete"
                  onClick={() => deleteEvent(ev.id)}
                >Xoá</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
