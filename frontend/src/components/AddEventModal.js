import React, { useState } from "react";
import axios from "axios";

export default function AddEventModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date) return;
    await axios.post("http://127.0.0.1:5000/api/events", {
      title,
      event_date: date,
      notes: desc,
    });
    setTitle("");
    setDate("");
    setDesc("");
    onAdd && onAdd();
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl relative">
        <div className="font-bold text-lg mb-4 text-orange-500">Tạo sự kiện</div>
        <form onSubmit={handleSubmit}>
          <input
            className="border p-2 mb-2 w-full rounded"
            placeholder="Tên sự kiện"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            className="border p-2 mb-2 w-full rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            className="border p-2 mb-3 w-full rounded"
            placeholder="Ghi chú"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="bg-gray-100 px-4 py-2 rounded"
              onClick={onClose}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
