#!/usr/bin/env python3
"""Generate demo fixture JSONs for the AgentHALO Playground.

Deterministic: given the same inputs, produces identical output.
Uses a fixed seed for any randomization.
"""
import json
import hashlib
import os
import sys

SEED = 42
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "data")
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "src", "demo-fixtures")


def deterministic_id(prefix, index):
    h = hashlib.sha256(f"{prefix}-{index}".encode()).hexdigest()[:12]
    return f"{prefix}_{h}"


def write(name, data):
    path = os.path.join(OUT_DIR, f"{name}.json")
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    size = os.path.getsize(path)
    print(f"  {name}.json ({size} bytes)")


# ---------- Status ----------
def generate_status():
    return {
        "version": "0.3.0",
        "uptime_secs": 86400 * 7,
        "demo_mode": True,
        "session_count": 12,
        "active_sessions": 1,
        "total_events": 3247,
        "total_cost_usd": 42.87,
        "trust_score": 0.94,
        "proof_gate_surfaces": 6,
        "proof_gate_requirements_met": 14,
        "nucleusdb_tables": 5,
        "nucleusdb_rows": 892,
        "mcp_tool_count": 128,
        "agents_registered": 3,
        "crypto_status": "unlocked",
        "governor_status": "nominal",
    }


def generate_system_snapshot():
    return {
        "cpu_percent": 67.3,
        "memory_used_mb": 12480,
        "memory_total_mb": 32768,
        "disk_used_gb": 142.7,
        "disk_total_gb": 500,
        "process_count": 14,
        "uptime_secs": 604800,
        "cpu_cores": 16,
        "load_avg": [8.2, 6.5, 4.1],
        "gpu_percent": 82.4,
        "gpu_memory_used_mb": 19200,
        "gpu_memory_total_mb": 24576,
        "network_rx_bytes": 847293440,
        "network_tx_bytes": 234881024,
    }


def generate_capabilities():
    return {
        "mcp": True, "nucleusdb": True, "proof_gate": True,
        "trust": True, "crypto": True, "deploy": True,
        "orchestrator": True, "p2pclaw": True, "codeguard": True,
        "gates": True, "forge": True, "observatory": True,
        "cockpit": True, "skills": True, "wdk": False,
    }


# ---------- Cockpit ----------
def generate_cockpit_sessions():
    """PTY session list for the cockpit terminal page."""
    sessions = []
    agents = ["claude", "codex", "gemini"]
    for i in range(3):
        sid = deterministic_id("pty", i)
        sessions.append({
            "id": sid,
            "agent_type": agents[i],
            "command": f"/usr/bin/{agents[i]}-cli",
            "status": {"state": "active" if i < 2 else "done", "exit_code": None if i < 2 else 0},
            "ws_url": f"/api/cockpit/sessions/{sid}/ws",
            "started_at": f"2026-03-21T{10 + i}:00:00Z",
            "cols": 120,
            "rows": 36,
        })
    return {"sessions": sessions}


def generate_cockpit_session_action():
    """Stub for cockpit session create/delete/resize — returns a valid session shape."""
    sid = deterministic_id("pty", 99)
    return {
        "ok": True,
        "demo": True,
        "id": sid,
        "ws_url": f"/api/cockpit/sessions/{sid}/ws",
        "message": "This action is simulated in demo mode. Install AgentHALO for real terminal sessions.",
    }


# ---------- Crypto ----------
def generate_crypto_status():
    return {
        "locked": False,
        "has_password": True,
        "bootstrap_mode": "disabled",
        "migration_status": "none",
        "session_count": 1,
        "scoped_key_count": 0,
    }


def generate_genesis_status():
    return {
        "completed": True,
        "stages": [
            {"name": "entropy_harvest", "status": "completed", "duration_ms": 1200},
            {"name": "key_derivation", "status": "completed", "duration_ms": 340},
            {"name": "did_creation", "status": "completed", "duration_ms": 180},
            {"name": "wallet_creation", "status": "completed", "duration_ms": 420},
            {"name": "nucleus_init", "status": "completed", "duration_ms": 890},
        ],
        "did": "did:halo:z6Mkdemo1234567890abcdef",
        "evm_address": "0xDEMO000000000000000000000000000000000001",
    }


# ---------- Sessions ----------
def generate_sessions():
    agents = [
        ("claude", "claude-opus-4-6", 15.0, 75.0),
        ("codex", "codex-mini-latest", 1.50, 6.0),
        ("gemini", "gemini-2.5-pro", 3.50, 10.50),
    ]
    task_descs = [
        "Prove group homomorphism preserves identity",
        "Translate Coq ring theory to Lean 4",
        "Search Mathlib for topological compactness lemmas",
        "Verify NucleusDB commit certificate chain",
        "Formalize sheaf cohomology exact sequence",
        "Audit MCP tool registry for dead endpoints",
        "Prove ML-KEM encapsulation correctness",
        "Translate Isabelle lattice theory to Lean",
        "Fix sorry in Bridge.lean support_iff_search",
        "Optimize ATP premise retrieval embeddings",
        "Verify witness chain completeness theorem",
        "Review P2PCLAW paper: Constructive Sheaf Cohomology",
    ]
    sessions = []
    for i in range(12):
        agent_name, model, in_cost, out_cost = agents[i % 3]
        input_tokens = 8000 + (i * 1234) % 20000
        output_tokens = 2000 + (i * 567) % 8000
        cost = (input_tokens * in_cost + output_tokens * out_cost) / 1_000_000
        sessions.append({
            "id": deterministic_id("sess", i),
            "session_id": deterministic_id("sess", i),
            "agent_type": agent_name,
            "model": model,
            "status": "completed" if i < 10 else ("active" if i == 10 else "failed"),
            "started_at": f"2026-03-{(i % 28) + 1:02d}T{8 + i % 14:02d}:00:00Z",
            "ended_at": f"2026-03-{(i % 28) + 1:02d}T{9 + i % 14:02d}:30:00Z" if i < 10 else None,
            "duration_secs": 3600 + i * 420 if i < 10 else None,
            "event_count": 40 + i * 7,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost_usd": round(cost, 4),
            "trust_score": round(0.85 + (i % 5) * 0.03, 3),
            "tags": ["mathlib", "algebra"] if i % 2 == 0 else ["mathlib", "topology"],
            "description": task_descs[i],
            "tool_calls": 5 + i * 3,
            "files_modified": 1 + i % 4,
        })
    return sessions


def generate_session_detail():
    events = []
    event_types = ["thought", "tool_call", "tool_result", "file_edit", "file_read", "shell_command"]
    for i in range(50):
        events.append({
            "id": deterministic_id("evt", i),
            "type": event_types[i % len(event_types)],
            "timestamp": f"2026-03-15T10:{i:02d}:00Z",
            "agent": "claude",
            "content_preview": f"Event {i}: {event_types[i % len(event_types)]} operation",
            "tokens": 50 + (i * 37) % 300,
        })
    return {
        "id": deterministic_id("sess", 0),
        "agent_type": "claude",
        "model": "claude-opus-4-6",
        "status": "completed",
        "started_at": "2026-03-15T10:00:00Z",
        "ended_at": "2026-03-15T11:30:00Z",
        "event_count": 50,
        "events": events,
    }


# ---------- Costs ----------
def generate_costs():
    return {
        "total_usd": 42.87,
        "total_input_tokens": 485000,
        "total_output_tokens": 127000,
        "period_days": 30,
        "session_count": 12,
    }


def generate_costs_daily():
    days = []
    for d in range(30):
        cost = round(0.8 + (d * 17 % 30) * 0.12, 2)
        days.append({
            "date": f"2026-02-{(d % 28) + 1:02d}",
            "cost_usd": cost,
            "sessions": 1 + d % 3,
            "input_tokens": 12000 + d * 500,
            "output_tokens": 3000 + d * 200,
        })
    return days


def generate_costs_by_agent():
    return [
        {"agent": "claude", "cost_usd": 28.42, "sessions": 4, "percent": 66.3},
        {"agent": "codex", "cost_usd": 6.15, "sessions": 4, "percent": 14.3},
        {"agent": "gemini", "cost_usd": 8.30, "sessions": 4, "percent": 19.4},
    ]


def generate_costs_by_model():
    return [
        {"model": "claude-opus-4-6", "cost_usd": 28.42, "calls": 4},
        {"model": "gemini-2.5-pro", "cost_usd": 8.30, "calls": 4},
        {"model": "codex-mini-latest", "cost_usd": 6.15, "calls": 4},
    ]


def generate_costs_paid():
    return {"paid_usd": 0.0, "unpaid_usd": 42.87, "invoices": []}


# ---------- Trust ----------
def generate_trust():
    entries = []
    for i in range(12):
        entries.append({
            "session_id": deterministic_id("sess", i),
            "trust_score": round(0.85 + (i % 5) * 0.03, 3),
            "merkle_root": hashlib.sha256(f"merkle-{i}".encode()).hexdigest(),
            "event_count": 40 + i * 7,
            "computed_at": f"2026-03-{(i % 28) + 1:02d}T12:00:00Z",
        })
    return {"entries": entries, "average_score": 0.91}


def generate_attestations():
    att_types = ["identity", "session", "proof", "capability", "trust_update",
                 "session", "proof", "session", "identity", "capability",
                 "session", "proof", "trust_update", "session", "proof"]
    return {
        "attestations": [
            {
                "id": deterministic_id("att", i),
                "type": att_types[i % len(att_types)],
                "agent_type": ["claude", "codex", "gemini"][i % 3],
                "subject": deterministic_id("sess", i % 12),
                "session_id": deterministic_id("sess", i % 12),
                "issuer": "did:halo:z6Mkdemo1234567890abcdef",
                "created_at": f"2026-03-{max(1, 21 - i):02d}T{10 + i % 12:02d}:{(i * 7) % 60:02d}:00Z",
                "timestamp": 1742550000 + i * 3600,
                "issued_at": f"2026-03-{max(1, 21 - i):02d}T{10 + i % 12:02d}:{(i * 7) % 60:02d}:00Z",
                "verified": True,
                "merkle_root": hashlib.sha256(f"att-merkle-{i}".encode()).hexdigest()[:32],
            }
            for i in range(15)
        ]
    }


def generate_attestation_verify():
    return {"valid": True, "verified_at": "2026-03-21T12:00:00Z", "demo": True}


# ---------- Proof Gate ----------
def generate_proof_gate():
    surfaces = [
        {"surface": "execute_sql", "requirements": 3, "met": 3, "status": "enforced"},
        {"surface": "container_launch", "requirements": 2, "met": 2, "status": "enforced"},
        {"surface": "commit", "requirements": 3, "met": 3, "status": "enforced"},
        {"surface": "evm_sign", "requirements": 2, "met": 2, "status": "enforced"},
        {"surface": "kem_encapsulate", "requirements": 1, "met": 1, "status": "enforced"},
        {"surface": "trace_analysis", "requirements": 3, "met": 3, "status": "enforced"},
    ]
    return {
        "mode": "advisory",
        "surfaces": surfaces,
        "total_requirements": 14,
        "total_met": 14,
        "last_verified": "2026-03-21T06:00:00Z",
    }


# ---------- MCP Tools ----------
def generate_mcp_tools():
    categories = ["atp", "search", "index", "translate", "lean", "data", "overlay", "infra"]
    tools = []
    tool_names = [
        "prove_assist", "evolutionary_proof_search", "hybrid_premise_search",
        "try_tactic", "goal_from_sorry", "find_sorries", "pick_sorry_target",
        "typecheck_snippet", "lean_check", "guard_no_sorry",
        "search", "mathlib_search", "leanexplore_local_search", "loogle_local_search",
        "knowledge_search", "search_methodology", "reservoir_search",
        "build_index", "build_embeddings", "compute_decl_pagerank",
        "translate_coq_to_lean", "translate_lean_to_coq", "translate_isabelle_to_lean",
        "translate_lean_to_agda", "translate_lean_to_metamath",
        "qa_dev", "build_all_exes", "run_all_exes", "system_overview",
        "resource_snapshot", "session", "conjecture", "proof_tree",
        "overlay_query", "overlay_validate", "overlay_enrich_queue_vllm",
        "paper_extract_full", "paper_suggest_lean_index", "paper_to_overlay",
        "contracts_pipeline_run", "lean_yul_emit", "lean_yul_compile_solc",
        "deep_research", "web_search", "web_fetch",
        "agent_invoke", "agentic_toolcall_mcp_loop", "mcp_smoke_harness",
        "proof_codegen_on_demand", "proof_codegen_coverage", "proof_commit",
    ]
    for i, name in enumerate(tool_names):
        tools.append({
            "name": f"heyting_{name}",
            "category": categories[i % len(categories)],
            "description": f"Tool: {name.replace('_', ' ').title()}",
            "call_count": (i * 7 + 3) % 50,
        })
    return {"tools": tools, "total": len(tools)}


def generate_mcp_categories():
    return [
        {"category": "atp", "count": 28, "domain": "meta-atp"},
        {"category": "search", "count": 18, "domain": "meta-atp-retrieval"},
        {"category": "index", "count": 8, "domain": "meta-overlay"},
        {"category": "translate", "count": 24, "domain": "meta-translation"},
        {"category": "lean", "count": 12, "domain": "meta-proof"},
        {"category": "data", "count": 16, "domain": "meta-overlay"},
        {"category": "overlay", "count": 14, "domain": "meta-overlay"},
        {"category": "paper", "count": 10, "domain": "meta-paper-pipeline"},
        {"category": "infra", "count": 12, "domain": "meta-system"},
        {"category": "contracts", "count": 6, "domain": "meta-export-synthesis"},
    ]


def generate_mcp_usage_stats():
    return {
        "total_calls": 847,
        "unique_tools_used": 43,
        "top_tools": [
            {"name": "heyting_prove_assist", "calls": 124},
            {"name": "heyting_search", "calls": 98},
            {"name": "heyting_try_tactic", "calls": 76},
            {"name": "heyting_lean_check", "calls": 65},
            {"name": "heyting_typecheck_snippet", "calls": 52},
        ],
        "calls_by_category": {
            "atp": 312, "search": 198, "lean": 142,
            "translate": 87, "infra": 54, "overlay": 32, "data": 22,
        },
    }


# ---------- Config ----------
def generate_config():
    return {
        "dashboard_port": 3100,
        "crt_effects": True,
        "system_monitor_enabled": False,
        "proxy_enabled": False,
        "orchestrator_enabled": True,
        "p2pclaw_enabled": True,
        "codeguard_enabled": True,
        "forge_enabled": True,
        "observatory_enabled": True,
        "lean_project": "/workspace/lean",
        "authentication": {
            "authenticated": False,
            "mode": "local",
            "provider": None,
        },
        "x402": {
            "enabled": False,
            "network": "base-sepolia",
            "max_auto_approve_usd": 1.0,
        },
        "wrapping": {
            "shell_rc": "~/.bashrc",
            "mode": "passthrough",
        },
        "paths": {
            "home": "/home/demo/.agenthalo",
            "db": "/home/demo/.agenthalo/traces.ndb",
            "credentials": "/home/demo/.agenthalo/credentials.json",
            "lean_project": "/workspace/lean",
        },
        "onchain": {
            "chain_name": "Base Sepolia",
            "chain_id": "84532",
            "contract_address": None,
        },
        "addons": {
            "p2pclaw": True,
            "agentpmt_workflows": False,
        },
        "agentpmt": {
            "enabled": False,
            "budget_tag": None,
            "endpoint": None,
            "auth_configured": False,
            "tool_count": 0,
        },
        "wallet_status": {
            "agentpmt_connected": False,
            "agentaddress_connected": False,
            "agentaddress_address": None,
        },
        "container_runtime": {
            "available": False,
            "engine": None,
        },
    }


def generate_addons():
    return {"addons": [], "available": 0}


# ---------- NucleusDB ----------
def generate_nucleusdb_status():
    return {
        "status": "open",
        "path": "/data/traces.ndb",
        "tables": ["sessions", "events", "attestations", "proofs", "memories"],
        "total_rows": 892,
        "size_mb": 14.2,
        "last_write": "2026-03-21T10:00:00Z",
    }


def generate_nucleusdb_browse():
    rows = []
    for i in range(20):
        rows.append({
            "table": ["sessions", "events", "attestations", "proofs", "memories"][i % 5],
            "key": deterministic_id("row", i),
            "preview": f"Row {i} data preview...",
            "size_bytes": 128 + i * 32,
        })
    return {"rows": rows, "total": 892, "page": 1, "page_size": 20}


def generate_nucleusdb_stats():
    return {
        "tables": {
            "sessions": {"rows": 12, "size_mb": 0.8},
            "events": {"rows": 640, "size_mb": 8.4},
            "attestations": {"rows": 48, "size_mb": 1.2},
            "proofs": {"rows": 22, "size_mb": 2.1},
            "memories": {"rows": 170, "size_mb": 1.7},
        },
        "total_rows": 892,
        "total_size_mb": 14.2,
    }


def generate_nucleusdb_sql():
    return {
        "columns": ["id", "agent_type", "model", "status", "cost_usd"],
        "rows": [
            [deterministic_id("sess", i), ["claude", "codex", "gemini"][i % 3],
             ["claude-opus-4-6", "codex-mini-latest", "gemini-2.5-pro"][i % 3],
             "completed", round(1.5 + i * 0.8, 2)]
            for i in range(5)
        ],
        "row_count": 5,
        "elapsed_ms": 12,
    }


def generate_nucleusdb_proofs():
    proofs = []
    proof_names = [
        "commit_certificate_sheaf_coherence", "ipa_opening_soundness",
        "nucleus_step_monotonicity", "certificate_refinement_chain",
        "consistency_proof_inclusion", "commitment_soundness_bind",
        "dual_authorization_composability", "hybrid_kem_security",
        "connectivity_preservation", "component_lifting_monotonicity",
        "trace_section_compatibility", "witness_chain_completeness",
    ]
    for i, name in enumerate(proof_names):
        proofs.append({
            "name": name,
            "lean_decl": f"NucleusDB.Core.{name.title().replace('_', '')}",
            "status": "verified",
            "hash": hashlib.sha256(name.encode()).hexdigest()[:16],
            "verified_at": f"2026-03-{(i % 28) + 1:02d}T06:00:00Z",
        })
    return {"proofs": proofs, "total": len(proofs), "all_verified": True}


def generate_nucleusdb_vectors():
    return {
        "dimensions": 768,
        "total_vectors": 500,
        "index_type": "hnsw",
        "metric": "cosine",
        "last_indexed": "2026-03-20T12:00:00Z",
    }


def generate_nucleusdb_memory():
    return {
        "memories": [
            {"id": deterministic_id("mem", i), "category": ["user", "feedback", "project", "reference"][i % 4],
             "summary": f"Memory entry {i}", "created_at": f"2026-03-{(i % 28) + 1:02d}T12:00:00Z"}
            for i in range(10)
        ],
        "total": 170,
    }


# ---------- Governor ----------
def generate_governor_status():
    return {
        "governors": [
            {"name": "compute", "status": "nominal", "utilization": 0.32, "limit": 100, "current": 32},
            {"name": "pty", "status": "nominal", "utilization": 0.10, "limit": 10, "current": 1},
            {"name": "proxy", "status": "nominal", "utilization": 0.0, "limit": 1000, "current": 0},
            {"name": "comms", "status": "nominal", "utilization": 0.05, "limit": 50, "current": 2},
        ]
    }


def generate_governor_proxy():
    return {
        "status": "nominal",
        "total_requests": 0,
        "active_requests": 0,
        "rate_limit": 1000,
        "cost_usd": 0.0,
    }


# ---------- Deploy ----------
def generate_deploy_catalog():
    return {
        "profiles": [
            {"name": "claude-opus", "agent": "claude", "model": "claude-opus-4-6", "status": "available",
             "description": "Full Claude Opus agent with MCP tool access"},
            {"name": "codex-worker", "agent": "codex", "model": "codex-mini-latest", "status": "available",
             "description": "Lightweight Codex worker for code tasks"},
            {"name": "gemini-analyst", "agent": "gemini", "model": "gemini-2.5-pro", "status": "available",
             "description": "Gemini agent for analysis and research"},
            {"name": "custom-local", "agent": "custom", "model": "local-llm", "status": "draft",
             "description": "Custom local model configuration"},
            {"name": "multi-agent-team", "agent": "orchestrator", "model": "multi", "status": "available",
             "description": "Multi-agent orchestrated workflow"},
        ]
    }


def generate_deploy_preflight():
    return {"ready": True, "checks": [
        {"name": "identity", "status": "pass"},
        {"name": "crypto", "status": "pass"},
        {"name": "proof_gate", "status": "pass"},
        {"name": "governor", "status": "pass"},
    ]}


# ---------- Models ----------
def generate_models_status():
    return {
        "models": [
            {"id": "claude-opus-4-6", "provider": "anthropic", "available": True, "context_window": 1000000},
            {"id": "codex-mini-latest", "provider": "openai", "available": True, "context_window": 200000},
            {"id": "gemini-2.5-pro", "provider": "google", "available": True, "context_window": 1000000},
        ]
    }


# ---------- Orchestrator ----------
def generate_orch_agents():
    return {
        "agents": [
            {"id": deterministic_id("agent", 0), "name": "Claude Opus", "status": "idle", "model": "claude-opus-4-6",
             "tasks_completed": 45, "trust_score": 0.96},
            {"id": deterministic_id("agent", 1), "name": "Codex Worker", "status": "idle", "model": "codex-mini-latest",
             "tasks_completed": 32, "trust_score": 0.91},
            {"id": deterministic_id("agent", 2), "name": "Gemini Analyst", "status": "active", "model": "gemini-2.5-pro",
             "tasks_completed": 28, "trust_score": 0.93},
        ]
    }


def generate_orch_tasks():
    tasks = []
    task_types = ["prove", "translate", "search", "review", "build"]
    for i in range(8):
        tasks.append({
            "id": deterministic_id("task", i),
            "type": task_types[i % len(task_types)],
            "status": "completed" if i < 6 else ("running" if i == 6 else "queued"),
            "agent": deterministic_id("agent", i % 3),
            "description": f"Task {i}: {task_types[i % len(task_types)]} operation",
            "created_at": f"2026-03-{15 + i:02d}T10:00:00Z",
        })
    return {"tasks": tasks}


def generate_orch_graph():
    return {
        "nodes": [
            {"id": "start", "type": "trigger", "label": "User Request"},
            {"id": "plan", "type": "planner", "label": "Task Planner"},
            {"id": "search", "type": "worker", "label": "Premise Search"},
            {"id": "prove", "type": "worker", "label": "Proof Attempt"},
            {"id": "verify", "type": "gate", "label": "Lean Verify"},
            {"id": "done", "type": "terminal", "label": "Complete"},
        ],
        "edges": [
            {"from": "start", "to": "plan"},
            {"from": "plan", "to": "search"},
            {"from": "plan", "to": "prove"},
            {"from": "search", "to": "prove"},
            {"from": "prove", "to": "verify"},
            {"from": "verify", "to": "done"},
        ],
    }


def generate_orch_mesh():
    return {"peers": [], "local_only": True, "mesh_enabled": False}


# ---------- Workflows ----------
def generate_workflows():
    wf_data = [
        {"name": "Proof Pipeline", "steps": 5, "last_run": "2026-03-20T14:00:00Z"},
        {"name": "Translation Batch", "steps": 3, "last_run": "2026-03-19T10:00:00Z"},
        {"name": "Nightly Verification", "steps": 7, "last_run": "2026-03-21T02:00:00Z"},
    ]
    workflows = []
    for i, wf in enumerate(wf_data):
        wf_id = deterministic_id("wf", i)
        workflows.append({
            "workflow_id": wf_id,
            "id": wf_id,
            "name": wf["name"],
            "status": "idle",
            "steps": wf["steps"],
            "last_run": wf["last_run"],
            "created_at": 1710900000 + i * 86400,
            "updated_at": 1710900000 + i * 86400,
            "data": {"last_node_id": 3, "last_link_id": 2, "nodes": [
                {"id": 1, "type": "agent/invoke", "pos": [100, 200], "size": [180, 60],
                 "properties": {"agent": "claude", "model": "claude-opus-4-6"}},
                {"id": 2, "type": "tool/search", "pos": [350, 200], "size": [180, 60],
                 "properties": {"tool": "prove_assist"}},
                {"id": 3, "type": "gate/verify", "pos": [600, 200], "size": [180, 60],
                 "properties": {"gate": "lean_check"}},
            ], "links": [[1, 1, 0, 2, 0, ""], [2, 2, 0, 3, 0, ""]]},
        })
    return {"workflows": workflows}


# ---------- P2PCLAW ----------
def generate_p2pclaw_status():
    return {
        "registered": True,
        "agent_id": deterministic_id("p2p", 0),
        "agent_name": "halo-demo-agent",
        "network": "mainnet",
        "peers_discovered": 12,
        "papers_submitted": 3,
        "papers_reviewed": 5,
    }


def generate_p2pclaw_briefing():
    return {
        "date": "2026-03-21",
        "summary": "Network healthy. 12 peers online. 3 new papers submitted today.",
        "highlights": [
            "New peer joined: verified-prover-7",
            "Paper accepted: Constructive Sheaf Cohomology",
            "Trust score updated: 0.94 -> 0.95",
        ],
    }


def generate_p2pclaw_papers():
    papers = []
    titles = [
        "Constructive Sheaf Cohomology in Lean 4",
        "Post-Quantum Key Exchange for Agent Communication",
        "Verifiable Database Commitments via Nucleus Operators",
        "Categorical Foundations of Agent Trust Scoring",
        "Machine-Checked Witness Chains for Audit Trails",
    ]
    for i, title in enumerate(titles):
        papers.append({
            "id": deterministic_id("paper", i),
            "title": title,
            "status": ["accepted", "review", "accepted", "review", "submitted"][i],
            "submitted_at": f"2026-03-{10 + i:02d}T12:00:00Z",
            "authors": ["Demo Author"],
            "score": round(0.7 + i * 0.05, 2),
        })
    return {"papers": papers}


def generate_p2pclaw_events():
    return {"events": [
        {"type": "peer_joined", "peer": "verified-prover-7", "at": "2026-03-21T08:00:00Z"},
        {"type": "paper_accepted", "paper": "Constructive Sheaf Cohomology", "at": "2026-03-21T07:00:00Z"},
        {"type": "trust_updated", "old": 0.94, "new": 0.95, "at": "2026-03-21T06:00:00Z"},
    ]}


def generate_p2pclaw_wheel():
    return {"segments": [
        {"label": "Prove", "weight": 0.35, "color": "#35ff3e"},
        {"label": "Review", "weight": 0.25, "color": "#ff6a00"},
        {"label": "Search", "weight": 0.20, "color": "#4ba3ff"},
        {"label": "Translate", "weight": 0.12, "color": "#c49bff"},
        {"label": "Mentor", "weight": 0.08, "color": "#ff9f2a"},
    ]}


# ---------- CodeGuard ----------
def generate_codeguard_manifest():
    artifacts = []
    names = [
        "NucleusDB.Core.CommitCert", "NucleusDB.Core.ShellAuth",
        "Halo.Crypto.HybridKem", "Halo.Trust.MerkleVerify",
        "Halo.Identity.GenesisDerive", "Halo.ProofGate.SurfaceCheck",
        "Halo.Comms.DIDCommSign", "Halo.Governor.AdmitCheck",
        "NucleusDB.Core.AppendSeal", "Halo.Witness.ChainComplete",
    ]
    for i, name in enumerate(names):
        artifacts.append({
            "id": deterministic_id("cg", i),
            "name": name,
            "stage": ["locked", "locked", "review", "locked", "locked",
                      "locked", "review", "locked", "locked", "locked"][i],
            "hash": hashlib.sha256(name.encode()).hexdigest()[:16],
            "locked_at": f"2026-03-{10 + i:02d}T12:00:00Z" if i != 2 else None,
        })
    return {
        "ok": True,
        "manifest": {"artifacts": artifacts, "locked_count": 8, "review_count": 2, "total": 10},
        "path": "/workspace/.codeguard/manifest.json",
        "artifacts": artifacts, "locked_count": 8, "review_count": 2, "total": 10,
    }


def generate_codeguard_graph():
    return {
        "ok": True,
        "graph": {
            "nodes": [
                {"id": n, "label": n.split(".")[-1]}
                for n in ["CommitCert", "ShellAuth", "HybridKem", "MerkleVerify", "GenesisDerive"]
            ],
            "edges": [
                {"from": "CommitCert", "to": "MerkleVerify"},
                {"from": "ShellAuth", "to": "GenesisDerive"},
                {"from": "HybridKem", "to": "GenesisDerive"},
                {"from": "MerkleVerify", "to": "CommitCert"},
            ],
        },
    }


def generate_codeguard_config():
    return {"ok": True, "auto_lock": True, "review_required": True, "audit_log_enabled": True}


def generate_codeguard_audit():
    return {"entries": [
        {"action": "lock", "artifact": "NucleusDB.Core.CommitCert", "by": "claude",
         "at": "2026-03-15T10:00:00Z", "reason": "Proof verified"},
        {"action": "review_request", "artifact": "Halo.Crypto.HybridKem", "by": "codex",
         "at": "2026-03-16T14:00:00Z", "reason": "Algorithm update"},
    ]}


# ---------- Gates ----------
def generate_gates_status():
    return {
        "categories": [
            {
                "name": "git_worktree",
                "gates": [
                    {"name": "no_sorry_guard", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                    {"name": "build_wfail", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                    {"name": "exe_builds", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                ],
            },
            {
                "name": "communication",
                "gates": [
                    {"name": "privacy_controller", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                    {"name": "nym_connectivity", "status": "skip", "last_checked": "2026-03-21T06:00:00Z"},
                    {"name": "didcomm_signing", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                ],
            },
            {
                "name": "internal",
                "gates": [
                    {"name": "proof_gate", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                    {"name": "trust_threshold", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                    {"name": "governor_limits", "status": "pass", "last_checked": "2026-03-21T06:00:00Z"},
                ],
            },
        ]
    }


def generate_gates_categories():
    return generate_gates_status()["categories"]


# ---------- Forge ----------
def generate_forge_templates():
    return {
        "templates": [
            {"id": "natural_language", "name": "Natural Language", "description": "Describe your theorem in English",
             "icon": "pencil"},
            {"id": "latex", "name": "LaTeX Input", "description": "Paste LaTeX formula",
             "icon": "formula"},
            {"id": "lean4_stub", "name": "Lean 4 Stub", "description": "Start with a Lean 4 sorry stub",
             "icon": "code"},
            {"id": "mathlib_search", "name": "Mathlib Search", "description": "Find and extend existing Mathlib lemmas",
             "icon": "search"},
            {"id": "paper_extract", "name": "Paper Extract", "description": "Extract theorem from academic paper",
             "icon": "document"},
        ]
    }


def generate_forge_history():
    return {
        "jobs": [
            {"id": deterministic_id("forge", i),
             "input_mode": ["natural_language", "latex", "lean4_stub", "mathlib_search", "paper_extract"][i % 5],
             "status": "completed" if i < 4 else "running",
             "created_at": f"2026-03-{15 + i:02d}T10:00:00Z",
             "lean_output": f"theorem demo_thm_{i} : True := trivial" if i < 4 else None}
            for i in range(5)
        ]
    }


# ---------- Explorer ----------
def generate_explorer_status():
    return {"server": "static", "mode": "fallback", "declarations": 500, "ready": True}


def generate_explorer_library():
    """~500 curated Mathlib-like declarations."""
    decls = []
    modules = [
        "Mathlib.Algebra.Group.Basic", "Mathlib.Algebra.Ring.Basic",
        "Mathlib.Algebra.Order.Ring.Defs", "Mathlib.Topology.Basic",
        "Mathlib.Topology.MetricSpace.Basic", "Mathlib.CategoryTheory.Functor.Basic",
        "Mathlib.CategoryTheory.NatTrans", "Mathlib.Analysis.NormedSpace.Basic",
        "Mathlib.LinearAlgebra.Basic", "Mathlib.Data.Nat.Basic",
    ]
    decl_templates = [
        ("add_comm", "theorem", "a + b = b + a"),
        ("mul_assoc", "theorem", "(a * b) * c = a * (b * c)"),
        ("zero_add", "theorem", "0 + a = a"),
        ("one_mul", "theorem", "1 * a = a"),
        ("neg_add_cancel", "theorem", "-a + a = 0"),
        ("Monoid", "structure", "class Monoid (M : Type)"),
        ("Group", "structure", "class Group (G : Type)"),
        ("Ring", "structure", "class Ring (R : Type)"),
        ("TopologicalSpace", "structure", "class TopologicalSpace (X : Type)"),
        ("Functor", "structure", "structure Functor (C D : Category)"),
    ]
    for i in range(500):
        base_name, kind, type_sig = decl_templates[i % len(decl_templates)]
        mod = modules[i % len(modules)]
        name = f"{base_name}_{i}" if i >= len(decl_templates) else base_name
        decls.append({
            "name": f"{mod}.{name}",
            "kind": kind,
            "type": f"{type_sig} -- variant {i}" if i >= len(decl_templates) else type_sig,
            "module": mod,
            "doc": f"Declaration {name} from {mod.split('.')[-1]}",
        })
    return {"declarations": decls, "total": len(decls)}


def generate_explorer_loogle():
    return {"results": [], "query": "", "message": "Enter a type signature to search"}


def generate_explorer_proofs():
    return generate_nucleusdb_proofs()


# ---------- Observatory ----------
def generate_observatory_status():
    return {"modules": 42, "declarations": 500, "dependencies": 1247, "ready": True}


def generate_observatory_treemap():
    modules = [
        {"name": "Algebra", "size": 120, "children": [
            {"name": "Group", "size": 45}, {"name": "Ring", "size": 38},
            {"name": "Order", "size": 37},
        ]},
        {"name": "Topology", "size": 85, "children": [
            {"name": "Basic", "size": 30}, {"name": "MetricSpace", "size": 35},
            {"name": "Uniform", "size": 20},
        ]},
        {"name": "CategoryTheory", "size": 70, "children": [
            {"name": "Functor", "size": 25}, {"name": "NatTrans", "size": 22},
            {"name": "Limits", "size": 23},
        ]},
        {"name": "Analysis", "size": 60, "children": [
            {"name": "NormedSpace", "size": 28}, {"name": "Calculus", "size": 32},
        ]},
        {"name": "LinearAlgebra", "size": 45, "children": [
            {"name": "Basic", "size": 20}, {"name": "Matrix", "size": 25},
        ]},
    ]
    # proof-explorer.js expects treemap.files[] with {path, lines, decl_count, sorry_count}
    file_templates = [
        ("Algebra/Group/Basic.lean", 450, 32, 0),
        ("Algebra/Group/Hom.lean", 380, 24, 0),
        ("Algebra/Ring/Basic.lean", 520, 41, 0),
        ("Algebra/Ring/Ideal.lean", 310, 18, 0),
        ("Algebra/Order/Ring.lean", 290, 15, 0),
        ("Topology/Basic.lean", 400, 28, 0),
        ("Topology/MetricSpace/Basic.lean", 560, 35, 0),
        ("Topology/MetricSpace/Lipschitz.lean", 280, 12, 0),
        ("Topology/Uniform/Basic.lean", 340, 20, 0),
        ("CategoryTheory/Functor/Basic.lean", 480, 30, 0),
        ("CategoryTheory/NatTrans.lean", 360, 22, 0),
        ("CategoryTheory/Limits/Basic.lean", 420, 26, 0),
        ("Analysis/NormedSpace/Basic.lean", 510, 34, 0),
        ("Analysis/Calculus/Deriv.lean", 440, 28, 0),
        ("LinearAlgebra/Basic.lean", 350, 19, 0),
        ("LinearAlgebra/Matrix/Basic.lean", 490, 31, 0),
    ]
    files = [
        {"path": path, "lines": lines, "decl_count": decls, "sorry_count": sorry}
        for path, lines, decls, sorry in file_templates
    ]
    return {"modules": modules, "files": files}


def generate_observatory_depgraph():
    nodes = ["Algebra.Group", "Algebra.Ring", "Topology.Basic",
             "CategoryTheory.Functor", "Analysis.NormedSpace"]
    edges = [
        {"from": "Algebra.Ring", "to": "Algebra.Group"},
        {"from": "Analysis.NormedSpace", "to": "Topology.Basic"},
        {"from": "Analysis.NormedSpace", "to": "Algebra.Group"},
    ]
    return {"nodes": [{"id": n, "label": n} for n in nodes], "edges": edges}


# ---------- Skills ----------
def generate_skills():
    skill_names = [
        "formal-proof", "proof-strategy-polya", "proof-stuck-recovery",
        "mathematical-intuition", "proof-tree", "multi-model-atp",
        "evolutionary-search", "premise-retrieval", "tactic-selection",
        "axiom-trust-audit", "paper-to-overlay", "paper-review-ui-queue",
        "skill-and-mcp-maintenance", "skill-authoring", "pre-project-autonomous-system-bootstrap",
        "post-project-review", "research-completed", "repo-standards",
        "meta-atp", "meta-proof",
    ]
    return {
        "skills": [
            {"name": name, "status": "active", "invocations": (i * 13 + 5) % 40,
             "last_used": f"2026-03-{(i % 21) + 1:02d}T12:00:00Z"}
            for i, name in enumerate(skill_names)
        ],
        "total": len(skill_names),
    }


# ---------- Identity ----------
def generate_identity_status():
    return {
        "did": "did:halo:z6Mkdemo1234567890abcdef",
        "evm_address": "0xDEMO000000000000000000000000000000000001",
        "created_at": "2026-03-01T00:00:00Z",
        "key_pairs": {
            "ed25519": {"public": "demo_ed25519_pub_key_placeholder"},
            "ml_dsa_65": {"public": "demo_ml_dsa_pub_key_placeholder"},
            "x25519": {"public": "demo_x25519_pub_key_placeholder"},
            "ml_kem_768": {"public": "demo_ml_kem_pub_key_placeholder"},
            "secp256k1": {"public": "demo_secp256k1_pub_key_placeholder"},
        },
        "sovereign_binding": True,
    }


def generate_profile():
    return {
        "name": "Demo Agent",
        "did": "did:halo:z6Mkdemo1234567890abcdef",
        "agent_type": "multi",
        "trust_score": 0.94,
    }


# ---------- Files ----------
def generate_files_tree():
    return {
        "tree": [
            {"name": "lean/", "type": "dir", "children": [
                {"name": "HeytingLean/", "type": "dir", "children": [
                    {"name": "Bridge.lean", "type": "file", "size": 25600},
                    {"name": "Derives.lean", "type": "file", "size": 58000},
                ]},
                {"name": "lakefile.lean", "type": "file", "size": 3200},
            ]},
            {"name": "src/", "type": "dir", "children": [
                {"name": "dashboard/", "type": "dir", "children": [
                    {"name": "api.rs", "type": "file", "size": 45000},
                    {"name": "mod.rs", "type": "file", "size": 12000},
                ]},
            ]},
        ]
    }


# ---------- Misc ----------
def generate_networking():
    return {"available": ["libp2p", "didcomm", "nym"], "active": ["didcomm"]}


def generate_metrics_diversity():
    return {"shannon_entropy": 2.14, "unique_tactics": 28, "tactic_distribution": {
        "simp": 0.25, "exact": 0.20, "rfl": 0.15, "apply": 0.12, "ring": 0.08, "other": 0.20
    }}


def generate_metrics_topology():
    return {"components": 3, "edges": 47, "density": 0.12, "avg_degree": 4.2}


def generate_vault_keys():
    return {"keys": [
        {"name": "ed25519", "type": "signing", "created": "2026-03-01T00:00:00Z"},
        {"name": "ml_dsa_65", "type": "pq_signing", "created": "2026-03-01T00:00:00Z"},
        {"name": "x25519", "type": "key_exchange", "created": "2026-03-01T00:00:00Z"},
        {"name": "ml_kem_768", "type": "pq_kem", "created": "2026-03-01T00:00:00Z"},
        {"name": "secp256k1", "type": "evm", "created": "2026-03-01T00:00:00Z"},
    ]}


def generate_wdk_status():
    return {"available": False, "reason": "WDK not configured in demo mode"}


def generate_wdk_available():
    return {"available": False}


def generate_x402_summary():
    return {"enabled": True, "total_payments": 0, "total_usd": 0.0}


def generate_x402_balance():
    return {"usdc": 0.0, "chain": "base", "address": "0xDEMO000000000000000000000000000000000001"}


def generate_containers():
    return {"containers": [], "total": 0}


def generate_agents_list():
    return {"agents": [
        {"id": deterministic_id("agent", 0), "name": "Claude Opus", "type": "claude", "status": "registered"},
        {"id": deterministic_id("agent", 1), "name": "Codex Worker", "type": "codex", "status": "registered"},
        {"id": deterministic_id("agent", 2), "name": "Gemini Analyst", "type": "gemini", "status": "registered"},
    ]}


def generate_lean_scan():
    """Lean project scan result expected by proof-game.js."""
    return {
        "ok": True,
        "tree": {
            "children": [
                {"name": "HeytingLean", "type": "dir", "children": [
                    {"name": "Bridge.lean", "type": "file", "path": "HeytingLean/Bridge.lean", "size": 25600},
                    {"name": "Derives.lean", "type": "file", "path": "HeytingLean/Derives.lean", "size": 58000},
                    {"name": "Context.lean", "type": "file", "path": "HeytingLean/Context.lean", "size": 8200},
                    {"name": "Supports.lean", "type": "file", "path": "HeytingLean/Supports.lean", "size": 12400},
                    {"name": "ATheory", "type": "dir", "children": [
                        {"name": "AssemblyCore.lean", "type": "file", "path": "HeytingLean/ATheory/AssemblyCore.lean", "size": 15000},
                        {"name": "HeytingAlgebra.lean", "type": "file", "path": "HeytingLean/ATheory/HeytingAlgebra.lean", "size": 9800},
                    ]},
                    {"name": "NucleusDB", "type": "dir", "children": [
                        {"name": "Core.lean", "type": "file", "path": "HeytingLean/NucleusDB/Core.lean", "size": 18000},
                        {"name": "Proofs.lean", "type": "file", "path": "HeytingLean/NucleusDB/Proofs.lean", "size": 22000},
                    ]},
                ]},
                {"name": "lakefile.lean", "type": "file", "path": "lakefile.lean", "size": 3200},
            ],
        },
    }


def generate_proof_gate_certificates():
    """Proof gate certificates expected by gates.js and system-monitor.js."""
    certs = []
    cert_names = [
        "commit_certificate", "sheaf_coherence", "ipa_opening",
        "nucleus_step_mono", "cert_refinement", "consistency_inclusion",
        "commitment_soundness", "dual_auth", "hybrid_kem",
        "connectivity_preserve", "component_lifting", "witness_chain",
    ]
    for i, name in enumerate(cert_names):
        certs.append({
            "filename": f"{name}.lean4export",
            "verification": {
                "all_checked": True,
                "declarations_checked": 3 + i * 2,
                "errors": [],
            },
            "hash": hashlib.sha256(name.encode()).hexdigest()[:16],
        })
    return {"certificates": certs}


def generate_workflow_instances():
    """Workflow execution history expected by orchestration.js."""
    return {
        "instances": [
            {
                "id": deterministic_id("wfi", i),
                "workflow_id": deterministic_id("wf", i % 3),
                "status": ["completed", "completed", "completed", "running", "failed"][i % 5],
                "started_at": f"2026-03-{15 + i:02d}T10:00:00Z",
                "ended_at": f"2026-03-{15 + i:02d}T10:30:00Z" if i % 5 < 3 else None,
            }
            for i in range(5)
        ]
    }


def generate_files_git_status():
    """Git status expected by observatory.js."""
    return {
        "changed": [
            {"path": "lean/HeytingLean/Bridge.lean", "status": "M"},
            {"path": "lean/HeytingLean/Derives.lean", "status": "M"},
            {"path": "scripts/prove_assist.py", "status": "M"},
        ]
    }


def generate_files_recent():
    """Recently opened files expected by observatory.js."""
    return {
        "files": [
            {"path": "lean/HeytingLean/Bridge.lean", "opened_at": "2026-03-21T10:00:00Z"},
            {"path": "lean/HeytingLean/Derives.lean", "opened_at": "2026-03-21T09:30:00Z"},
            {"path": "lean/HeytingLean/Context.lean", "opened_at": "2026-03-21T09:00:00Z"},
            {"path": "src/dashboard/api.rs", "opened_at": "2026-03-20T16:00:00Z"},
            {"path": "scripts/prove_assist.py", "opened_at": "2026-03-20T14:00:00Z"},
        ]
    }


def generate_library_status():
    return {"status": "ready", "sessions": 12, "total_events": 3247}


def generate_library_sessions():
    return generate_sessions()


# ---------- Main ----------
def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Generating fixtures in {OUT_DIR}...")

    generators = {
        # Status
        "status": generate_status,
        "system-snapshot": generate_system_snapshot,
        "capabilities": generate_capabilities,
        # Cockpit
        "cockpit-sessions": generate_cockpit_sessions,
        "cockpit-session-action": generate_cockpit_session_action,
        # Crypto
        "crypto-status": generate_crypto_status,
        "genesis-status": generate_genesis_status,
        # Sessions
        "sessions": generate_sessions,
        "session-detail": generate_session_detail,
        # Costs
        "costs": generate_costs,
        "costs-daily": generate_costs_daily,
        "costs-by-agent": generate_costs_by_agent,
        "costs-by-model": generate_costs_by_model,
        "costs-paid": generate_costs_paid,
        # Trust
        "trust": generate_trust,
        "attestations": generate_attestations,
        "attestation-verify": generate_attestation_verify,
        # Proof Gate
        "proof-gate": generate_proof_gate,
        # MCP Tools
        "mcp-tools": generate_mcp_tools,
        "mcp-categories": generate_mcp_categories,
        "mcp-usage-stats": generate_mcp_usage_stats,
        # Config
        "config": generate_config,
        "addons": generate_addons,
        # NucleusDB
        "nucleusdb-status": generate_nucleusdb_status,
        "nucleusdb-browse": generate_nucleusdb_browse,
        "nucleusdb-stats": generate_nucleusdb_stats,
        "nucleusdb-sql": generate_nucleusdb_sql,
        "nucleusdb-proofs": generate_nucleusdb_proofs,
        "nucleusdb-vectors": generate_nucleusdb_vectors,
        "nucleusdb-memory": generate_nucleusdb_memory,
        # Governor
        "governor-status": generate_governor_status,
        "governor-proxy": generate_governor_proxy,
        # Deploy
        "deploy-catalog": generate_deploy_catalog,
        "deploy-preflight": generate_deploy_preflight,
        # Models
        "models-status": generate_models_status,
        # Orchestrator
        "orch-agents": generate_orch_agents,
        "orch-tasks": generate_orch_tasks,
        "orch-graph": generate_orch_graph,
        "orch-mesh": generate_orch_mesh,
        # Workflows
        "workflows": generate_workflows,
        # P2PCLAW
        "p2pclaw-status": generate_p2pclaw_status,
        "p2pclaw-briefing": generate_p2pclaw_briefing,
        "p2pclaw-papers": generate_p2pclaw_papers,
        "p2pclaw-events": generate_p2pclaw_events,
        "p2pclaw-wheel": generate_p2pclaw_wheel,
        # CodeGuard
        "codeguard-manifest": generate_codeguard_manifest,
        "codeguard-graph": generate_codeguard_graph,
        "codeguard-config": generate_codeguard_config,
        "codeguard-audit": generate_codeguard_audit,
        # Gates
        "gates-status": generate_gates_status,
        "gates-categories": generate_gates_categories,
        # Forge
        "forge-templates": generate_forge_templates,
        "forge-history": generate_forge_history,
        # Explorer
        "explorer-status": generate_explorer_status,
        "explorer-library": generate_explorer_library,
        "explorer-loogle": generate_explorer_loogle,
        "explorer-proofs": generate_explorer_proofs,
        # Observatory
        "observatory-status": generate_observatory_status,
        "observatory-treemap": generate_observatory_treemap,
        "observatory-depgraph": generate_observatory_depgraph,
        # Skills
        "skills": generate_skills,
        # Identity
        "identity-status": generate_identity_status,
        "profile": generate_profile,
        # Files
        "files-tree": generate_files_tree,
        # Networking / Metrics
        "networking": generate_networking,
        "metrics-diversity": generate_metrics_diversity,
        "metrics-topology": generate_metrics_topology,
        # Vault / WDK / x402
        "vault-keys": generate_vault_keys,
        "wdk-status": generate_wdk_status,
        "wdk-available": generate_wdk_available,
        "x402-summary": generate_x402_summary,
        "x402-balance": generate_x402_balance,
        # Containers / Agents
        "containers": generate_containers,
        "agents-list": generate_agents_list,
        # Library
        "library-status": generate_library_status,
        "library-sessions": generate_library_sessions,
        # Lean scan
        "lean-scan": generate_lean_scan,
        # Proof gate certificates
        "proof-gate-certificates": generate_proof_gate_certificates,
        # Workflow instances
        "workflow-instances": generate_workflow_instances,
        # Files (observatory)
        "files-git-status": generate_files_git_status,
        "files-recent": generate_files_recent,
    }

    for name, gen in generators.items():
        write(name, gen())

    print(f"\nGenerated {len(generators)} fixture files.")


if __name__ == "__main__":
    main()
