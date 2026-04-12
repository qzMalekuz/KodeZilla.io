import { useEffect, useMemo, useRef, useState } from "react";
import { decodeJwt, getDefaultApiBase, pretty, storageKeys, toIsoLocal } from "../lib/session";
import type { ApiEnvelope, AuthMode, ContestSummary, HealthState, JwtPayload } from "../types";

export function useContestPlatform() {
  const [apiBase, setApiBase] = useState<string>(
    () => localStorage.getItem(storageKeys.apiBase) || getDefaultApiBase(),
  );
  const [token, setToken] = useState<string>(() => localStorage.getItem(storageKeys.token) || "");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [health, setHealth] = useState<HealthState>({ label: "Checking API", tone: "pending" });
  const [consoleOutput, setConsoleOutput] = useState<string>(
    "Welcome. Sign in to load contests from the backend.",
  );
  const [contestList, setContestList] = useState<ContestSummary[]>([]);
  const [contestId, setContestId] = useState<string>("");
  const [contestDetail, setContestDetail] = useState<string>("");
  const [leaderboardOutput, setLeaderboardOutput] = useState<string>("");
  const [showCreatorForm, setShowCreatorForm] = useState<boolean>(false);
  const authRef = useRef<HTMLElement | null>(null);
  const dashboardRef = useRef<HTMLElement | null>(null);

  const payload = useMemo<JwtPayload | null>(() => decodeJwt(token), [token]);
  const isAuthenticated = Boolean(token);
  const isCreator = payload?.role === "creator";

  useEffect(() => {
    localStorage.setItem(storageKeys.apiBase, apiBase);
  }, [apiBase]);

  useEffect(() => {
    localStorage.setItem(storageKeys.token, token);
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const response = await fetch(`${apiBase}/health`);
        if (!response.ok) {
          throw new Error("API unavailable");
        }

        const data = (await response.json()) as ApiEnvelope<{ status?: string }>;
        if (!cancelled) {
          setHealth({
            label: data?.data?.status === "ok" ? "API online" : "Connected",
            tone: "success",
          });
        }
      } catch {
        if (!cancelled) {
          setHealth({
            label: "API offline",
            tone: "error",
          });
        }
      }
    }

    void checkHealth();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  useEffect(() => {
    if (!isAuthenticated) {
      setContestList([]);
      setContestDetail("");
      setLeaderboardOutput("");
      return;
    }

    void loadContests();
  }, [isAuthenticated]);

  function logResult(label: string, payloadValue: unknown) {
    setConsoleOutput(`${label}\n${pretty(payloadValue)}`);
  }

  async function api<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const data = (await response.json().catch(() => ({
      success: false,
      data: null,
      error: "INVALID_JSON_RESPONSE",
    }))) as ApiEnvelope<T>;

    logResult(`${options.method || "GET"} ${path} -> ${response.status}`, data);

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  }

  async function runAction(action: () => Promise<void>) {
    try {
      await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      logResult("Request error", { message });
    }
  }

  async function loadContests() {
    await runAction(async () => {
      const result = await api<ContestSummary[]>("/contests");
      setContestList(result.data || []);
    });
  }

  function clearSession() {
    setToken("");
    setContestId("");
    setContestList([]);
    setContestDetail("");
    setLeaderboardOutput("");
    setShowCreatorForm(false);
    setAuthMode("login");
    logResult("Session cleared", { authenticated: false });
  }

  return {
    api,
    apiBase,
    authMode,
    authRef,
    contestDetail,
    contestId,
    contestList,
    consoleOutput,
    dashboardRef,
    health,
    isAuthenticated,
    isCreator,
    leaderboardOutput,
    loadContests,
    logResult,
    payload,
    runAction,
    setApiBase,
    setAuthMode,
    setContestDetail,
    setContestId,
    setLeaderboardOutput,
    setShowCreatorForm,
    setToken,
    showCreatorForm,
    toIsoLocal,
    clearSession,
  };
}
