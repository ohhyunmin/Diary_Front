// src/axios.js
import axios from 'axios'
import { useAuthStore } from "./authStore"
const api =axios.create({
  baseURL: 'https://localhost:7290',
  withCredentials: true // ⭐⭐⭐ 필수
})

api.interceptors.request.use(config => {
  
  const store = useAuthStore()
  if (store.accessToken) {
    console.log("Request : ", store.accessToken);
    config.headers.Authorization = `Bearer ${store.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    const store = useAuthStore()
    if (err.response?.status === 401) {
      const res = await api.get("api/login/refresh_token")
      console.log(res.data);
      store.setToken(res.data.accessToken)
      err.config.headers.Authorization =
        `Bearer ${res.data.accessToken}`
      return api(err.config)
    }
    return Promise.reject(err)
  }
)

export default api