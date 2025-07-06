import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api";

export const fetchEmployees = () =>
  axios.get(`${BASE_URL}/employees`).then(res => res.data);

export const fetchAttendance = (date) =>
  axios.get(`${BASE_URL}/attendance`, { params: { date } }).then(res => res.data);

export const fetchTasks = (code) =>
  axios.get(`${BASE_URL}/tasks`, { params: { code } }).then(res => res.data);

export const createTask = (data) =>
  axios.post(`${BASE_URL}/tasks`, data).then(res => res.data);

export const fetchEvents = () =>
  axios.get(`${BASE_URL}/events`).then(res => res.data);

export const createEvent = (data) =>
  axios.post(`${BASE_URL}/events`, data).then(res => res.data);
