import axios from 'axios'
import { API_BASE_URL } from './apiConfig.js'

const api = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = new Error(error.response?.data?.error || '認証APIへの接続に失敗しました。')
    apiError.status = error.response?.status
    return Promise.reject(apiError)
  },
)

export async function register(credentials) {
  const { data } = await api.post('/register', credentials)
  return data.user
}

export async function login(credentials) {
  const { data } = await api.post('/login', credentials)
  return data.user
}

export async function logout() {
  const { data } = await api.post('/logout')
  return data
}

export async function getCurrentUser() {
  const { data } = await api.get('/me')
  return data.user
}
