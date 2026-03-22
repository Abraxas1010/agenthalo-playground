// demo-api.js — AgentHALO Playground fetch interceptor
// Loaded BEFORE app.js. Overrides window.fetch for /api/ routes.
// Returns static fixtures for Phase A; WASM computation for Phase B.
(function() {
  "use strict";

  const _realFetch = window.fetch.bind(window);
  const _fixtureCache = {};
  const DEMO_VERSION = "1.0.0";

  // --- Fixture loader (lazy, cached) ---
  async function loadFixture(name) {
    if (_fixtureCache[name]) return _fixtureCache[name];
    try {
      // Cache-bust to avoid stale fixtures after deploys
      var resp = await _realFetch("demo-fixtures/" + name + ".json?v=" + DEMO_VERSION);
      if (!resp.ok) return _INLINE_FALLBACKS[name] || null;
      var data = await resp.json();
      _fixtureCache[name] = data;
      return data;
    } catch { return _INLINE_FALLBACKS[name] || null; }
  }

  // Inline fallbacks for critical fixtures that crash if missing nested objects
  var _INLINE_FALLBACKS = {
    "config": {
      dashboard_port: 3100, crt_effects: true, system_monitor_enabled: false,
      proxy_enabled: false, orchestrator_enabled: true, lean_project: "/workspace/lean",
      authentication: { authenticated: false, mode: "local", provider: null },
      x402: { enabled: false, network: "base-sepolia", max_auto_approve_usd: 1.0 },
      wrapping: { shell_rc: "~/.bashrc", mode: "passthrough" },
      paths: { home: "/home/demo/.agenthalo", db: "/home/demo/.agenthalo/traces.ndb" },
      onchain: { chain_name: "Base Sepolia", chain_id: "84532", contract_address: null },
      addons: { p2pclaw: true, agentpmt_workflows: false },
      agentpmt: { enabled: false, budget_tag: null, endpoint: null, auth_configured: false, tool_count: 0 },
      wallet_status: { agentpmt_connected: false, agentaddress_connected: false, agentaddress_address: null },
      container_runtime: { available: false, engine: null },
    },
    "crypto-status": { locked: false, has_password: true, bootstrap_mode: "disabled", migration_status: "none", session_count: 1, scoped_key_count: 0 },
    "status": { version: "0.3.0", demo_mode: true, session_count: 12, total_cost_usd: 42.87, trust_score: 0.94, crypto_status: "unlocked" },
  };

  // --- Route table ---
  // Format: [pathPrefix, fixtureName, options]
  // options.exact: match path exactly (default: prefix match)
  const ROUTES = [
    // Overview & Status
    ["/api/status",                  "status",           { exact: true }],
    ["/api/system/snapshot",         "system-snapshot",  { exact: true }],
    ["/api/capabilities",            "capabilities",     { exact: true }],
    ["/api/version",                 "status",           { exact: true }],

    // Crypto & Auth (Phase B: real WASM crypto)
    ["/api/crypto/status",           "crypto-status",    { exact: true }],
    ["/api/crypto/",                 "crypto-action",    {}],
    ["/api/genesis/status",          "genesis-status",   { exact: true }],
    ["/api/genesis/",                "genesis-action",   {}],

    // Cockpit (PTY sessions)
    ["/api/cockpit/sessions",        "cockpit-sessions", { exact: true }],
    ["/api/cockpit/sessions/",       "cockpit-session-action", {}],

    // Sessions
    ["/api/sessions",                "sessions",         { exact: true }],
    ["/api/sessions/",               "session-detail",   {}],

    // Costs
    ["/api/costs",                   "costs",            { exact: true }],
    ["/api/costs/daily",             "costs-daily",      { exact: true }],
    ["/api/costs/by-agent",          "costs-by-agent",   { exact: true }],
    ["/api/costs/by-model",          "costs-by-model",   { exact: true }],
    ["/api/costs/paid",              "costs-paid",       { exact: true }],

    // Trust & Attestation (Phase B: real Merkle verification)
    ["/api/trust",                   "trust",            { exact: true }],
    ["/api/trust/",                  "trust-detail",     {}],
    ["/api/attestations",            "attestations",     { exact: true }],
    ["/api/attestations/verify",     "attestation-verify", { exact: true }],

    // Proof Gate (Phase B: real verification)
    ["/api/proof-gate/status",       "proof-gate",       { exact: true }],
    ["/api/proof-gate/certificates", "proof-gate-certificates", { exact: true }],
    ["/api/proof-gate/",             "proof-gate-action", {}],

    // MCP Tools
    ["/api/mcp/tools",               "mcp-tools",        { exact: true }],
    ["/api/mcp/categories",          "mcp-categories",   { exact: true }],
    ["/api/mcp/usage-stats",         "mcp-usage-stats",  { exact: true }],
    ["/api/mcp/",                    "mcp-stub",         {}],

    // Config
    ["/api/config",                  "config",           { exact: true }],
    ["/api/addons",                  "addons",           { exact: true }],

    // NucleusDB
    ["/api/nucleusdb/status",        "nucleusdb-status", { exact: true }],
    ["/api/nucleusdb/browse",        "nucleusdb-browse", { exact: true }],
    ["/api/nucleusdb/stats",         "nucleusdb-stats",  { exact: true }],
    ["/api/nucleusdb/sql",           "nucleusdb-sql",    {}],
    ["/api/nucleusdb/proofs",        "nucleusdb-proofs", { exact: true }],
    ["/api/nucleusdb/vectors",       "nucleusdb-vectors", { exact: true }],
    ["/api/nucleusdb/memory/",       "nucleusdb-memory", {}],
    ["/api/nucleusdb/",              "nucleusdb-stub",   {}],

    // Governor
    ["/api/governor/status",         "governor-status",  { exact: true }],
    ["/api/governor/proxy/status",   "governor-proxy",   { exact: true }],
    ["/api/governor/",               "governor-stub",    {}],

    // Deploy
    ["/api/deploy/catalog",          "deploy-catalog",   { exact: true }],
    ["/api/deploy/preflight",        "deploy-preflight", { exact: true }],
    ["/api/deploy/",                 "deploy-stub",      {}],

    // Models
    ["/api/models/status",           "models-status",    { exact: true }],
    ["/api/models/",                 "models-stub",      {}],

    // Orchestrator
    ["/api/orchestrator/agents",     "orch-agents",      { exact: true }],
    ["/api/orchestrator/tasks",      "orch-tasks",       { exact: true }],
    ["/api/orchestrator/graph",      "orch-graph",       { exact: true }],
    ["/api/orchestrator/mesh",       "orch-mesh",        { exact: true }],
    ["/api/orchestrator/",           "orch-stub",        {}],

    // Workflows
    ["/api/workflows/instances",     "workflow-instances", { exact: true }],
    ["/api/workflows",               "workflows",        { exact: true }],
    ["/api/workflows/",              "workflow-stub",    {}],

    // P2PCLAW
    ["/api/p2pclaw/status",          "p2pclaw-status",   { exact: true }],
    ["/api/p2pclaw/briefing",        "p2pclaw-briefing", { exact: true }],
    ["/api/p2pclaw/papers",          "p2pclaw-papers",   { exact: true }],
    ["/api/p2pclaw/events",          "p2pclaw-events",   { exact: true }],
    ["/api/p2pclaw/wheel",           "p2pclaw-wheel",    { exact: true }],
    ["/api/p2pclaw/",                "p2pclaw-stub",     {}],

    // CodeGuard
    ["/api/codeguard/manifest",      "codeguard-manifest", { exact: true }],
    ["/api/codeguard/graph",         "codeguard-graph",  { exact: true }],
    ["/api/codeguard/config",        "codeguard-config", { exact: true }],
    ["/api/codeguard/audit",         "codeguard-audit",  { exact: true }],
    ["/api/codeguard/",              "codeguard-stub",   {}],

    // Gates
    ["/api/gates/status",            "gates-status",     { exact: true }],
    ["/api/gates/categories",        "gates-categories", { exact: true }],
    ["/api/gates/",                  "gates-stub",       {}],

    // Forge
    ["/api/forge/templates",         "forge-templates",  { exact: true }],
    ["/api/forge/history",           "forge-history",    { exact: true }],
    ["/api/forge/",                  "forge-stub",       {}],

    // Explorer / Proof Builder
    ["/api/explorer/status",         "explorer-status",  { exact: true }],
    ["/api/explorer/library",        "explorer-library", { exact: true }],
    ["/api/explorer/loogle",         "explorer-loogle",  { exact: true }],
    ["/api/explorer/proofs",         "explorer-proofs",  { exact: true }],
    ["/api/explorer/",               "explorer-stub",    {}],

    // Observatory
    ["/api/observatory/status",      "observatory-status", { exact: true }],
    ["/api/observatory/treemap",     "observatory-treemap", { exact: true }],
    ["/api/observatory/depgraph",    "observatory-depgraph", { exact: true }],
    ["/api/observatory/",            "observatory-stub", {}],

    // Skills
    ["/api/skills",                  "skills",           { exact: true }],
    ["/api/skills/",                 "skills-stub",      {}],

    // Identity
    ["/api/identity/status",         "identity-status",  { exact: true }],
    ["/api/identity/",               "identity-stub",    {}],
    ["/api/profile",                 "profile",          { exact: true }],

    // Files/Editor
    ["/api/files/tree",              "files-tree",       { exact: true }],
    ["/api/files/git-status",        "files-git-status", { exact: true }],
    ["/api/files/recent",            "files-recent",     {}],
    ["/api/files/",                  "files-stub",       {}],

    // Networking / Metrics
    ["/api/networking/available",    "networking",       { exact: true }],
    ["/api/metrics/diversity",       "metrics-diversity", { exact: true }],
    ["/api/metrics/trace-topology",  "metrics-topology", { exact: true }],

    // Vault / WDK / x402
    ["/api/vault/keys",              "vault-keys",       { exact: true }],
    ["/api/wdk/status",              "wdk-status",       { exact: true }],
    ["/api/wdk/available",           "wdk-available",    { exact: true }],
    ["/api/wdk/",                    "wdk-stub",         {}],
    ["/api/x402/summary",            "x402-summary",     { exact: true }],
    ["/api/x402/balance",            "x402-balance",     { exact: true }],

    // Containers
    ["/api/container/",              "container-stub",   {}],
    ["/api/containers",              "containers",       { exact: true }],
    ["/api/containers/",             "container-stub",   {}],

    // Auth / Agents
    ["/api/auth/",                   "auth-stub",        {}],
    ["/api/agents/list",             "agents-list",      { exact: true }],
    ["/api/agents/",                 "agents-stub",      {}],
    ["/api/cli/",                    "cli-stub",         {}],

    // Library
    ["/api/library/status",          "library-status",   { exact: true }],
    ["/api/library/sessions",        "library-sessions", { exact: true }],
    ["/api/library/",                "library-stub",     {}],

    // Lean
    ["/api/lean/scan",               "lean-scan",        { exact: true }],
    ["/api/lean/",                   "lean-stub",        {}],

    // Proxy (v1 endpoints)
    ["/api/proxy/",                  "proxy-stub",       {}],
    ["/api/v1/",                     "v1-stub",          {}],
    ["/api/admin/",                  "admin-stub",       {}],

    // AgentPMT
    ["/api/agentpmt/",               "agentpmt-stub",    {}],
    ["/api/agentaddress/",           "agentaddress-stub", {}],

    // OpenClaw
    ["/api/openclaw/",               "openclaw-stub",    {}],

    // Worktree isolation
    ["/api/worktree/",               "worktree-stub",    {}],

    // Payment / x402 transactions
    ["/api/accounts",                "accounts-stub",    {}],
    ["/api/balances",                "balances-stub",    {}],
    ["/api/fees",                    "fees-stub",        {}],
    ["/api/quote",                   "quote-stub",       {}],
    ["/api/send",                    "send-stub",        {}],
    ["/api/init",                    "init-stub",        {}],
    ["/api/destroy",                 "destroy-stub",     {}],

    // OpenRouter OAuth
    ["/api/openrouter/",             "openrouter-stub",  {}],
  ];

  function matchRoute(path) {
    for (const [prefix, fixture, opts] of ROUTES) {
      if (opts && opts.exact) {
        if (path === prefix || path === prefix + "/") return fixture;
      } else {
        if (path.startsWith(prefix)) return fixture;
      }
    }
    return null;
  }

  // --- Stub response for mutating or unmatched endpoints ---
  var STUB_RESPONSE = { ok: true, demo: true,
    message: "This action is simulated in demo mode. Install AgentHALO for real functionality." };

  // --- Live data generators (for endpoints that need variation) ---
  var _snapshotTick = 0;
  function liveSystemSnapshot(base) {
    _snapshotTick++;
    var t = _snapshotTick * 0.3;
    // Simulate oscillating CPU/GPU load to make system monitor interesting
    var cpuWave = Math.sin(t) * 15 + Math.sin(t * 2.7) * 8 + Math.sin(t * 0.4) * 10;
    var gpuWave = Math.cos(t * 0.8) * 12 + Math.sin(t * 1.5) * 10;
    return Object.assign({}, base, {
      cpu_percent: Math.max(5, Math.min(98, base.cpu_percent + cpuWave)),
      gpu_percent: Math.max(10, Math.min(99, (base.gpu_percent || 82) + gpuWave)),
      memory_used_mb: Math.round(base.memory_used_mb + Math.sin(t * 0.5) * 500),
      gpu_memory_used_mb: Math.round((base.gpu_memory_used_mb || 19200) + Math.sin(t * 0.7) * 800),
      load_avg: [
        Math.round((8.2 + Math.sin(t) * 3) * 10) / 10,
        Math.round((6.5 + Math.sin(t * 0.5) * 2) * 10) / 10,
        Math.round((4.1 + Math.sin(t * 0.3) * 1.5) * 10) / 10,
      ],
      network_rx_bytes: base.network_rx_bytes + _snapshotTick * 524288,
      network_tx_bytes: base.network_tx_bytes + _snapshotTick * 131072,
    });
  }

  // --- Override fetch ---
  window.fetch = async function(input, init) {
    var url = typeof input === "string" ? input : (input && input.url ? input.url : "");
    var path = url.startsWith("/") ? url.split("?")[0] : null;

    // SSE /events endpoint — return empty response
    if (path === "/events") {
      return new Response("", { status: 200, headers: { "Content-Type": "text/event-stream" } });
    }

    if (!path || !path.startsWith("/api/")) return _realFetch(input, init);

    // --- Special handlers for endpoints needing dynamic data ---

    // System snapshot: return oscillating values for live system monitor
    if (path === "/api/system/snapshot") {
      var base = await loadFixture("system-snapshot");
      return jsonResponse(base ? liveSystemSnapshot(base) : STUB_RESPONSE);
    }

    // Workflow detail: /api/workflows/{id} — return from the workflows list
    if (path.match(/^\/api\/workflows\/[^/]+$/) && (!init || !init.method || init.method === "GET")) {
      var wfId = path.split("/").pop();
      var wfList = await loadFixture("workflows");
      if (wfList && wfList.workflows) {
        var wf = wfList.workflows.find(function(w) { return w.workflow_id === wfId || w.id === wfId; });
        if (wf) return jsonResponse(wf);
      }
      return jsonResponse(STUB_RESPONSE);
    }

    var fixture = matchRoute(path);
    if (!fixture) {
      console.warn("[PLAYGROUND] Unmatched API route:", path);
      return jsonResponse(STUB_RESPONSE);
    }

    // Stub fixtures (suffix "-stub" or "-action") return generic ack
    if (fixture.endsWith("-stub") || fixture.endsWith("-action")) {
      return jsonResponse(STUB_RESPONSE);
    }

    var data = await loadFixture(fixture);
    if (data === null) {
      console.warn("[PLAYGROUND] Fixture missing:", fixture + ".json");
      return jsonResponse(STUB_RESPONSE);
    }

    // Simulate realistic latency
    await new Promise(function(r) { setTimeout(r, 30 + Math.random() * 70); });
    return jsonResponse(data);
  };

  function jsonResponse(data) {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- WebSocket stub ---
  var _RealWS = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    if (url.indexOf("/api/") !== -1 || url.indexOf("/ws") !== -1) {
      console.info("[PLAYGROUND] WebSocket stubbed:", url);
      var mock = new EventTarget();
      mock.readyState = 1;
      mock.send = function() {};
      mock.close = function() { mock.readyState = 3; mock.dispatchEvent(new CloseEvent("close")); };
      mock.CONNECTING = 0; mock.OPEN = 1; mock.CLOSING = 2; mock.CLOSED = 3;
      setTimeout(function() { mock.dispatchEvent(new Event("open")); }, 50);
      return mock;
    }
    return new _RealWS(url, protocols);
  };
  window.WebSocket.CONNECTING = 0;
  window.WebSocket.OPEN = 1;
  window.WebSocket.CLOSING = 2;
  window.WebSocket.CLOSED = 3;

  // --- EventSource (SSE) stub ---
  var _RealES = window.EventSource;
  window.EventSource = function(url) {
    console.info("[PLAYGROUND] EventSource stubbed:", url);
    var mock = new EventTarget();
    mock.readyState = 1;
    mock.close = function() { mock.readyState = 2; };
    mock.CONNECTING = 0; mock.OPEN = 1; mock.CLOSED = 2;
    setTimeout(function() { mock.dispatchEvent(new Event("open")); }, 50);
    return mock;
  };
  window.EventSource.CONNECTING = 0;
  window.EventSource.OPEN = 1;
  window.EventSource.CLOSED = 2;

  console.info("[PLAYGROUND] AgentHALO interactive demo v" + DEMO_VERSION);
})();
