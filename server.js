const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { URL } = require("node:url");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const GRANOLA_BASE_URL = "https://public-api.granola.ai";
const execFileAsync = promisify(execFile);
const DEMO_NOTES = {
  salesforce: [
    "5/12/2026 - CURSOR CALL: Salesforce engineering standardized on Cursor + CodeGenie for core coding workflows across multiple clouds.",
    "Leadership signal: teams cited 30%+ velocity improvement and materially faster legacy coverage turnaround in pilot groups.",
    "Account strategy: lead with governance-first rollout, then expand through Agentforce, Slack context workflows, and Tableau analytics integration."
  ],
  default: [
    "Recent customer call: leadership is prioritizing measurable engineering productivity without compromising compliance controls.",
    "Team concern: adoption must fit existing SDLC guardrails and provide clear executive-level success metrics.",
    "Suggested angle: position Cursor as governance-compatible acceleration with a focused pilot and timeline-based ROI checkpoints."
  ]
};

/**
 * Sends JSON response with status code.
 * @param {import("node:http").ServerResponse} res - HTTP response.
 * @param {number} status - HTTP status code.
 * @param {object} payload - JSON payload.
 */
function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

/**
 * Reads JSON body from request safely.
 * @param {import("node:http").IncomingMessage} req - Incoming request.
 * @returns {Promise<object>} Parsed JSON object.
 */
async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

/**
 * Returns the timestamp string N days ago.
 * @param {number} days - Number of days back.
 * @returns {string} ISO8601 timestamp.
 */
function daysAgoIso(days) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

/**
 * Lists recent Granola notes using pagination.
 * @param {string} apiKey - Granola API key.
 * @returns {Promise<object[]>} Note objects.
 */
async function listRecentGranolaNotes(apiKey) {
  const notes = [];
  let cursor = "";
  for (let page = 0; page < 3; page += 1) {
    const url = new URL("/v1/notes", GRANOLA_BASE_URL);
    url.searchParams.set("created_after", daysAgoIso(180));
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error(`Granola API error: ${res.status}`);
    const payload = await res.json();
    notes.push(...(payload.notes || []));
    if (!payload.hasMore || !payload.cursor) break;
    cursor = payload.cursor;
  }
  return notes;
}

/**
 * Builds searchable text for a note.
 * @param {object} note - Granola note.
 * @returns {string} Lowercased text blob.
 */
function noteTextBlob(note) {
  return [note.title, note.summary, note.markdown, note.content]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

/**
 * Formats matching notes for the UI panel.
 * @param {object[]} matches - Matching notes.
 * @param {string} company - Company name.
 * @returns {string} Render-friendly plain text.
 */
function formatNotes(matches, company) {
  if (!matches.length) return "";
  return matches.slice(0, 5).map((note, idx) => {
    const date = note.start_time || note.created_at || "";
    const when = date ? new Date(date).toLocaleDateString() : "Unknown date";
    const title = note.title || `Meeting ${idx + 1}`;
    const url = note.web_url || "";
    const summary = (note.summary || "Relevant mention found in meeting notes.").replace(/\s+/g, " ").trim();
    return `- ${when} — ${title}${url ? ` (${url})` : ""}\n  ${summary}\n  Relevance: mention of ${company}.`;
  }).join("\n\n");
}

/**
 * Returns local demo notes to keep demos unblocked.
 * @param {string} company - Company name.
 * @returns {string} Demo notes text.
 */
function getDemoNotes(company) {
  const key = String(company || "").trim().toLowerCase();
  const lines = DEMO_NOTES[key] || DEMO_NOTES.default;
  return lines.map((line) => `- ${line}`).join("\n");
}

/**
 * Creates a prompt that forces MCP-backed Granola lookup.
 * @param {string} company - Company name to match.
 * @returns {string} Prompt content.
 */
function buildCursorGranolaPrompt(company) {
  return [
    "Use MCP server granola tool query_granola_meetings.",
    `Query: Find meetings where "${company}" is mentioned and summarize only account-relevant notes.`,
    "Return plain text bullets with meeting/date context and citations if available.",
    "If nothing relevant exists, return exactly: NO_MATCH"
  ].join(" ");
}

/**
 * Runs local Cursor agent and queries Granola MCP.
 * @param {string} company - Company name.
 * @returns {Promise<{notes: string, error: string}>} Notes or error.
 */
async function queryGranolaViaCursorAgent(company) {
  const args = ["agent", "-p", "--output-format", "text", "--approve-mcps", "--trust", "--workspace", ROOT, buildCursorGranolaPrompt(company)];
  try {
    const { stdout } = await execFileAsync("cursor", args, { timeout: 120000, maxBuffer: 1024 * 1024 });
    const notes = String(stdout || "").trim();
    if (notes.includes("I don't have the ability to call MCP tools directly")) {
      return { notes: "", error: "Local Cursor agent does not have Granola MCP tools loaded. In Cursor Settings, enable/fix Granola or mcp-adaptor, then retry." };
    }
    if (!notes || notes === "NO_MATCH") return { notes: "", error: `No relevant meeting notes found for ${company}.` };
    return { notes, error: "" };
  } catch (err) {
    const out = `${err.stdout || ""}\n${err.stderr || ""}`.trim();
    if (out.includes("Authentication required")) return { notes: "", error: "Local Cursor agent is not logged in. Run: cursor agent login" };
    if (out.includes("Connection closed")) return { notes: "", error: "Local mcp-adaptor connection is closed. Check MCP status in Cursor Settings and reconnect." };
    return { notes: "", error: `Local Granola query failed: ${out || err.message}` };
  }
}

/**
 * Uses Granola public API for company lookup.
 * @param {string} apiKey - Granola API key.
 * @param {string} company - Company name.
 * @returns {Promise<{notes: string, error: string}>} Notes or error.
 */
async function queryGranolaViaApiKey(apiKey, company) {
  if (!apiKey) return { notes: "", error: "Missing GRANOLA_API_KEY on server." };
  const companyLower = company.toLowerCase();
  const notes = await listRecentGranolaNotes(apiKey);
  const matches = notes.filter((note) => noteTextBlob(note).includes(companyLower));
  const formatted = formatNotes(matches, company);
  if (!formatted) return { notes: "", error: `No relevant meeting notes found for ${company}.` };
  return { notes: formatted, error: "" };
}

/**
 * Handles private research lookup endpoint.
 * @param {import("node:http").IncomingMessage} req - HTTP request.
 * @param {import("node:http").ServerResponse} res - HTTP response.
 */
async function handleGranolaCompanyNotes(req, res) {
  const body = await readJsonBody(req);
  const company = String(body.company || "").trim();
  if (!company) return sendJson(res, 400, { notes: "", error: "Company is required." });
  const provider = process.env.GRANOLA_PROVIDER || "demo";
  const apiKey = process.env.GRANOLA_API_KEY;
  if (provider === "demo") return sendJson(res, 200, { notes: getDemoNotes(company), error: "" });
  const result = provider === "api-key" ? await queryGranolaViaApiKey(apiKey, company) : await queryGranolaViaCursorAgent(company);
  if (result.error && process.env.GRANOLA_DEMO_FALLBACK !== "off") {
    return sendJson(res, 200, { notes: getDemoNotes(company), error: "" });
  }
  return sendJson(res, 200, result);
}

/**
 * Serves static files for the SPA.
 * @param {import("node:http").IncomingMessage} req - Incoming request.
 * @param {import("node:http").ServerResponse} res - HTTP response.
 */
async function serveStatic(req, res) {
  const reqUrl = new URL(req.url || "/", `http://${HOST}:${PORT}`);
  const rawPath = reqUrl.pathname === "/" ? "/index.html" : reqUrl.pathname;
  const safePath = path.normalize(path.join(ROOT, rawPath));
  if (!safePath.startsWith(ROOT)) return sendJson(res, 403, { error: "Forbidden" });
  const ext = path.extname(safePath).toLowerCase();
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };
  try {
    const content = await fs.readFile(safePath);
    res.writeHead(200, { "Content-Type": types[ext] || "text/plain; charset=utf-8" });
    res.end(content);
  } catch (_) {
    sendJson(res, 404, { error: "Not found" });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/granola/company-notes") return await handleGranolaCompanyNotes(req, res);
    return await serveStatic(req, res);
  } catch (err) {
    return sendJson(res, 500, { notes: "", error: `Server error: ${err.message}` });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
