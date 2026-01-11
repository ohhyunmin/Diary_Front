// src/axios.js
import axios from 'axios'
import { useAuthStore } from "./authStore"
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const api =axios.create({
  baseURL: 'https://localhost:7290',
  withCredentials: true // ⭐⭐⭐ 필수
})

api.interceptors.request.use(config => {
  
  const store = useAuthStore()
  if (store.accessToken) {
    console.log("Request : ", store.accessToken);
    config.headers.Authorization = `Bearer ${store.accessToken}`
  }else{
    console.log("Request : XXXXXXXXXXXXXX", store.accessToken);
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    const store = useAuthStore()
    if (err.response?.status === 401) {
      const refreshToken = cookies.get("refreshToken");
      if (refreshToken) {
        const res = await api.get("api/login/refresh_token")
        console.log(res.data);
        store.setToken(res.data.accessToken)
        err.config.headers.Authorization =
          `Bearer ${res.data.accessToken}`
        return api(err.config)
      }
    }
    return Promise.reject(err)
  }
)

export default api