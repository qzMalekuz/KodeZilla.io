import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const storageKeys = {
  apiBase: "contest-platform-api-base",
  token: "contest-platform-token",
};

function getDefaultApiBase() {
  if (typeof window === "undefined") {
    return "/api";
  }

  return `${window.location.origin}/api`;
}

function decodeJwt(token) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function toIsoLocal(value) {
  return new Date(value).toISOString();
}

function parseLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readForm(form) {
  return new FormData(form);
}

function App() {
  const [apiBase, setApiBase] = useState(
    () => localStorage.getItem(storageKeys.apiBase) || getDefaultApiBase(),
  );
  const [token, setToken] = useState(() => localStorage.getItem(storageKeys.token) || "");
  const [contestId, setContestId] = useState("");
  const [consoleOutput, setConsoleOutput] = useState(
    "Ready. Configure the API base, then authenticate to begin.",
  );
  const [contestList, setContestList] = useState([]);
  const [contestDetail, setContestDetail] = useState("");
  const [leaderboardOutput, setLeaderboardOutput] = useState("");
  const [problemOutput, setProblemOutput] = useState("");
  const [workspaceCollapsed, setWorkspaceCollapsed] = useState(false);
  const [health, setHealth] = useState({ label: "Checking API", tone: "pending" });
  const authPanelRef = useRef(null);

  const payload = decodeJwt(token);
  const sessionCards = [
    { label: "API", value: apiBase },
    { label: "Status", value: token ? "Authenticated" : "Guest mode" },
    { label: "Role", value: payload?.role || "unknown" },
    { label: "User ID", value: payload?.userId || "not set" },
  ];

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

        const data = await response.json();
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

    checkHealth();

    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  function logResult(label, payloadValue) {
    setConsoleOutput(`${label}\n${pretty(payloadValue)}`);
  }

  async function api(path, options = {}) {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({
      success: false,
      data: null,
      error: "INVALID_JSON_RESPONSE",
    }));

    logResult(`${options.method || "GET"} ${path} -> ${response.status}`, data);

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  }

  async function handleAction(action) {
    try {
      await action();
    } catch (error) {
      logResult("Request error", { message: error.message });
    }
  }

  function scrollToAuth() {
    authPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderContestCard(contest) {
    return (
      <article className="contest-card" key={contest.id}>
        <strong>{contest.title}</strong>
        <div className="meta">{contest.description}</div>
        <div className="meta-row">
          <span>{contest.id}</span>
          <span>{contest.creatorName}</span>
          <span>MCQs: {contest.mcqCount}</span>
          <span>DSA: {contest.dsaCount}</span>
        </div>
      </article>
    );
  }

  return (
    <>
      <div className="ambient-orb orb-one"></div>
      <div className="ambient-orb orb-two"></div>

      <div className="page-shell">
        <header className="site-nav">
          <a className="brandmark" href="#top">
            <span className="brandmark-badge">CP</span>
            <span>Contest Platform</span>
          </a>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#workspace">Workspace</a>
          </nav>
          <a className="nav-cta" href="#workspace">
            Launch App
          </a>
        </header>

        <section className="landing-hero" id="top">
          <div className="landing-copy">
            <p className="eyebrow">Code. Compete. Create.</p>
            <h1>Run coding contests from a landing page that actually does the job.</h1>
            <p className="hero-text">
              Contest Platform gives creators a fast way to publish rounds and gives
              contestees one place to join, inspect problems, and submit with confidence.
            </p>
            <div className="hero-actions">
              <a className="button-link primary-link" href="#workspace">
                Open workspace
              </a>
              <button className="button-link ghost-link" onClick={scrollToAuth} type="button">
                Sign in fast
              </button>
            </div>
            <div className="hero-metrics">
              <article className="metric-card">
                <strong>Creator studio</strong>
                <span>Publish contests, MCQs, and DSA sets from one screen.</span>
              </article>
              <article className="metric-card">
                <strong>Contestant flow</strong>
                <span>Login, inspect rounds, and submit answers without switching tools.</span>
              </article>
              <article className="metric-card">
                <strong>Live API bridge</strong>
                <span>Frontend talks directly to your existing Express API.</span>
              </article>
            </div>
          </div>

          <aside className="hero-showcase">
            <div className="showcase-panel">
              <div className="showcase-topline">
                <p className="showcase-label">Session Snapshot</p>
                <span className={`status-pill status-${health.tone}`}>{health.label}</span>
              </div>
              <div className="session-grid">
                {sessionCards.map((card) => (
                  <div className="session-chip" key={card.label}>
                    <strong>{card.label}</strong>
                    <span>{card.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="showcase-panel showcase-timeline">
              <p className="showcase-label">Round Rhythm</p>
              <div className="timeline-item">
                <strong>1. Authenticate</strong>
                <span>Create a user or paste a token.</span>
              </div>
              <div className="timeline-item">
                <strong>2. Explore</strong>
                <span>Load contests, details, and leaderboards.</span>
              </div>
              <div className="timeline-item">
                <strong>3. Execute</strong>
                <span>Create challenges or ship submissions instantly.</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="feature-strip" id="features">
          <article className="feature-card">
            <p className="feature-kicker">For creators</p>
            <h2>Build rounds without admin friction.</h2>
            <p>
              Contest creation, MCQ authoring, DSA test case setup, and protected
              creator-only flows are all wired in.
            </p>
          </article>
          <article className="feature-card">
            <p className="feature-kicker">For participants</p>
            <h2>Stay inside one clear competition surface.</h2>
            <p>
              Contestees can inspect contest payloads, view problems, submit answers,
              and verify results in the response console.
            </p>
          </article>
          <article className="feature-card">
            <p className="feature-kicker">For development</p>
            <h2>Use it as a real frontend, not a placeholder.</h2>
            <p>
              The landing page flows straight into the working app, with API
              configuration and session state persisted in the browser.
            </p>
          </article>
        </section>

        <section className="workflow-band" id="workflow">
          <div className="workflow-copy">
            <p className="eyebrow">Built Around Your Backend</p>
            <h2>From homepage to contest operations in one scroll.</h2>
            <p>
              This React frontend greets users first, explains the product, and still
              exposes the practical controls your project needs during development and demos.
            </p>
          </div>
          <div className="workflow-steps">
            <article>
              <span>01</span>
              <strong>Set API base</strong>
              <p>Point the frontend at `http://localhost:3000/api` or your deployed backend.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Authenticate</strong>
              <p>Create a creator or contestee account, then keep the JWT stored locally.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Operate</strong>
              <p>Use the integrated workspace for setup, exploration, and submissions.</p>
            </article>
          </div>
        </section>

        <main className={`workspace${workspaceCollapsed ? " workspace-collapsed" : ""}`} id="workspace">
          <div className="workspace-head">
            <div>
              <p className="eyebrow">Workspace</p>
              <h2>Functional control room</h2>
            </div>
            <button
              className="button-link ghost-link compact-link"
              onClick={() => setWorkspaceCollapsed((value) => !value)}
              type="button"
            >
              {workspaceCollapsed ? "Expand workspace" : "Collapse workspace"}
            </button>
          </div>

          <div className="grid" id="workspace-grid">
            <section className="panel panel-accent" id="auth-panel" ref={authPanelRef}>
              <div className="panel-heading">
                <h2>Connection</h2>
                <p>Point the frontend at your backend and keep your token handy.</p>
              </div>
              <form
                className="stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  logResult("Session saved", { apiBase, hasToken: Boolean(token) });
                }}
              >
                <label>
                  <span>API base URL</span>
                  <input
                    name="apiBase"
                    onChange={(event) => setApiBase(event.target.value.trim().replace(/\/$/, ""))}
                    placeholder={getDefaultApiBase()}
                    type="text"
                    value={apiBase}
                  />
                </label>
                <label>
                  <span>JWT token</span>
                  <textarea
                    name="token"
                    onChange={(event) => setToken(event.target.value.trim())}
                    placeholder="Paste token returned by login"
                    rows="4"
                    value={token}
                  ></textarea>
                </label>
                <button type="submit">Save session</button>
              </form>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h2>Authentication</h2>
                <p>Create users or sign in to unlock the protected routes.</p>
              </div>
              <div className="two-col">
                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const result = await api("/auth/signup", {
                        method: "POST",
                        body: JSON.stringify({
                          name: formData.get("name"),
                          email: formData.get("email"),
                          password: formData.get("password"),
                          role: formData.get("role"),
                        }),
                      });
                      form.reset();
                      logResult("Signup success", result);
                    });
                  }}
                >
                  <h3>Signup</h3>
                  <label><span>Name</span><input name="name" required /></label>
                  <label><span>Email</span><input name="email" required type="email" /></label>
                  <label><span>Password</span><input name="password" required type="password" /></label>
                  <label>
                    <span>Role</span>
                    <select defaultValue="contestee" name="role">
                      <option value="contestee">contestee</option>
                      <option value="creator">creator</option>
                    </select>
                  </label>
                  <button type="submit">Create account</button>
                </form>

                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const result = await api("/auth/login", {
                        method: "POST",
                        body: JSON.stringify({
                          email: formData.get("email"),
                          password: formData.get("password"),
                        }),
                      });
                      setToken(result.data.token);
                      form.reset();
                    });
                  }}
                >
                  <h3>Login</h3>
                  <label><span>Email</span><input name="email" required type="email" /></label>
                  <label><span>Password</span><input name="password" required type="password" /></label>
                  <button type="submit">Get token</button>
                </form>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h2>Contest Explorer</h2>
                <p>Load all contests, inspect one by id, and review the leaderboard.</p>
              </div>
              <div className="toolbar">
                <button
                  onClick={() =>
                    handleAction(async () => {
                      const result = await api("/contests");
                      setContestList(result.data || []);
                    })
                  }
                  type="button"
                >
                  Load contests
                </button>
                <input
                  onChange={(event) => setContestId(event.target.value)}
                  placeholder="Contest ID"
                  type="text"
                  value={contestId}
                />
                <button
                  onClick={() =>
                    handleAction(async () => {
                      if (!contestId.trim()) {
                        throw new Error("Enter a contest id first.");
                      }
                      const result = await api(`/contests/${contestId.trim()}`);
                      setContestDetail(pretty(result.data));
                    })
                  }
                  type="button"
                >
                  Contest detail
                </button>
                <button
                  onClick={() =>
                    handleAction(async () => {
                      if (!contestId.trim()) {
                        throw new Error("Enter a contest id first.");
                      }
                      const result = await api(`/contests/${contestId.trim()}/leaderboard`);
                      setLeaderboardOutput(pretty(result.data));
                    })
                  }
                  type="button"
                >
                  Leaderboard
                </button>
              </div>
              <div className="card-list">
                {contestList.length ? contestList.map(renderContestCard) : (
                  <article className="contest-card">No contests loaded yet.</article>
                )}
              </div>
              <pre className="output">{contestDetail}</pre>
              <pre className="output">{leaderboardOutput}</pre>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h2>Creator Studio</h2>
                <p>Use creator credentials to publish contests, MCQs, and DSA problems.</p>
              </div>
              <div className="three-col">
                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const result = await api("/contests", {
                        method: "POST",
                        body: JSON.stringify({
                          title: formData.get("title"),
                          description: formData.get("description"),
                          startTime: toIsoLocal(formData.get("startTime")),
                          endTime: toIsoLocal(formData.get("endTime")),
                        }),
                      });
                      form.reset();
                      logResult("Contest created", result);
                    });
                  }}
                >
                  <h3>Create contest</h3>
                  <label><span>Title</span><input name="title" required /></label>
                  <label><span>Description</span><textarea name="description" required rows="4"></textarea></label>
                  <label><span>Start time</span><input name="startTime" required type="datetime-local" /></label>
                  <label><span>End time</span><input name="endTime" required type="datetime-local" /></label>
                  <button type="submit">Create contest</button>
                </form>

                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const result = await api(`/contests/${formData.get("contestId")}/mcq`, {
                        method: "POST",
                        body: JSON.stringify({
                          questionText: formData.get("questionText"),
                          options: parseLines(String(formData.get("options"))),
                          correctOptionIndex: Number(formData.get("correctOptionIndex")),
                          points: Number(formData.get("points")),
                        }),
                      });
                      form.reset();
                      logResult("MCQ created", result);
                    });
                  }}
                >
                  <h3>Add MCQ</h3>
                  <label><span>Contest ID</span><input name="contestId" required /></label>
                  <label><span>Question</span><textarea name="questionText" required rows="4"></textarea></label>
                  <label><span>Options</span><textarea name="options" placeholder="One option per line" required rows="5"></textarea></label>
                  <label><span>Correct option index</span><input min="0" name="correctOptionIndex" required type="number" /></label>
                  <label><span>Points</span><input defaultValue="1" min="1" name="points" required type="number" /></label>
                  <button type="submit">Create MCQ</button>
                </form>

                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const rawCases = parseLines(String(formData.get("testCases")));
                      const result = await api(`/contests/${formData.get("contestId")}/dsa`, {
                        method: "POST",
                        body: JSON.stringify({
                          title: formData.get("title"),
                          description: formData.get("description"),
                          tags: parseLines(String(formData.get("tags")).replaceAll(",", "\n")),
                          points: Number(formData.get("points")),
                          timeLimit: Number(formData.get("timeLimit")),
                          memoryLimit: Number(formData.get("memoryLimit")),
                          testCases: rawCases.map((line) => JSON.parse(line)),
                        }),
                      });
                      form.reset();
                      logResult("DSA problem created", result);
                    });
                  }}
                >
                  <h3>Add DSA problem</h3>
                  <label><span>Contest ID</span><input name="contestId" required /></label>
                  <label><span>Title</span><input name="title" required /></label>
                  <label><span>Description</span><textarea name="description" required rows="4"></textarea></label>
                  <label><span>Tags</span><input name="tags" placeholder="arrays, dp, graphs" /></label>
                  <label><span>Points</span><input defaultValue="100" min="1" name="points" required type="number" /></label>
                  <label><span>Time limit (ms)</span><input defaultValue="2000" min="1" name="timeLimit" required type="number" /></label>
                  <label><span>Memory limit (MB)</span><input defaultValue="256" min="1" name="memoryLimit" required type="number" /></label>
                  <label>
                    <span>Test cases</span>
                    <textarea
                      name="testCases"
                      placeholder='One JSON object per line, example: {"input":"2\n","expectedOutput":"4\n","isHidden":false}'
                      required
                      rows="7"
                    ></textarea>
                  </label>
                  <button type="submit">Create DSA problem</button>
                </form>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h2>Submission Lab</h2>
                <p>Inspect problems and send contestant submissions from the same screen.</p>
              </div>
              <div className="three-col">
                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const result = await api(
                        `/contests/${formData.get("contestId")}/mcq/${formData.get("questionId")}/submit`,
                        {
                          method: "POST",
                          body: JSON.stringify({
                            selectedOptionIndex: Number(formData.get("selectedOptionIndex")),
                          }),
                        },
                      );
                      form.reset();
                      logResult("MCQ submitted", result);
                    });
                  }}
                >
                  <h3>Submit MCQ</h3>
                  <label><span>Contest ID</span><input name="contestId" required /></label>
                  <label><span>Question ID</span><input name="questionId" required /></label>
                  <label><span>Selected option index</span><input min="0" name="selectedOptionIndex" required type="number" /></label>
                  <button type="submit">Submit MCQ</button>
                </form>

                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const formData = readForm(event.currentTarget);
                      const result = await api(`/problems/${formData.get("problemId")}`);
                      setProblemOutput(pretty(result.data));
                    });
                  }}
                >
                  <h3>View DSA problem</h3>
                  <label><span>Problem ID</span><input name="problemId" required /></label>
                  <button type="submit">Load problem</button>
                  <pre className="output compact">{problemOutput}</pre>
                </form>

                <form
                  className="stack"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAction(async () => {
                      const form = event.currentTarget;
                      const formData = readForm(form);
                      const result = await api(`/problems/${formData.get("problemId")}/submit`, {
                        method: "POST",
                        body: JSON.stringify({
                          language: formData.get("language"),
                          code: formData.get("code"),
                        }),
                      });
                      form.reset();
                      logResult("DSA submitted", result);
                    });
                  }}
                >
                  <h3>Submit DSA</h3>
                  <label><span>Problem ID</span><input name="problemId" required /></label>
                  <label>
                    <span>Language</span>
                    <select defaultValue="javascript" name="language">
                      <option value="javascript">javascript</option>
                      <option value="python">python</option>
                      <option value="java">java</option>
                      <option value="cpp">cpp</option>
                      <option value="c">c</option>
                    </select>
                  </label>
                  <label><span>Code</span><textarea name="code" placeholder="Write or paste solution code" required rows="10"></textarea></label>
                  <button type="submit">Submit code</button>
                </form>
              </div>
            </section>

            <section className="panel panel-wide">
              <div className="panel-heading">
                <h2>Response Console</h2>
                <p>Every request lands here so you can inspect payloads quickly.</p>
              </div>
              <pre className="output output-large">{consoleOutput}</pre>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
