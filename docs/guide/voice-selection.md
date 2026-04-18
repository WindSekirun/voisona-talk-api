# Voice Selection Rules

VoiSona Talk selects the voice library for speech synthesis based on a specific order of priority. Understanding these rules helps you get predictable results.

## Priority Order

If you don't specify all parameters (`language`, `voice_name`, `voice_version`), the engine follows this logic:

1.  **Exact Match**: The library that matches all three: `language`, `voice_name`, and `voice_version`.
2.  **Partial Match**: The **last** library in the installed list that matches both `language` and `voice_name`.
3.  **Recent Use**: The most recently used voice library for that specific `language`.
4.  **Default Fallback**: The **first** library in the installed list that matches the `language`.

## Recommendation

For production environments, **always specify both `language` and `voice_name`** to ensure your application doesn't change voices unexpectedly when new libraries are installed or the user manually changes the voice in the editor.

```typescript
// Best Practice
await client.synthesizeAndWait({
  text: 'Predictable voice',
  language: 'ja_JP',
  voice_name: 'tanaka-san_ja_JP'
});
```
