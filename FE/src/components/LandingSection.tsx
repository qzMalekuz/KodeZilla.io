import type { LandingSectionProps } from "../types";

export function LandingSection({
  apiBase,
  contestCount,
  health,
  isAuthenticated,
  onPrimaryAction,
  payload,
}: LandingSectionProps) {
  return (
    <>
      <section className="landing-hero" id="top">
        <div className="landing-copy">
          <p className="eyebrow">Contest Platform</p>
          <h1>A simple place to sign in and work with coding contests.</h1>
          <p className="hero-text">
            The flow is straightforward: start on the landing page, authenticate with the backend,
            then move into a contest dashboard that matches the signed-in role.
          </p>
          <div className="hero-actions">
            <button className="button-link primary-link" onClick={onPrimaryAction} type="button">
              {isAuthenticated ? "Go to dashboard" : "Login or signup"}
            </button>
            <a className="button-link ghost-link" href="#features">
              What you can do
            </a>
          </div>
          <div className="hero-metrics">
            <article className="metric-card">
              <strong>Landing page</strong>
              <span>Visitors get a clear entry point before they see app controls.</span>
            </article>
            <article className="metric-card">
              <strong>Backend auth</strong>
              <span>Signup and login use the existing API, not mock data.</span>
            </article>
            <article className="metric-card">
              <strong>Contest dashboard</strong>
              <span>After sign in, contests load from the backend automatically.</span>
            </article>
          </div>
        </div>

        <aside className="hero-showcase">
          <div className="showcase-panel">
            <div className="showcase-topline">
              <p className="showcase-label">Status</p>
              <span className={`status-pill status-${health.tone}`}>{health.label}</span>
            </div>
            <div className="session-grid">
              <div className="session-chip">
                <strong>Session</strong>
                <span>{isAuthenticated ? "Signed in" : "Guest"}</span>
              </div>
              <div className="session-chip">
                <strong>Role</strong>
                <span>{payload?.role || "none yet"}</span>
              </div>
              <div className="session-chip">
                <strong>API base</strong>
                <span>{apiBase}</span>
              </div>
              <div className="session-chip">
                <strong>Loaded contests</strong>
                <span>{contestCount}</span>
              </div>
            </div>
          </div>

          <div className="showcase-panel showcase-timeline">
            <p className="showcase-label">Flow</p>
            <div className="timeline-item">
              <strong>1. Start here</strong>
              <span>Read the app, then move into auth.</span>
            </div>
            <div className="timeline-item">
              <strong>2. Sign in</strong>
              <span>Use signup or login against the backend.</span>
            </div>
            <div className="timeline-item">
              <strong>3. Work with contests</strong>
              <span>Browse, inspect, and manage contests based on role.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="feature-strip" id="features">
        <article className="feature-card">
          <p className="feature-kicker">Public</p>
          <h2>Homepage first</h2>
          <p>The first screen explains the product instead of dropping people into raw admin controls.</p>
        </article>
        <article className="feature-card">
          <p className="feature-kicker">Real auth</p>
          <h2>Connected to the API</h2>
          <p>Signup and login go through the backend routes and keep the JWT in local storage.</p>
        </article>
        <article className="feature-card">
          <p className="feature-kicker">Practical</p>
          <h2>Focused dashboard</h2>
          <p>Signed-in users see contest tools that are useful right away instead of a giant all-in-one page.</p>
        </article>
      </section>
    </>
  );
}
