import axios from 'axios'
import { API_BASE_URL } from './apiConfig.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'APIへの接続に失敗しました。'
    return Promise.reject(new Error(message))
  },
)

export async function getMemos() {
  const { data } = await api.get('/memos')
  return data
}

export async function getPublicMemos() {
  const { data } = await api.get('/memos/public')
  return data
}

export async function likePublicMemo(id) {
  const { data } = await api.post(`/memos/public/${id}/like`)
  return data
}

export async function unlikePublicMemo(id) {
  const { data } = await api.delete(`/memos/public/${id}/like`)
  return data
}

export async function getMemo(id) {
  const { data } = await api.get(`/memos/${id}`)
  return data
}

export async function createMemo(memo) {
  const { data } = await api.post('/memos', memo)
  return data
}

export async function updateMemo(id, memo) {
  const { data } = await api.put(`/memos/${id}`, memo)
  return data
}

export async function deleteMemo(id) {
  await api.delete(`/memos/${id}`)
}
