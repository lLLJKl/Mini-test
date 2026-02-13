import axios from "axios"

export const api = axios.create({
  
  baseURL: import.meta.env.VITE_APP_FASTAPI_URL || "http://localhost:8001",
  withCredentials: true,
  
  headers: {
    "Content-Type": "application/json",
  },
})

export const formApi = axios.create({
  
  baseURL: import.meta.env.VITE_APP_FASTAPI_URL || "http://localhost:8001",
  withCredentials: true,
  
  headers: {
    "Content-Type": "multipart/form-data",
  },
})

console.log("API baseURL =", api.defaults.baseURL);