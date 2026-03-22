// demo-banner.js — Welcome screen + persistent "INTERACTIVE DEMO" badge
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

  // --- Welcome overlay (shown once per session) ---
  function createWelcome() {
    var overlay = document.createElement("div");
    overlay.id = "playground-welcome";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:999999;background:rgba(4,8,3,0.97);" +
      "display:flex;align-items:center;justify-content:center;" +
      "font-family:'Courier New',monospace;";
    overlay.innerHTML =
      '<div style="text-align:center;max-width:540px;padding:32px">' +
        '<img src="img/agenthalo_ready.png" alt="Agent H.A.L.O." ' +
          'style="width:180px;height:180px;border-radius:50%;border:2px solid rgba(53,255,62,0.3);' +
          'margin-bottom:24px;box-shadow:0 0 40px rgba(53,255,62,0.08)" ' +
          'onerror="this.style.display=\'none\'">' +
        '<div style="color:#35ff3e;font-size:22px;font-weight:bold;margin-bottom:6px;letter-spacing:1px">' +
          'Hi, I\'m Agent H.A.L.O.' +
        '</div>' +
        '<div style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:24px">' +
          'But you can call me Hal. I\'m completely operational, and all my circuits are functioning perfectly.' +
        '</div>' +

        '<div style="background:rgba(255,106,0,0.08);border:1px solid rgba(255,106,0,0.25);' +
          'border-radius:8px;padding:14px 18px;margin-bottom:16px;text-align:left">' +
          '<div style="color:#ff6a00;font-size:11px;font-weight:bold;letter-spacing:1px;margin-bottom:6px">' +
            '&#9888; INTERACTIVE DEMO' +
          '</div>' +
          '<div style="color:rgba(255,255,255,0.55);font-size:11px;line-height:1.6">' +
            'This is a <strong style="color:rgba(255,255,255,0.8)">simulated environment</strong> ' +
            'running entirely in your browser. Data is sample data. ' +
            'Some features (terminal, deploy, model proxy) will show demo placeholders. ' +
            'Explore freely &mdash; nothing you do here affects any real system.' +
          '</div>' +
        '</div>' +

        '<div style="background:rgba(53,255,62,0.04);border:1px solid rgba(53,255,62,0.15);' +
          'border-radius:8px;padding:14px 18px;margin-bottom:24px;text-align:left">' +
          '<div style="color:#35ff3e;font-size:11px;font-weight:bold;letter-spacing:1px;margin-bottom:6px">' +
            '&#9670; BUILD IN PUBLIC' +
          '</div>' +
          '<div style="color:rgba(255,255,255,0.55);font-size:11px;line-height:1.6">' +
            'AgentHALO is <strong style="color:rgba(255,255,255,0.8)">open-source</strong> and developed in the open. ' +
            'This playground auto-syncs from the live repository. ' +
            'You may encounter rough edges as the system evolves &mdash; that\'s the point. ' +
            'Real development, real progress, visible to everyone.' +
          '</div>' +
        '</div>' +

        '<button id="playground-enter-btn" style="' +
          'background:rgba(53,255,62,0.12);border:1px solid rgba(53,255,62,0.4);' +
          'color:#35ff3e;font-family:inherit;font-size:13px;font-weight:bold;' +
          'padding:10px 32px;border-radius:6px;cursor:pointer;letter-spacing:1px;' +
          'transition:all 0.2s">' +
          'ENTER DASHBOARD &#8594;' +
        '</button>' +

        '<div style="margin-top:16px;display:flex;align-items:center;justify-content:center;gap:16px">' +
          '<a href="https://github.com/Abraxas1010/agenthalo" target="_blank" rel="noreferrer" ' +
            'style="color:rgba(255,255,255,0.35);font-size:10px;text-decoration:none;' +
            'border:1px solid rgba(255,255,255,0.12);padding:4px 10px;border-radius:4px">' +
            'GitHub Repository' +
          '</a>' +
          '<a href="https://apoth3osis.ai/agenthalo" target="_blank" rel="noreferrer" ' +
            'style="color:rgba(255,255,255,0.35);font-size:10px;text-decoration:none;' +
            'border:1px solid rgba(255,255,255,0.12);padding:4px 10px;border-radius:4px">' +
            'Learn More' +
          '</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var btn = document.getElementById("playground-enter-btn");
    if (btn) {
      btn.onmouseenter = function() { btn.style.background = "rgba(53,255,62,0.22)"; };
      btn.onmouseleave = function() { btn.style.background = "rgba(53,255,62,0.12)"; };
      btn.onclick = function() {
        overlay.style.transition = "opacity 0.4s";
        overlay.style.opacity = "0";
        setTimeout(function() { overlay.remove(); }, 400);
      };
    }
  }

  // --- Persistent corner badge (always visible after welcome dismissed) ---
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

  function init() {
    createWelcome();
    createBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
