# Agents Guide for voisona-talk-api

This document provides specialized context for AI agents working on or with the `voisona-talk-api` library.

## Project Essence

A TypeScript wrapper for the VoiSona Talk Editor REST API (v0.9.0). It focuses on type safety, developer intuition, and automated polling for asynchronous speech synthesis tasks.

## Key Architectural Decisions

- **Modern ESM**: The project uses `moduleResolution: "bundler"`. **Do not** use extensions in imports (e.g., use `import { ... } from './types'`).
- **Dual Compatibility**: tsup generates both CJS (`.cjs`) and ESM (`.js`) outputs. `package.json` handles mapping via `exports`.
- **Native Fetch**: Uses the built-in `fetch` API (Node 18+). No external HTTP clients like axios.
- **Client-Centric**: Most interactions should go through `VoisonaClient`.
- **WAV Output**: Default behavior for synthesis is saving to the `output/` directory in the current working directory.

## Core API Patterns

### Initialization

```typescript
const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
  baseUrl: 'http://localhost:32766/api/talk/v1', // Optional
});
```

### Synthesis with Polling (Recommended)

Use `synthesizeAndWait` instead of raw `requestSpeechSynthesis` for standard tasks. It handles the queue and returns the final file path.

### Emotion Handling

Always use `client.getStyleWeights(voiceInfo, styleMap)` to map emotion names to the required array indices. Do not attempt to guess indices.

## Development Standards

- **Testing**: Use `vitest`. Mock `fetch` globally using `vi.stubGlobal('fetch', ...)`.
- **Build**: Managed by `tsup`. Entry point is `src/index.ts`.
- **Tagging**: Automated via Husky and `scripts/tag-version.js` on `git push`.
- **Documentation**: JSDoc is mandatory for all exported methods and interfaces. Refer to `docs/talk_api.yaml` for precise range and constraint values.

## Agent Hooks

This project uses Gemini CLI hooks to automate development standards:

- **Prettier Enforcer (`AfterTool`)**: Automatically runs `pnpm exec prettier --write` after any `write_file` or `replace` tool call. This ensures the codebase always stays formatted according to the project's rules without manual intervention.

## Deployment Logic

- GitHub Actions (`publish.yml`) handles npm publishing via OIDC (Trusted Publishers).
- Requires Node.js v24 in the setup-node action for reliable OIDC/npm provenance.
- Releases are automatically created on GitHub with generated notes.
