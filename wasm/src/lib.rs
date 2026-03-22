// AgentHALO Playground WASM module
// Phase B: progressive enhancement — replace fixture stubs with real computation.
//
// Priority order:
// 1. Crypto (ed25519, ML-KEM, SHA-256)
// 2. Proof Gate verification
// 3. Trust score computation
// 4. Cost computation
// 5. NucleusDB in-memory SQL
// 6. Merkle proof verification

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn playground_version() -> String {
    "0.1.0".to_string()
}

#[wasm_bindgen]
pub fn playground_capabilities() -> String {
    serde_json::json!({
        "crypto": false,
        "proof_gate": false,
        "trust": false,
        "cost": false,
        "nucleusdb_sql": false,
        "merkle": false,
    })
    .to_string()
}
