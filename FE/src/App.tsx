import type { FormEvent } from "react";
import { AuthSection } from "./components/AuthSection";
import { DashboardSection } from "./components/DashboardSection";
import { LandingSection } from "./components/LandingSection";
import { SiteHeader } from "./components/SiteHeader";
import { useContestPlatform } from "./hooks/useContestPlatform";

export function App() {
  const platform = useContestPlatform();

  function jumpToAuth() {
    platform.authRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function jumpToDashboard() {
    platform.dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void platform.runAction(async () => {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const result = await platform.api<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      platform.setToken(result.data.token);
      form.reset();
      jumpToDashboard();
    });
  }

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void platform.runAction(async () => {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const result = await platform.api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          role: formData.get("role"),
        }),
      });
      form.reset();
      platform.setAuthMode("login");
      platform.logResult("Signup success", result);
    });
  }

  function handleCreateContest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void platform.runAction(async () => {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const result = await platform.api("/contests", {
        method: "POST",
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          startTime: platform.toIsoLocal(formData.get("startTime")),
          endTime: platform.toIsoLocal(formData.get("endTime")),
        }),
      });
      form.reset();
      platform.setShowCreatorForm(false);
      await platform.loadContests();
      platform.logResult("Contest created", result);
    });
  }

  function handleLoadContestDetail() {
    void platform.runAction(async () => {
      if (!platform.contestId.trim()) {
        throw new Error("Choose a contest first.");
      }

      const result = await platform.api(`/contests/${platform.contestId.trim()}`);
      platform.setContestDetail(JSON.stringify(result.data, null, 2));
    });
  }

  function handleLoadLeaderboard() {
    void platform.runAction(async () => {
      if (!platform.contestId.trim()) {
        throw new Error("Choose a contest first.");
      }

      const result = await platform.api(`/contests/${platform.contestId.trim()}/leaderboard`);
      platform.setLeaderboardOutput(JSON.stringify(result.data, null, 2));
    });
  }

  return (
    <>
      <div className="ambient-orb orb-one"></div>
      <div className="ambient-orb orb-two"></div>

      <div className="page-shell">
        <SiteHeader
          isAuthenticated={platform.isAuthenticated}
          onPrimaryAction={platform.isAuthenticated ? jumpToDashboard : jumpToAuth}
        />
        <LandingSection
          apiBase={platform.apiBase}
          contestCount={platform.contestList.length}
          health={platform.health}
          isAuthenticated={platform.isAuthenticated}
          onPrimaryAction={platform.isAuthenticated ? jumpToDashboard : jumpToAuth}
          payload={platform.payload}
        />
        <AuthSection
          apiBase={platform.apiBase}
          authRef={platform.authRef}
          authMode={platform.authMode}
          onApiBaseChange={platform.setApiBase}
          onLogin={handleLogin}
          onModeChange={platform.setAuthMode}
          onSignup={handleSignup}
        />
        <DashboardSection
          consoleOutput={platform.consoleOutput}
          contestDetail={platform.contestDetail}
          contestId={platform.contestId}
          contests={platform.contestList}
          dashboardRef={platform.dashboardRef}
          isAuthenticated={platform.isAuthenticated}
          isCreator={platform.isCreator}
          leaderboardOutput={platform.leaderboardOutput}
          onContestIdChange={platform.setContestId}
          onCreateContest={handleCreateContest}
          onLoadContestDetail={handleLoadContestDetail}
          onLoadLeaderboard={handleLoadLeaderboard}
          onLogout={platform.clearSession}
          onRefreshContests={() => void platform.loadContests()}
          onSelectContest={platform.setContestId}
          payload={platform.payload}
          showCreatorForm={platform.showCreatorForm}
          toggleCreatorForm={() => platform.setShowCreatorForm((value) => !value)}
        />
      </div>
    </>
  );
}
