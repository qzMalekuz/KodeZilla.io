import type { JwtPayload } from "../types";

export const storageKeys = {
  apiBase: "contest-platform-api-base",
  token: "contest-platform-token",
} as const;

export function getDefaultApiBase(): string {
  if (typeof window === "undefined") {
    return "/api";
  }

  return `${window.location.origin}/api`;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as JwtPayload;
  } catch {
    return null;
  }
}

export function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function toIsoLocal(value: FormDataEntryValue | null): string {
  return new Date(String(value)).toISOString();
}
