import React, { useState } from "react";
import axios from "axios";

export default function AddTaskModal({ open, onClose, onAdd }) {
  const [task, setTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;
    await axios.post("http://127.0.0.1:5000/api/tasks", {
      code: "NV001", // hoặc mở rộng để chọn mã nhân viên
      description: task,
    });
    setTask("");
    onAdd && onAdd();
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl relative">
        <div className="font-bold text-lg mb-4 text-orange-500">Thêm nhiệm vụ mới</div>
        <form onSubmit={handleSubmit}>
          <input
            className="border p-2 mb-3 w-full rounded"
            placeholder="Tên nhiệm vụ"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
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
