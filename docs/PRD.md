# VoiSona Talk API TypeScript Library PRD

## 1. Project Overview
This project aims to develop a TypeScript-based library for the VoiSona Talk API. The library wraps the OpenAPI (v0.9.0) specification of the speech synthesis engine embedded in the VoiSona Talk editor, enabling developers to integrate speech synthesis and text analysis features more easily and intuitively.

## 2. Goals
- **Type Safety**: Define all request/response schemas as TypeScript interfaces to prevent errors at compile time.
- **Ease of Use**: Encapsulate complex asynchronous operations (queue management, status polling, etc.) into simple Promise-based functions.
- **Flexibility**: Provide utility helpers for real-world scenarios beyond basic CRUD operations.
- **Bulk Processing**: Efficiently handle multiple synthesis requests in a single operation.

## 3. Target Audience
- TypeScript/JavaScript developers building automated voice content production tools.
- Node.js developers implementing server-side speech synthesis.

## 4. Functional Requirements

### 4.1. Core API Mapping
Provide methods for all endpoints defined in the OpenAPI spec.
- **Speech Synthesis**
  - `listSpeechSynthesisRequests()`: Retrieve a list of synthesis requests.
  - `requestSpeechSynthesis(params)`: Request speech synthesis (async, enqueued).
  - `getSpeechSynthesisRequest(uuid)`: Get status and results of a specific request.
  - `deleteSpeechSynthesisRequest(uuid)`: Delete a synthesis request.
- **Text Analysis**
  - `listTextAnalysisRequests()`: Retrieve a list of text analysis requests.
  - `requestTextAnalysis(params)`: Request text analysis.
  - `getTextAnalysisRequest(uuid)`: Get analysis results (e.g., TSML).
  - `deleteTextAnalysisRequest(uuid)`: Delete an analysis request.
- **Voice & Language Information**
  - `listVoices()`: List available voice libraries.
  - `getVoiceInformation(name, version)`: Get detailed information (styles, etc.) for a specific voice.
  - `listLanguages()`: List supported languages.

### 4.2. Helper Functions (UX Enhancement)
Convenience methods for handling the asynchronous nature of the API.
- **`synthesizeAndWait(params, options)`**: Requests synthesis and polls until the status is `succeeded`, returning the final result.
- **`analyzeAndWait(params, options)`**: Requests text analysis and waits for completion.
- **`bulkSynthesize(items, options)`**: Processes multiple synthesis requests. Supports concurrency control and returns a collection of results.

### 4.3. Authentication & Configuration
- **Basic Auth**: Supports email/password authentication.
- **Environment Variables**: Support loading credentials (email, password) from a `.env` file.
- **Base URL**: Defaults to `http://localhost:32766/api/talk/v1`, but allows custom configuration.

## 5. Non-Functional Requirements
- **Node.js Compatibility**: Compatible with modern Node.js environments (v18+).
- **Default Output**: Synthesis output defaults to `.wav` format (as specified in the API's `output_file_path` behavior).
- **Package Manager**: Use `pnpm`.
- **Testing & Quality**: 
  - Comprehensive unit tests for all core logic and helpers.
  - Maintain high code coverage (target > 80%).
- **Lightweight**: Minimize external dependencies.
- **Error Handling**: Return clear error objects corresponding to "Problem Details for HTTP APIs" (4xx, 5xx).
- **Documentation**: All documentation (README, PRD, etc.) must be written in English.

## 6. Technical Stack
- **Language**: TypeScript (v5.x+)
- **Build Tool**: `tsup` (supporting both CJS and ESM)
- **Testing**: `vitest` with `@vitest/coverage-v8` for coverage reporting.
- **Package Manager**: `pnpm`
- **API Client**: Native `fetch` API

## 7. API Design (Draft)

```typescript
// Load from .env
import 'dotenv/config';
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

// 1. Basic Request
const { uuid } = await client.requestSpeechSynthesis({
  text: 'Hello world',
  language: 'en_US',
  voice_name: 'tanaka-san_ja_JP' // Example voice
});

// 2. Helper: Wait for success
const result = await client.synthesizeAndWait({
  text: 'Hello, this is a test.',
  language: 'en_US'
}, { pollInterval: 1000, timeout: 30000 });

console.log(result.output_file_path);

// 3. Bulk Processing
const results = await client.bulkSynthesize([
  { text: 'First message', language: 'en_US' },
  { text: 'Second message', language: 'en_US' }
], { concurrency: 2 });
```
