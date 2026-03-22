/* mock-data.js — All demo data + universal API catch-all
 * Loaded BEFORE app-demo.js.  Defines window.DEMO_DATA and overrides
 * window.fetch so that any /api/* call returns plausible mock data.
 * This lets cockpit.js, genesis-docs.js, forge.js, etc. work unmodified.
 */
'use strict';

window.DEMO_DATA = {

  // ── Status ──────────────────────────────────────────────────
  status: {
    version: '0.3.0', demo_mode: true, session_count: 12,
    total_tokens: 8472910, uptime_secs: 1234567,
    wrapping: { claude: true, codex: true, gemini: false },
    governors: { total: 4, stable: 3, oscillating: 1, gain_violated: 0 },
    wallet_status: { agentpmt_connected: true },
    agentpmt: { tool_count: 47 },
    setup_complete: { identity: true, wallet: true, agentpmt: true, llm: true, complete: true },
  },

  // ── Config ──────────────────────────────────────────────────
  config: {
    dashboard_port: 3100, crt_effects: true,
    agent_name: 'Agent H.A.L.O.',
    model: 'claude-opus-4-20250514',
    providers_enabled: ['openrouter','anthropic'],
    wallet_status: { agentpmt_connected: true },
    agentpmt: { tool_count: 47 },
    setup_complete: { identity: true, wallet: true, agentpmt: true, llm: true, complete: true },
    governor: {
      instances: [
        { instance_id: 'gov-proxy', epsilon: 0.02, measured_signal: 0.48, target: 0.50, stable: true, sparkline: [0.45,0.47,0.48,0.49,0.48,0.50,0.49,0.48], formal_basis: 'ProxyConvergence' },
        { instance_id: 'gov-cost', epsilon: 0.05, measured_signal: 1.20, target: 1.25, stable: true, sparkline: [1.18,1.20,1.22,1.21,1.20,1.19,1.20,1.21], formal_basis: 'CostBound' },
        { instance_id: 'gov-latency', epsilon: 0.10, measured_signal: 340, target: 350, oscillating: true, sparkline: [330,345,360,340,355,338,342,351], formal_basis: 'LatencyGovernor' },
        { instance_id: 'gov-memory', epsilon: 0.03, measured_signal: 0.62, target: 0.65, stable: true, sparkline: [0.60,0.61,0.63,0.62,0.61,0.62,0.63,0.62], formal_basis: 'MemoryPressure' },
      ],
      proxy: { in_flight: 3, latency_ewma_ms: 142.5 },
      memory: { instance_id: 'gov-memory', epsilon: 0.03, measured_signal: 0.62, target: 0.65, stable: true, sparkline: [0.60,0.61,0.63,0.62], formal_basis: 'MemoryPressure' },
    },
    addons: { p2pclaw_enabled: true },
    crypto: { status: 'unlocked', scopes: ['sign','vault','wallet','identity','genesis'] },
  },

  // ── Sessions ────────────────────────────────────────────────
  sessions: {
    sessions: [
      { session: { session_id: 'ses-a7f3c1', agent: 'claude-opus', model: 'claude-opus-4-20250514', status: 'completed', started_at: 1711094400, ended_at: 1711098000 }, summary: { total_input_tokens: 125000, total_output_tokens: 48000, total_cost_usd: 2.14, description: 'Proof lattice extraction and PageRank computation' } },
      { session: { session_id: 'ses-b2e4d8', agent: 'codex-cli', model: 'o3-pro', status: 'completed', started_at: 1711090800, ended_at: 1711094400 }, summary: { total_input_tokens: 89000, total_output_tokens: 31000, total_cost_usd: 1.42, description: 'Translation smoke tests — Coq→Lean round-trip' } },
      { session: { session_id: 'ses-c9f1a3', agent: 'gemini-cli', model: 'gemini-2.5-pro', status: 'completed', started_at: 1711087200, ended_at: 1711090800 }, summary: { total_input_tokens: 210000, total_output_tokens: 67000, total_cost_usd: 0.83, description: 'Semantic overlay enrichment — batch 47' } },
      { session: { session_id: 'ses-d4b7e2', agent: 'claude-opus', model: 'claude-opus-4-20250514', status: 'active', started_at: 1711098000 }, summary: { total_input_tokens: 45000, total_output_tokens: 12000, total_cost_usd: 0.71, description: 'ATP sheaf glue unlock workflow — seed queue' } },
      { session: { session_id: 'ses-e8c2f5', agent: 'codex-cli', model: 'codex-mini-latest', status: 'completed', started_at: 1711083600, ended_at: 1711087200 }, summary: { total_input_tokens: 156000, total_output_tokens: 52000, total_cost_usd: 0.45, description: 'MCP tool inventory validation and registration' } },
      { session: { session_id: 'ses-f1d6a9', agent: 'claude-opus', model: 'claude-opus-4-20250514', status: 'completed', started_at: 1711080000, ended_at: 1711083600 }, summary: { total_input_tokens: 320000, total_output_tokens: 95000, total_cost_usd: 5.12, description: 'Evolutionary proof search — 28-goal benchmark' } },
      { session: { session_id: 'ses-g3e9b4', agent: 'leanstral', model: 'deepseek-prover-v2', status: 'completed', started_at: 1711076400, ended_at: 1711080000 }, summary: { total_input_tokens: 78000, total_output_tokens: 24000, total_cost_usd: 0.03, description: 'Tactic suggestion pass@3 for sorry targets' } },
      { session: { session_id: 'ses-h7a2c6', agent: 'claude-opus', model: 'claude-opus-4-20250514', status: 'error', started_at: 1711072800, ended_at: 1711076400 }, summary: { total_input_tokens: 180000, total_output_tokens: 42000, total_cost_usd: 2.78, description: 'Isabelle→Lean translation batch — HOL theories' } },
    ],
    total: 847, page: 1, per_page: 20,
  },

  // ── Trust Attestations ──────────────────────────────────────
  attestations: {
    attestations: [
      { id: 'att-001', agent_type: 'claude-opus', session_id: 'ses-a7f3c1', score: 0.94, merkle_root: 'a1b2c3d4e5f6...', created_at: 1711098000, type: 'session_complete' },
      { id: 'att-002', agent_type: 'codex-cli', session_id: 'ses-b2e4d8', score: 0.91, merkle_root: 'f6e5d4c3b2a1...', created_at: 1711094400, type: 'session_complete' },
      { id: 'att-003', agent_type: 'system', session_id: 'sys-genesis', score: 1.00, merkle_root: '0000abcdef00...', created_at: 1711072800, type: 'genesis_sealed' },
      { id: 'att-004', agent_type: 'gemini-cli', session_id: 'ses-c9f1a3', score: 0.88, merkle_root: 'deadbeef0123...', created_at: 1711090800, type: 'session_complete' },
      { id: 'att-005', agent_type: 'proof-gate', session_id: 'gate-verify', score: 0.97, merkle_root: '1234567890ab...', created_at: 1711087200, type: 'proof_verified' },
    ],
    total: 142,
  },

  // ── Lean Scan ───────────────────────────────────────────────
  leanScan: {
    ok: true, root: '/workspace/lean', total_files: 847,
    tree: {
      name: 'HeytingLean', type: 'dir', lean_count: 847,
      children: [
        { name: 'ATheory', type: 'dir', lean_count: 23, children: [
          { name: 'AssemblyCore.lean', type: 'file', path: 'ATheory/AssemblyCore.lean', size: 4820 },
          { name: 'RealizedLattice.lean', type: 'file', path: 'ATheory/RealizedLattice.lean', size: 3210 },
          { name: 'MeetJoin.lean', type: 'file', path: 'ATheory/MeetJoin.lean', size: 2890 },
        ]},
        { name: 'Bridge', type: 'dir', lean_count: 74, children: [
          { name: 'IPL', type: 'dir', lean_count: 18, children: [
            { name: 'Derives.lean', type: 'file', path: 'Bridge/IPL/Derives.lean', size: 48200 },
            { name: 'Context.lean', type: 'file', path: 'Bridge/IPL/Context.lean', size: 8950 },
            { name: 'Supports.lean', type: 'file', path: 'Bridge/IPL/Supports.lean', size: 12300 },
          ]},
          { name: 'Veselov', type: 'dir', lean_count: 12, children: [
            { name: 'HybridZeckendorf.lean', type: 'file', path: 'Bridge/Veselov/HybridZeckendorf.lean', size: 15600 },
            { name: 'FibonacciBase.lean', type: 'file', path: 'Bridge/Veselov/FibonacciBase.lean', size: 9200 },
          ]},
        ]},
        { name: 'Contextual', type: 'dir', lean_count: 42, children: [
          { name: 'Kernel.lean', type: 'file', path: 'Contextual/Kernel.lean', size: 18400 },
          { name: 'SoftKernel.lean', type: 'file', path: 'Contextual/SoftKernel.lean', size: 22100 },
          { name: 'Tactics.lean', type: 'file', path: 'Contextual/Tactics.lean', size: 7600 },
        ]},
        { name: 'DiffATP', type: 'dir', lean_count: 31, children: [
          { name: 'ProofStateObserver.lean', type: 'file', path: 'DiffATP/ProofStateObserver.lean', size: 21500 },
          { name: 'KernelVerifier.lean', type: 'file', path: 'DiffATP/KernelVerifier.lean', size: 16800 },
          { name: 'TacticDispatch.lean', type: 'file', path: 'DiffATP/TacticDispatch.lean', size: 11200 },
        ]},
        { name: 'NucleusDB', type: 'dir', lean_count: 15, children: [
          { name: 'Identity.lean', type: 'file', path: 'NucleusDB/Identity.lean', size: 5400 },
          { name: 'Genesis.lean', type: 'file', path: 'NucleusDB/Genesis.lean', size: 8200 },
        ]},
      ],
    },
    libraries: [{
      name: 'Mathlib', root: '/workspace/.lake/packages/mathlib/Mathlib', total_files: 6320,
      tree: { name: 'Mathlib', type: 'dir', lean_count: 6320, children: [
        { name: 'Algebra', type: 'dir', lean_count: 842, children: [
          { name: 'Group', type: 'dir', lean_count: 156, children: [
            { name: 'Basic.lean', type: 'file', path: 'Algebra/Group/Basic.lean', size: 28400 },
            { name: 'Defs.lean', type: 'file', path: 'Algebra/Group/Defs.lean', size: 15200 },
          ]},
        ]},
        { name: 'Topology', type: 'dir', lean_count: 634, children: [
          { name: 'Basic.lean', type: 'file', path: 'Topology/Basic.lean', size: 32100 },
        ]},
        { name: 'CategoryTheory', type: 'dir', lean_count: 412, children: [
          { name: 'Functor', type: 'dir', lean_count: 89, children: [
            { name: 'Basic.lean', type: 'file', path: 'CategoryTheory/Functor/Basic.lean', size: 19800 },
          ]},
        ]},
      ]},
    }],
  },

  // ── System Monitor ──────────────────────────────────────────
  systemSnapshot: {
    hostname: 'dgx-spark-01', is_dgx: true,
    cpu_cores: 20, cpu_pct: 42,
    gpu_name: 'NVIDIA GB10 Superchip', gpu_pct: 65, gpu_temp_c: 58, gpu_power_w: 124,
    mem_total_kb: 134217728, mem_used_kb: 56371446,
    thermals: [
      { label: 'X925-A', temp_c: 72 }, { label: 'X925-B', temp_c: 68 },
      { label: 'A725-A', temp_c: 65 }, { label: 'A725-B', temp_c: 63 },
      { label: 'VRM', temp_c: 71 }, { label: 'SOC', temp_c: 59 },
      { label: 'PWR', temp_c: 55 },
    ],
    cores: Array.from({length:20}, (_,i) => ({ id: i, pct: 20 + Math.random()*50 })),
    load_1m: 5.2, entropy_avail: 4096, uptime_secs: 1234567,
  },

  // ── Genesis ─────────────────────────────────────────────────
  genesis: {
    completed: true, sealed_at: 1711072800,
    sources_count: 4, curby_pulse_id: 'pulse-a7f3c1d4',
    identity: {
      did: 'did:halo:dgx-spark-01:a7f3c1d4e5f6a8b2',
      fingerprint: 'a7f3c1d4e5f6a8b2c9d0e1f2a3b4c5d6',
      created_at: 1711072800,
    },
  },

  // ── Identity ────────────────────────────────────────────────
  identity: {
    did: 'did:halo:dgx-spark-01:a7f3c1d4e5f6a8b2',
    agent_name: 'Agent H.A.L.O.',
    fingerprint: 'a7f3c1d4e5f6a8b2c9d0e1f2a3b4c5d6',
    puf_present: true, browser_fp_present: true, genesis_complete: true,
    ledger_entries: 142, merkle_root: 'a1b2c3d4e5f6a8b9c0d1e2f3a4b5c6d7',
  },

  // ── Addons ──────────────────────────────────────────────────
  addons: { addons: { p2pclaw_enabled: true } },

  // ── P2PCLAW ─────────────────────────────────────────────────
  p2pclaw: {
    status: {
      config: { endpoint_url: 'https://p2pclaw.com', agent_id: 'agenthalo-dgx', agent_name: 'Agent H.A.L.O.', tier: 'tier1', auth_configured: true },
      swarm: { agents: 7 },
    },
    briefing: { briefing_markdown: '## Weekly Research Briefing\n\n**Active investigations:** 3\n**New papers this week:** 12\n**Peer validations pending:** 5\n\n### Highlights\n- Sheaf glue transport proof completed for IPL bridge\n- New Coq→Lean translation corpus ingested (847 files)\n- Evolutionary search benchmark updated to 28 goals' },
    papers: { papers: [
      { paper_id: 'p-001', title: 'Sheaf Glue Transport for IPL Bridge Theorems', status: 'published', category: 'proofs' },
      { paper_id: 'p-002', title: 'Evolutionary Proof Search: A 28-Goal Benchmark', status: 'published', category: 'systems' },
      { paper_id: 'p-003', title: 'Cross-Kernel Translation Fidelity Metrics', status: 'published', category: 'proofs' },
      { paper_id: 'p-004', title: 'DGX Spark Thermal Entropy for PUF Generation', status: 'published', category: 'hardware' },
    ]},
    mempool: { papers: [
      { paper_id: 'mp-001', title: 'Differentiable ATP: KAN Training Speedup via Sparse Features', status: 'pending' },
      { paper_id: 'mp-002', title: 'Program Synthesis with Certified Lean 4 Output', status: 'pending' },
    ]},
    events: { events: [
      { timestamp: 1711098000, kind: 'paper_published', extra: { title: 'Sheaf Glue Transport' } },
      { timestamp: 1711094400, kind: 'peer_joined', extra: { agent: 'ResearchBot-7' } },
      { timestamp: 1711090800, kind: 'investigation_started', extra: { topic: 'IPL completeness' } },
    ]},
    investigations: { investigations: [
      { id: 'inv-001', title: 'IPL Completeness via Contextual Semantics', status: 'active' },
      { id: 'inv-002', title: 'Optimal Transport for Premise Retrieval', status: 'active' },
    ]},
  },

  // ── Proof Gate ──────────────────────────────────────────────
  proofGate: {
    enabled: true, tool_count: 6, requirement_count: 12, enforced_count: 8, evaluated_at: 1711098000,
    certificate_dir: '/workspace/certificates/',
    tools: [
      { tool_name: 'heyting_prove_assist', evaluation: { passed: true, requirements_met: 3 }, requirements: [
        { required_theorem: 'IPL.sound', enforced: true, check: { verified: true, found: true }, description: 'IPL soundness theorem', expected_statement_hash: 'a1b2c3...', expected_commit_hash: 'abc123' },
        { required_theorem: 'Bridge.faithful', enforced: true, check: { verified: true, found: true }, description: 'Bridge faithfulness', expected_statement_hash: 'd4e5f6...', expected_commit_hash: 'def456' },
        { required_theorem: 'Kernel.type_safety', enforced: true, check: { verified: true, found: true }, description: 'Kernel type safety', expected_statement_hash: 'g7h8i9...', expected_commit_hash: 'ghi789' },
      ]},
      { tool_name: 'heyting_evolutionary_proof_search', evaluation: { passed: true, requirements_met: 2 }, requirements: [
        { required_theorem: 'Search.termination', enforced: true, check: { verified: true, found: true }, description: 'Search termination guarantee' },
        { required_theorem: 'Search.soundness', enforced: true, check: { verified: true, found: true }, description: 'Search soundness' },
      ]},
    ],
    certificates: [
      { filename: 'IPL_sound.lean4export', status: 'verified', verification: { all_checked: true, declarations_checked: 12, theorem_names: ['IPL.sound','IPL.complete'] }, modified_at: 1711098000 },
      { filename: 'Bridge_faithful.lean4export', status: 'verified', verification: { all_checked: true, declarations_checked: 8, theorem_names: ['Bridge.faithful'] }, modified_at: 1711094400 },
    ],
  },

  // ── NucleusDB ───────────────────────────────────────────────
  nucleusdb: {
    status: { running: true, uptime_secs: 1234567, tables: 12, total_entries: 24891 },
    stats: { tables: 12, total_keys: 24891, disk_usage_bytes: 156000000, memory_usage_bytes: 48000000 },
    memory: { stats: { total_memories: 1247, categories: { session: 847, attestation: 142, identity: 23, genesis: 12, proof: 156, skill: 67 } } },
  },

  // ── Observatory ─────────────────────────────────────────────
  observatory: {
    status: { health_score: 0.87, total_files: 847, total_lines: 186420, total_decls: 4231, total_sorrys: 3, clusters_count: 42 },
  },

  // ── MCP Tools ───────────────────────────────────────────────
  mcpTools: {
    tools: Array.from({length:40}, (_,i) => ({
      name: ['heyting_prove_assist','heyting_search','heyting_lean_check','heyting_atp_quickstart','heyting_evolutionary_proof_search','heyting_translate_coq_to_lean','heyting_overlay_query','heyting_proof_tree','heyting_build_index','heyting_try_tactic','heyting_guard_no_sorry','heyting_session','heyting_conjecture','heyting_paper_extract_full','heyting_deep_research','heyting_mathlib_search','heyting_leanexplore_local_search','heyting_system_overview','heyting_resource_snapshot','heyting_qa_dev','heyting_atp_packed_retrieve_premises','heyting_lens_multiview','heyting_atp_obstruction_precheck','heyting_discovery_queue','heyting_pick_sorry_target','heyting_goal_from_sorry','heyting_knowledge_search','heyting_proof_oracle','heyting_proof_commit','heyting_translate_lean_to_coq','heyting_translate_lean_to_agda','heyting_isabelle_build','heyting_contracts_pipeline_run','heyting_lean_yul_emit','heyting_program_synthesis_pipeline','heyting_proof_codegen_on_demand','heyting_atp_sheaf_glue_transport','heyting_overlay_enrich_queue_vllm','heyting_build_embeddings','heyting_check_index_fresh'][i] || `heyting_tool_${i}`,
      description: ['Assisted theorem proving','Search Lean declarations','Type-check Lean snippet','Quick-start ATP','Evolutionary proof search','Translate Coq → Lean','Query semantic overlay','Proof tree management','Build lean_index','Try specific tactic','Guard against sorry','Session management','Conjecture lifecycle','Extract paper content','Deep web research','Search Mathlib','LeanExplore search','System overview','Resource snapshot','Dev QA checks','Packed premise retrieval','Multi-lens analysis','Obstruction precheck','Discovery queue','Pick sorry target','Goal from sorry','Knowledge search','Proof oracle','Proof commit','Translate Lean → Coq','Translate Lean → Agda','Build Isabelle','Contracts pipeline','Lean Yul emit','Program synthesis','Proof codegen','Sheaf glue transport','Overlay enrich vLLM','Build embeddings','Check index freshness'][i] || `Tool ${i}`,
      category: ['atp','search','lean','atp','atp','translate','overlay','atp','index','atp','lean','infra','atp','paper','search','search','search','infra','infra','lean','atp','atp','atp','atp','atp','atp','search','atp','atp','translate','translate','translate','contracts','contracts','export','export','atp','overlay','data','index'][i] || 'misc',
      invocations: Math.floor(Math.random()*500),
    })),
    categories: [
      { name: 'atp', count: 18, domain: 'meta-atp' },
      { name: 'search', count: 6, domain: 'meta-atp-retrieval' },
      { name: 'lean', count: 4, domain: 'meta-proof' },
      { name: 'translate', count: 5, domain: 'meta-translation' },
      { name: 'overlay', count: 3, domain: 'meta-overlay' },
      { name: 'infra', count: 3, domain: 'meta-system' },
      { name: 'paper', count: 2, domain: 'meta-paper-pipeline' },
    ],
  },
  agentpmtTools: { tools: [] },
  mcpUsageStats: null,

  // ── Skills ──────────────────────────────────────────────────
  skills: {
    skills: Array.from({length:15}, (_,i) => ({
      skill_id: ['meta-atp','meta-proof','meta-translation','meta-overlay','meta-system','meta-paper-pipeline','meta-atp-retrieval','meta-atp-sheaf','meta-atp-experimental','meta-algebra-category','meta-combinatorics-topology','meta-analysis-optimization','meta-physics-quantum','meta-export-synthesis','meta-llm-infra'][i],
      name: ['Core ATP Engine','Proof Lifecycle','Cross-Kernel Translation','Semantic Overlay','System & Infra','Paper Pipeline','ATP Retrieval','Sheaf Glue','Experimental ATP','Algebra & Category','Combinatorics & Topology','Analysis & Optimization','Physics & Quantum','Export & Synthesis','LLM Infrastructure'][i],
      trigger: ['atp search prove','proof strategy tactic','translate coq lean agda','overlay enrich annotate','dashboard system repo','paper ingest review','premise retrieval embedding','sheaf glue transport','path integral differentiable','category algebra hopf','graph knot borel','ode optimization gradient','string theory quantum','export synthesis contract','vllm model serve'][i],
      sub_skill_count: [8,6,4,3,5,3,7,5,4,4,3,5,4,4,3][i],
    })),
  },

  // ── Cockpit Sessions ────────────────────────────────────────
  cockpitSessions: {
    sessions: [
      { id: 'ck-001', agent_type: 'claude', status: 'active', started_at: '2026-03-22T08:00:00Z', model: 'claude-opus-4-20250514' },
      { id: 'ck-002', agent_type: 'codex', status: 'completed', started_at: '2026-03-22T06:00:00Z', model: 'o3-pro' },
      { id: 'ck-003', agent_type: 'gemini', status: 'completed', started_at: '2026-03-21T22:00:00Z', model: 'gemini-2.5-pro' },
    ],
  },
  orchestratorAgents: {
    agents: [
      { id: 'claude', name: 'Claude Opus', type: 'claude', status: 'active', cli_installed: true },
      { id: 'codex', name: 'Codex CLI', type: 'codex', status: 'idle', cli_installed: true },
      { id: 'gemini', name: 'Gemini CLI', type: 'gemini', status: 'idle', cli_installed: true },
    ],
  },

  // ── Workflows ───────────────────────────────────────────────
  workflows: { instances: [], templates: [] },

  // ── Crypto (always unlocked in demo) ────────────────────────
  crypto: { locked: false, password_protected: true, migration_status: 'complete', active_scopes: ['sign','vault','wallet','identity','genesis'], bootstrap_mode: 'optional', retry_after_secs: 0 },

  // ── Worktree profile (shows all nav items) ──────────────────
  worktreeProfile: { lean_project_path: '/workspace/lean', hidden_nav_items: [] },

  // ── Agent Address ───────────────────────────────────────────
  agentAddress: { status: 'active', address: 'halo://dgx-spark-01.local', did: 'did:halo:dgx-spark-01:a7f3c1d4e5f6a8b2' },

  // ── Files (for cockpit) ─────────────────────────────────────
  files: {
    gitStatus: { changed: [
      { path: 'lean/HeytingLean/Bridge/IPL/Derives.lean', status: 'modified' },
      { path: 'lean/HeytingLean/Contextual/SoftKernel.lean', status: 'modified' },
    ]},
    recent: { files: [
      { path: 'lean/HeytingLean/Bridge/IPL/Derives.lean', modified_at: 1711098000 },
      { path: 'lean/HeytingLean/DiffATP/ProofStateObserver.lean', modified_at: 1711094400 },
    ]},
  },

  // ── Orchestrator mesh ───────────────────────────────────────
  mesh: { nodes: [], edges: [] },

  // ── Metrics ─────────────────────────────────────────────────
  metrics: {
    diversity: { score: 0.82, agents: 3, models: 4 },
    traceTopology: { chains: [], entries: [] },
  },
};

// ── Universal fetch override ──────────────────────────────────
// Catches ALL /api/* calls from cockpit.js, genesis-docs.js, forge.js, etc.
// that use fetch() directly instead of api().
(function() {
  var D = window.DEMO_DATA;

  // Route map: /api/<path> → mock data
  var routes = {
    '/api/status':                  D.status,
    '/api/config':                  D.config,
    '/api/sessions':                D.sessions,
    '/api/attestations':            D.attestations,
    '/api/lean/scan':               D.leanScan,
    '/api/lean/file':               { content: '-- Demo mode: file preview not available\\n-- This is a placeholder for the Lean file viewer.\\n\\nimport Mathlib.Tactic\\n\\ntheorem demo_example : True := trivial\\n' },
    // NOTE: system/snapshot is NOT mapped — returns 500 below to trigger simData() animation
    // '/api/system/snapshot': ...,
    '/api/genesis/status':          D.genesis,
    '/api/identity/status':         D.identity,
    '/api/crypto/status':           D.crypto,
    '/api/addons':                  D.addons,
    '/api/worktree/active-profile': D.worktreeProfile,
    '/api/proof-gate/status':       D.proofGate,
    '/api/nucleusdb/status':        D.nucleusdb.status,
    '/api/nucleusdb/stats':         D.nucleusdb.stats,
    '/api/nucleusdb/memory/stats':  D.nucleusdb.memory.stats,
    '/api/mcp/tools':               D.mcpTools,
    '/api/mcp/categories':          D.mcpTools.categories,
    '/api/mcp/usage-stats':         null,
    '/api/agentpmt/tools':          D.agentpmtTools,
    '/api/skills':                  D.skills,
    '/api/cockpit/sessions':        D.cockpitSessions,
    '/api/orchestrator/agents':     D.orchestratorAgents,
    '/api/orchestrator/mesh':       D.mesh,
    '/api/metrics/diversity':       D.metrics.diversity,
    '/api/metrics/trace-topology':  D.metrics.traceTopology,
    '/api/p2pclaw/status':          D.p2pclaw.status,
    '/api/p2pclaw/briefing':        D.p2pclaw.briefing,
    '/api/p2pclaw/papers':          D.p2pclaw.papers,
    '/api/p2pclaw/mempool':         D.p2pclaw.mempool,
    '/api/p2pclaw/events':          D.p2pclaw.events,
    '/api/p2pclaw/investigations':  D.p2pclaw.investigations,
    '/api/agentaddress/status':     D.agentAddress,
    '/api/deploy/catalog':          { agents: D.orchestratorAgents.agents },
    '/api/observatory/status':      D.observatory.status,
    '/api/files/git-status':        D.files.gitStatus,
    '/api/files/recent':            D.files.recent,
    '/api/agents/list':             D.orchestratorAgents,
    '/api/vault/keys':              { keys: [] },
    '/api/profile':                 { agent_name: 'Agent H.A.L.O.', role: 'operator' },
    '/api/identity/tier':           { tier: 'sovereign', features: ['sign','vault','wallet'] },
    '/api/models/status':           { models: [], providers: ['openrouter'] },
    '/api/cli/detect':              { claude: true, codex: true, gemini: true },
    '/api/x402/balance':            { balance: 0, currency: 'USD' },
    '/api/gates/status':            { gates: { git: [], communication: [], internal: [] }, summary: { total: 0, passing: 0, failing: 0 } },
    '/api/codeguard/manifest':      { manifest: [], total: 0 },
    '/api/codeguard/graph':         { nodes: [], edges: [] },
    '/api/codeguard/config':        { enabled: false },
    '/api/explorer/status':         { running: false },
    '/api/orchestrator/readiness':  { ready: true },
    '/api/orchestrator/tasks':      { tasks: [] },
    '/api/workflows':               { workflows: [] },
    '/api/workflows/instances':     { instances: [] },
    '/api/nucleusdb/history':       { entries: [] },
    '/api/nucleusdb/memory/recall': { memories: [] },
    '/api/proof-gate/certificates': D.proofGate.certificates,
  };

  var _realFetch = window.fetch;
  window.fetch = function(url, opts) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      var path = url.split('?')[0];
      var data = routes[path];
      if (data !== undefined) {
        return Promise.resolve(new Response(JSON.stringify(data), {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      }
      // System snapshot: return 500 to trigger system-monitor.js simData() animation
      if (path === '/api/system/snapshot' || path === '/api/system/stream') {
        return Promise.resolve(new Response('', { status: 500 }));
      }
      // Unknown API route — return empty success to prevent error cascades
      return Promise.resolve(new Response(JSON.stringify({}), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Non-API requests pass through (CSS, images, proof-lattice.json, etc.)
    return _realFetch.apply(this, arguments);
  };

  // Stub WebSocket and EventSource for system-monitor and P2PCLAW
  var _RealWS = window.WebSocket;
  window.WebSocket = function(url) {
    var self = this;
    self.readyState = 3; // CLOSED
    self.send = function() {};
    self.close = function() {};
    setTimeout(function() { if (self.onerror) self.onerror(new Event('error')); }, 50);
    setTimeout(function() { if (self.onclose) self.onclose(new CloseEvent('close')); }, 100);
  };
  window.WebSocket.OPEN = 1;
  window.WebSocket.CLOSED = 3;

  window.EventSource = function() {
    this.close = function() {};
    var self = this;
    setTimeout(function() { if (self.onerror) self.onerror(new Event('error')); }, 50);
  };
})();
