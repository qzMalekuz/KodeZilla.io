const port = Number(process.env.FE_PORT) || 5173;
const backendUrl = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

async function buildFrontend() {
  const result = await Bun.build({
    entrypoints: ["./app.jsx"],
    outdir: "./dist",
    target: "browser",
    sourcemap: "inline",
  });

  if (!result.success) {
    throw new AggregateError(result.logs, "Frontend build failed");
  }
}

await buildFrontend();

function serveFile(path: string) {
  return new Response(Bun.file(path));
}

async function proxyToBackend(req: Request) {
  const incomingUrl = new URL(req.url);
  const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, backendUrl);
  const headers = new Headers(req.headers);
  headers.set("host", new URL(backendUrl).host);

  return fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    duplex: "half",
  });
}

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname.startsWith("/api/")) {
      return proxyToBackend(req);
    }

    if (pathname === "/" || pathname === "/index.html") {
      return serveFile("./index.html");
    }

    if (pathname === "/styles.css") {
      return serveFile("./styles.css");
    }

    if (pathname === "/dist/app.js") {
      return serveFile("./dist/app.js");
    }

    return serveFile("./index.html");
  },
});

console.log(`FE running on http://localhost:${port}`);
console.log(`Proxying API requests to ${backendUrl}`);
