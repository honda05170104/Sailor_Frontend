import { requestJson } from './api'
import { setAuthToken } from './auth'

export type VipTier = {
  id: string
  name: string
  slug: string
  rank: number
  minSpend: number
  pointsRate?: number
  discountPercent: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type UserTag = {
  id?: string
  name?: string
  slug?: string
}

export type Product = {
  id: string
  name: string
  description?: string
  categoryId?: string | null
  category?: {
    id?: string
    name?: string
    enabled?: boolean
  } | null
  enabled?: boolean
  sort?: number
}

export type ProductCategory = {
  id: string
  name: string
  description?: string
  enabled?: boolean
  sort?: number
  products?: Product[]
}

export type GetProductsResponse = {
  categories: ProductCategory[]
  products: Product[]
  productIds: string[]
}

export type UpdateProductsPayload = {
  productIds: string[]
}

export type UpdateProductsResponse = {
  user: UserProfile
}

export type UserProfile = {
  id: string
  lineUserId: string
  displayName: string
  realName?: string
  mobile?: string
  birthday?: string
  address?: string
  avatarUrl: string
  avatarSource?: 'line' | null
  vip?: VipTier | null
  nextVip?: VipTier | null
  spendToNext?: number
  /** 金卡／黑卡或舊會員保護截止日；一般會員為 null */
  vipExpiresAt?: string | null
  vipProgress?: {
    yearSpend?: number
    nextVip?: VipTier | null
    spendToNext?: number
    vipExpiresAt?: string | null
    goldProtectExpiresAt?: string | null
  } | null
  prepaidFeed?: number
  storedCredit?: number
  totalSpend?: number
  couponCount?: number
  tags?: UserTag[]
  products?: Product[]
  profileCompleteness?: {
    isComplete: boolean
    missing: string[]
    completedCount: number
    totalRequired: number
  }
  createdAt?: string
  updatedAt?: string
}

export type LoginWithLineResponse = {
  token: string
  user: UserProfile
  isNew: boolean
}

export type GetUserResponse = {
  user: UserProfile
  tagOptions?: UserTag[]
}

export type UpdateUserPayload = {
  mobile: string
  birthday: string
}

export type TransactionItem = {
  name: string
  sku?: string
  barcode?: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type TransactionBranch = {
  id: string
  name: string
  type?: string
}

export type Transaction = {
  id: string
  user?: string
  branch?: TransactionBranch
  txnNo?: string
  pickupNo?: string
  orderNo?: string
  customerName?: string
  customerMobile?: string
  source?: string
  orderStatus?: string
  orderStatusLabel?: string
  paymentStatus?: string
  shippingStatus?: string
  tags?: string
  paymentMethod?: string
  totalAmount: number
  invoice?: string
  staff?: string
  note?: string
  externalOrderId?: string
  items?: TransactionItem[]
  importedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type GetTransactionsResponse = {
  transactions: Transaction[]
}

export type GetVipsResponse = {
  vips: VipTier[]
}

export type CouponStatus = 'available' | 'used' | 'expired' | string

export type Coupon = {
  id: string
  couponId?: string
  name: string
  description?: string
  type: 'amount' | 'percent' | string
  value: number
  minSpend?: number
  status: CouponStatus
  issuedAt?: string
  expiresAt?: string | null
  usedAt?: string | null
}

export type GetCouponsResponse = {
  couponCount: number
  coupons: Coupon[]
}

export function isProfileIncomplete(user?: Pick<UserProfile, 'mobile' | 'birthday'> | null) {
  return !user?.mobile?.trim() || !user?.birthday?.trim()
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)
const USER_PATH = '/api/v1/user'

function getEndpoint(path: string) {
  return `${API_BASE_URL}${USER_PATH}${path}`
}

export async function loginWithLineApi(accessToken: string) {
  const data = await requestJson<LoginWithLineResponse>(
    getEndpoint('/lineLogin'),
    {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
      errorMessage: 'LINE 登入失敗',
    },
  )

  if (!data?.token) {
    throw new Error('登入回應缺少 token')
  }

  setAuthToken(data.token)
  return data
}

export function getUserApi() {
  return requestJson<GetUserResponse>(getEndpoint('/getUser'), {
    method: 'GET',
    auth: true,
    errorMessage: '取得使用者資料失敗',
  })
}

export async function updateUserApi(payload: UpdateUserPayload) {
  return requestJson<GetUserResponse>(getEndpoint('/updateUser'), {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
    errorMessage: '更新資料失敗',
  })
}

export function getTransactionsApi() {
  return requestJson<GetTransactionsResponse>(getEndpoint('/getTransaction'), {
    method: 'GET',
    auth: true,
    errorMessage: '取得交易紀錄失敗',
  })
}

export function getVipsApi() {
  return requestJson<GetVipsResponse>(getEndpoint('/getVip'), {
    method: 'GET',
    auth: true,
    errorMessage: '取得會員權益失敗',
  })
}

export function getCouponsApi() {
  return requestJson<GetCouponsResponse>(getEndpoint('/getCoupon'), {
    method: 'GET',
    auth: true,
    errorMessage: '取得優惠券失敗',
  })
}

export function getProductsApi() {
  return requestJson<GetProductsResponse>(getEndpoint('/products'), {
    method: 'GET',
    auth: true,
    errorMessage: '取得物種失敗',
  })
}

export function updateProductsApi(payload: UpdateProductsPayload) {
  return requestJson<UpdateProductsResponse>(getEndpoint('/products'), {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
    errorMessage: '儲存喜歡的物種失敗',
  })
}

export function logoutApi() {
  return requestJson<null>(getEndpoint('/logout'), {
    method: 'POST',
    auth: true,
    errorMessage: '登出失敗',
  })
}
