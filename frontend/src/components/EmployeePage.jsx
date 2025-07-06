import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeePage.modern.css";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://hr-5ozw.onrender.com/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Lỗi lấy nhân viên", err);
    }
  };

  const addEmployee = async () => {
    if (!name || !code) return;
    try {
      await axios.post("https://hr-5ozw.onrender.com/api/employees", { name, code });
      setName("");
      setCode("");
      setMessage("Đã thêm nhân viên.");
      fetchEmployees();
    } catch (err) {
      setMessage("Lỗi khi thêm nhân viên.");
    }
    setTimeout(() => setMessage(""), 2100);
  };

  // XÓA NHÂN VIÊN
  const deleteEmployee = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) return;
    try {
      await axios.delete(`https://hr-5ozw.onrender.com/api/employees/${id}`);
      setMessage("Đã xóa nhân viên.");
      fetchEmployees();
    } catch (err) {
      setMessage("Lỗi khi xóa nhân viên.");
    }
    setTimeout(() => setMessage(""), 2100);
  };

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div className="employee-bg">
      <div className="employee-card">
        <h2>👤 Quản lý nhân viên</h2>
        <form className="employee-form"
          onSubmit={e => { e.preventDefault(); addEmployee(); }}>
          <input
            type="text"
            placeholder="Tên nhân viên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            required
          />
          <input
            type="text"
            placeholder="Mã nhân viên"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={12}
            required
          />
          <button type="submit" className="employee-btn">Thêm</button>
        </form>
        <div className="employee-message">{message}</div>
        <div className="employee-list">
          {employees.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center" }}>
              Chưa có nhân viên nào.
            </div>
          ) : (
            employees.map((e) => (
              <div className="employee-item" key={e.id}>
                <div className="employee-info">
                  <div className="employee-name">{e.name}</div>
                  <div className="employee-code">{e.code}</div>
                </div>
                <button
                  className="employee-delete-btn"
                  title="Xóa nhân viên"
                  onClick={() => deleteEmployee(e.id)}
                >Xóa</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
