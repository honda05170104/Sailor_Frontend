import { clearAuthToken, getAuthToken } from './auth'

type ApiSuccessResponse<T> = {
  status?: string
  code?: number
  data?: T
  message?: string
}

type ApiErrorField = {
  field?: string | null
  message?: string
}

type ApiErrorResponse = {
  status?: string
  code?: number
  message?: string
  error?: {
    message?: string
    data?: ApiErrorField[]
  }
}

type RequestJsonOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit
  errorMessage?: string
  auth?: boolean
}

export class ApiError extends Error {
  code?: number

  constructor(message: string, code?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

function extractErrorMessage(body: ApiErrorResponse | null, fallback: string) {
  const fieldErrors = body?.error?.data
    ?.map((item) => item.message?.trim())
    .filter((message): message is string => Boolean(message))

  if (fieldErrors?.length) return fieldErrors.join(' / ')

  return body?.error?.message?.trim() || body?.message?.trim() || fallback
}

function buildHeaders(init?: RequestJsonOptions) {
  const headers = new Headers(init?.headers)

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (init?.auth) {
    const token = getAuthToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

function redirectToLogin() {
  clearAuthToken()
  if (window.location.pathname === '/login') return
  window.location.assign('/login')
}

export async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestJsonOptions,
) {
  const fallbackErrorMessage = init?.errorMessage ?? '操作失敗'
  const { auth: _auth, errorMessage: _errorMessage, ...requestInit } = init ?? {}

  try {
    const response = await fetch(input, {
      ...requestInit,
      headers: buildHeaders(init),
    })
    const body = (await response.json().catch(() => null)) as
      | ApiSuccessResponse<T>
      | ApiErrorResponse
      | null

    if (!response.ok || (body && 'status' in body && body.status === 'error')) {
      const errorBody = body as ApiErrorResponse
      const code = errorBody?.code || response.status

      if (response.status === 401 || code === 401) {
        redirectToLogin()
        throw new ApiError(extractErrorMessage(errorBody, 'Unauthorized'), 401)
      }

      throw new ApiError(
        extractErrorMessage(errorBody, fallbackErrorMessage),
        code,
      )
    }

    const successBody = body as ApiSuccessResponse<T> | null
    if (successBody && 'data' in successBody) {
      return successBody.data as T
    }

    return (successBody as T | null) ?? null
  } catch (error) {
    if (error instanceof ApiError) throw error
    const message = error instanceof Error ? error.message : fallbackErrorMessage
    throw new ApiError(message)
  }
}
