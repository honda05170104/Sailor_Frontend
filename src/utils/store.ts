import { requestJson } from './api'

export type Store = {
  id: string
  name: string
  address: string
  phone?: string
  lineUrl?: string
  hoursLabel?: string
  hours?: string
}

export type GetStoresResponse = {
  stores: Store[]
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export function getStoresApi() {
  return requestJson<GetStoresResponse>(`${API_BASE_URL}/api/v1/stores`, {
    method: 'GET',
    errorMessage: '取得門市資料失敗',
  })
}
