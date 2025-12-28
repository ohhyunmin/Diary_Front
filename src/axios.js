// src/axios.js
import axios from 'axios'

export default axios.create({
  baseURL: 'https://localhost:7290',
  withCredentials: true // ⭐⭐⭐ 필수
})
