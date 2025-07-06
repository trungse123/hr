// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AttendancePage from "./components/AttendancePage";
import TaskPage from "./components/TaskPage";
import EventPage from "./components/EventPage";
import EmployeePage from "./components/EmployeePage";
import ExportPage from "./components/ExportPage";
import AdminPage from './components/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AttendancePage />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="events" element={<EventPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
