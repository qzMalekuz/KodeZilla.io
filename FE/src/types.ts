import type { FormEvent, RefObject } from "react";

export type AuthMode = "login" | "signup";
export type Role = "creator" | "contestee";
export type HealthTone = "pending" | "success" | "error";

export interface HealthState {
  label: string;
  tone: HealthTone;
}

export interface JwtPayload {
  userId?: string;
  role?: Role;
  exp?: number;
  iat?: number;
}

export interface ContestSummary {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  creatorId: string;
  creatorName: string;
  mcqCount: number;
  dsaCount: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface AuthSectionProps {
  apiBase: string;
  authRef: RefObject<HTMLElement | null>;
  authMode: AuthMode;
  onApiBaseChange: (value: string) => void;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onModeChange: (mode: AuthMode) => void;
  onSignup: (event: FormEvent<HTMLFormElement>) => void;
}

export interface DashboardSectionProps {
  consoleOutput: string;
  contestDetail: string;
  contestId: string;
  contests: ContestSummary[];
  dashboardRef: RefObject<HTMLElement | null>;
  isAuthenticated: boolean;
  isCreator: boolean;
  leaderboardOutput: string;
  onContestIdChange: (value: string) => void;
  onCreateContest: (event: FormEvent<HTMLFormElement>) => void;
  onLoadContestDetail: () => void;
  onLoadLeaderboard: () => void;
  onLogout: () => void;
  onRefreshContests: () => void;
  onSelectContest: (contestId: string) => void;
  payload: JwtPayload | null;
  showCreatorForm: boolean;
  toggleCreatorForm: () => void;
}

export interface LandingSectionProps {
  apiBase: string;
  contestCount: number;
  health: HealthState;
  isAuthenticated: boolean;
  onPrimaryAction: () => void;
  payload: JwtPayload | null;
}

export interface SiteHeaderProps {
  isAuthenticated: boolean;
  onPrimaryAction: () => void;
}
