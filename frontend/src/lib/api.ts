export function setAccessToken(token: string | null) {
  const { setAccessToken } = require("@/store/useLoginStore").useLoginStore.getState();
  setAccessToken(token);
}

export function getAccessToken(): string | null {
  const { accessToken } = require("@/store/useLoginStore").useLoginStore.getState();
  return accessToken;
}

export function clearAccessToken() {
  const { clearAccessToken } = require("@/store/useLoginStore").useLoginStore.getState();
  clearAccessToken();
}

function extractBearerFromAuthHeader(value: string | null): string | null {
  if (!value) return null;
  const parts = value.split(" ");
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return value;
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const resp = await fetch("http://localhost:8080/api/v1/auth/token/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!resp.ok) return false;
    const newAuth = resp.headers.get("Authorization");
    const token = extractBearerFromAuthHeader(newAuth);
    if (token) {
      setAccessToken(token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const first = await fetch(input, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
  if (first.status !== 401) return first;

  // try refresh once
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    // refresh 실패 시 로그아웃 및 이동
    try {
      await backendLogout();
    } finally {
      clearAccessToken();
      if (typeof window !== "undefined") window.location.href = "/auth/login";
    }
    return first;
  }

  const newToken = getAccessToken();
  const headers2 = new Headers(init.headers || {});
  if (newToken) headers2.set("Authorization", `Bearer ${newToken}`);
  return fetch(input, { ...init, headers: headers2, credentials: init.credentials ?? "include" });
}

export async function backendLogout(): Promise<void> {
  try {
    await fetch("http://localhost:8080/api/v1/auth/token/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {}
}
