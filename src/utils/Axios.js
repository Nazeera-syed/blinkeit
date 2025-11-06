// src/utils/axiosInstance.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const Axios = axios.create({

  baseURL: import.meta.env.VITE_API_URL, // 👈 change to your backend API base
  withCredentials: true,
});

// Attach Firebase ID token before every request
Axios.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const idToken = await user.getIdToken(); // Firebase auto refreshes if expired
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
