const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

interface RequestOptions extends RequestInit {
  query?: Record<string, string>
}

function buildUrl(path: string, query?: Record<string, string>): string {
  const base = API_BASE ? `${API_BASE}${path}` : path
  if (!query) {
    return base
  }

  const params = new URLSearchParams(query)
  return `${base}?${params.toString()}`
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json?.error ?? `Request failed with status ${response.status}`)
  }

  return json as T
}
