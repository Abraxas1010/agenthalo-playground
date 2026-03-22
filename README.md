# AgentHALO Playground

Interactive browser-based demo of the [AgentHALO](https://github.com/Abraxas1010/agenthalo) dashboard.

**This repo is auto-generated.** Do not edit `dashboard/` directly — it is overwritten
by `scripts/transform_from_agenthalo.sh` on every sync from the source repo.

## What This Is

A fully interactive version of the AgentHALO dashboard that runs entirely in the browser
with zero backend. API calls are intercepted by `demo-api.js` and served from static
JSON fixtures. Some features compute live via WASM (progressive enhancement).

## How It Works

```
agenthalo (source) → GitHub Action → agenthalo-playground (this repo) → GitHub Action → apoth3osis_webapp → Vercel
```

1. Developer pushes to `agenthalo/dashboard/**`
2. GitHub Action runs `transform_from_agenthalo.sh`
3. Transformed output pushed here
4. Second GitHub Action syncs `dashboard/` to `apoth3osis_webapp/public/agenthalo-demo/`
5. Vercel auto-deploys

## Local Development

```bash
# Generate fixtures from data/
python3 scripts/generate_fixtures.py

# Run transform (requires agenthalo repo checkout)
bash scripts/transform_from_agenthalo.sh /path/to/agenthalo

# Serve locally
cd dashboard && python3 -m http.server 8080
```

## Editing

- **Fixture data:** Edit `data/*.json`, then run `scripts/generate_fixtures.py`
- **Demo API adapter:** Edit `src/demo-api.js`
- **Demo banner:** Edit `src/demo-banner.js`
- **Dashboard UI:** Edit in the `agenthalo` repo — changes auto-sync here

## License

MIT — same as [AgentHALO](https://github.com/Abraxas1010/agenthalo).
