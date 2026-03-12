const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const REFRESH_TOKEN_KEY = 'px2_refresh_token'

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  username: string
}

export interface LoginResponse {
  username: string
}

export function getStoredRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setStoredRefreshToken(token: string | null): void {
  if (token) sessionStorage.setItem(REFRESH_TOKEN_KEY, token)
  else sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? '로그인에 실패했습니다.')
  }
  return res.json() as Promise<TokenResponse>
}

export async function refresh(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) throw new Error('Refresh failed')
  return res.json() as Promise<TokenResponse>
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit & { accessToken: string | null; onNewTokens?: (t: TokenResponse) => void }
): Promise<Response> {
  const { accessToken, onNewTokens, ...init } = options
  const headers = new Headers(init.headers)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  let res = await fetch(url, { ...init, headers })
  if (res.status === 401 && getStoredRefreshToken()) {
    try {
      const tokenRes = await refresh(getStoredRefreshToken()!)
      onNewTokens?.(tokenRes)
      setStoredRefreshToken(tokenRes.refreshToken)
      headers.set('Authorization', `Bearer ${tokenRes.accessToken}`)
      res = await fetch(url, { ...init, headers })
    } catch {
      // refresh failed – caller should redirect to login
    }
  }
  return res
}
