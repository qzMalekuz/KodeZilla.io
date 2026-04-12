import type { AuthSectionProps } from "../types";

export function AuthSection({
  apiBase,
  authRef,
  authMode,
  onApiBaseChange,
  onLogin,
  onModeChange,
  onSignup,
}: AuthSectionProps) {
  return (
    <section className="auth-shell" id="auth" ref={authRef}>
      <div className="auth-copy">
        <p className="eyebrow">Authentication</p>
        <h2>Sign up or log in to unlock the contest area.</h2>
        <p>
          This section talks to your backend auth routes directly. Once login succeeds,
          the dashboard loads protected contest data with the returned token.
        </p>
        <div className="config-inline">
          <label>
            <span>API base URL</span>
            <input
              name="apiBase"
              onChange={(event) => onApiBaseChange(event.target.value.trim().replace(/\/$/, ""))}
              type="text"
              value={apiBase}
            />
          </label>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={authMode === "login" ? "tab-button tab-active" : "tab-button"}
            onClick={() => onModeChange("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === "signup" ? "tab-button tab-active" : "tab-button"}
            onClick={() => onModeChange("signup")}
            type="button"
          >
            Signup
          </button>
        </div>

        {authMode === "login" ? (
          <form className="stack" onSubmit={onLogin}>
            <label>
              <span>Email</span>
              <input name="email" required type="email" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" required type="password" />
            </label>
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className="stack" onSubmit={onSignup}>
            <label>
              <span>Name</span>
              <input name="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" required type="email" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" required type="password" />
            </label>
            <label>
              <span>Role</span>
              <select defaultValue="contestee" name="role">
                <option value="contestee">contestee</option>
                <option value="creator">creator</option>
              </select>
            </label>
            <button type="submit">Create account</button>
          </form>
        )}
      </div>
    </section>
  );
}
