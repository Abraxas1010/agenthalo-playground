// demo-banner.js — "INTERACTIVE DEMO" overlay with install CTA
(function() {
  "use strict";

  // Feature capability map — updated as WASM modules are added (Phase B)
  window.__PLAYGROUND_FEATURES = {
    crypto:     { live: false, label: "Crypto Verification" },
    proofGate:  { live: false, label: "Proof Gate" },
    trust:      { live: false, label: "Trust Scoring" },
    sessions:   { live: false, label: "Session Browser" },
    costs:      { live: false, label: "Cost Analysis" },
    cockpit:    { live: false, label: "Terminal Cockpit" },
    deploy:     { live: false, label: "Agent Deploy" },
    nucleusdb:  { live: false, label: "NucleusDB Console" },
    forge:      { live: false, label: "Forge Pipeline" },
    explorer:   { live: false, label: "Proof Explorer" },
  };

  function createBanner() {
    var el = document.createElement("div");
    el.id = "playground-banner";
    el.innerHTML =
      '<div style="' +
        'position:fixed; top:10px; right:10px; z-index:99999;' +
        'background:rgba(10,16,8,0.92); border:1px solid rgba(255,106,0,0.5);' +
        'border-radius:8px; padding:8px 16px;' +
        "font-family:'Courier New',monospace; font-size:11px; color:#ff6a00;" +
        'backdrop-filter:blur(12px); pointer-events:auto;' +
        'display:flex; align-items:center; gap:10px;' +
        'box-shadow: 0 0 20px rgba(255,106,0,0.1);' +
      '">' +
        '<span style="color:#ff6a00; font-weight:bold; letter-spacing:1px;">' +
          '&#9658; INTERACTIVE DEMO' +
        '</span>' +
        '<span style="color:rgba(255,255,255,0.35); font-size:9px;">' +
          'Simulated environment' +
        '</span>' +
        '<a href="https://github.com/Abraxas1010/agenthalo" target="_blank"' +
           ' rel="noreferrer"' +
           ' style="color:#35ff3e; text-decoration:none; font-size:10px;' +
                  ' border:1px solid rgba(53,255,62,0.3); padding:2px 8px;' +
                  ' border-radius:4px;">' +
          'Install for real &#8594;' +
        '</a>' +
      '</div>';
    document.body.appendChild(el);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBanner);
  } else {
    createBanner();
  }
})();
