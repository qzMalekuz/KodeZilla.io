import type { DashboardSectionProps } from "../types";

export function DashboardSection({
  consoleOutput,
  contestDetail,
  contestId,
  contests,
  dashboardRef,
  isAuthenticated,
  isCreator,
  leaderboardOutput,
  onContestIdChange,
  onCreateContest,
  onLoadContestDetail,
  onLoadLeaderboard,
  onLogout,
  onRefreshContests,
  onSelectContest,
  payload,
  showCreatorForm,
  toggleCreatorForm,
}: DashboardSectionProps) {
  return (
    <section className="dashboard-shell" id="dashboard" ref={dashboardRef}>
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>{isAuthenticated ? "Contest workspace" : "Sign in to access contests"}</h2>
          <p className="dashboard-subtext">
            {isAuthenticated
              ? `Signed in as ${payload?.role || "user"}. Contest data is pulled from the backend.`
              : "The contest routes are protected. Login is required before the dashboard can load data."}
          </p>
        </div>
        {isAuthenticated ? (
          <div className="dashboard-actions">
            <button className="button-link ghost-link compact-link" onClick={onRefreshContests} type="button">
              Refresh
            </button>
            <button className="button-link ghost-link compact-link" onClick={onLogout} type="button">
              Logout
            </button>
          </div>
        ) : null}
      </div>

      {!isAuthenticated ? (
        <div className="locked-panel">
          <strong>Dashboard locked</strong>
          <p>Login or signup first, then the contest list will be available here.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <section className="panel panel-wide">
            <div className="panel-heading">
              <h2>Contests</h2>
              <p>Select one from the list to inspect it in more detail.</p>
            </div>
            <div className="card-list">
              {contests.length ? (
                contests.map((contest) => (
                  <article
                    className={`contest-card contest-card-clickable${contestId === contest.id ? " contest-card-active" : ""}`}
                    key={contest.id}
                    onClick={() => onSelectContest(contest.id)}
                  >
                    <strong>{contest.title}</strong>
                    <div className="meta">{contest.description}</div>
                    <div className="meta-row">
                      <span>{contest.creatorName}</span>
                      <span>MCQs: {contest.mcqCount}</span>
                      <span>DSA: {contest.dsaCount}</span>
                    </div>
                  </article>
                ))
              ) : (
                <article className="contest-card">No contests found.</article>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Selected contest</h2>
              <p>Use the contest id below to load detail and leaderboard data.</p>
            </div>
            <div className="stack">
              <label>
                <span>Contest ID</span>
                <input
                  onChange={(event) => onContestIdChange(event.target.value)}
                  placeholder="Choose from the list or paste an id"
                  type="text"
                  value={contestId}
                />
              </label>
              <div className="toolbar toolbar-two">
                <button onClick={onLoadContestDetail} type="button">
                  Load details
                </button>
                <button onClick={onLoadLeaderboard} type="button">
                  Load leaderboard
                </button>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>{isCreator ? "Creator tools" : "Participant view"}</h2>
              <p>{isCreator ? "Creators can publish contests from here." : "Participants can browse and track contest progress here."}</p>
            </div>
            {isCreator ? (
              <>
                <button className="button-link ghost-link inline-button" onClick={toggleCreatorForm} type="button">
                  {showCreatorForm ? "Hide form" : "New contest"}
                </button>
                {showCreatorForm ? (
                  <form className="stack" onSubmit={onCreateContest}>
                    <label>
                      <span>Title</span>
                      <input name="title" required />
                    </label>
                    <label>
                      <span>Description</span>
                      <textarea name="description" required rows={4}></textarea>
                    </label>
                    <label>
                      <span>Start time</span>
                      <input name="startTime" required type="datetime-local" />
                    </label>
                    <label>
                      <span>End time</span>
                      <input name="endTime" required type="datetime-local" />
                    </label>
                    <button type="submit">Create contest</button>
                  </form>
                ) : null}
              </>
            ) : (
              <div className="info-card">
                <strong>Signed in successfully</strong>
                <p>Pick a contest, load the detail, and check the leaderboard from the panel next to this one.</p>
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Contest detail</h2>
              <p>Raw payload returned by the backend.</p>
            </div>
            <pre className="output compact">{contestDetail || "No contest loaded yet."}</pre>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Leaderboard</h2>
              <p>Ranking data for the selected contest.</p>
            </div>
            <pre className="output compact">{leaderboardOutput || "No leaderboard loaded yet."}</pre>
          </section>

          <section className="panel panel-wide">
            <div className="panel-heading">
              <h2>Request log</h2>
              <p>Helpful while checking the connection between frontend and backend.</p>
            </div>
            <pre className="output output-large">{consoleOutput}</pre>
          </section>
        </div>
      )}
    </section>
  );
}
