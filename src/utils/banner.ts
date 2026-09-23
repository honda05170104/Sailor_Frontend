import { requestJson } from './api'

export type Banner = {
  id: string
  imageUrl: string
  linkUrl?: string
  sortOrder?: number
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export type GetBannersResponse = {
  banners: Banner[]
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export function getBannersApi() {
  return requestJson<GetBannersResponse>(`${API_BASE_URL}/api/v1/banners`, {
    method: 'GET',
    errorMessage: '取得輪播失敗',
  })
}
