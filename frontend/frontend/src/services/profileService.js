import axios from "axios";

const API = "http://localhost:5000/api/profile";

export const getProfile = (token) =>
  axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveProfile = (data, token) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
