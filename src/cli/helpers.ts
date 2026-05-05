export function parseKeyValueString(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const [key, ...valueParts] = entry.split(':');
      const value = valueParts.join(':').trim();
      if (!key || !value) {
        throw new Error(`Invalid key:value pair: ${entry}`);
      }
      result[key.trim()] = value;
    });
  return result;
}

export function parseJsonObject(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Expected a JSON object.');
    }
    return parsed as Record<string, unknown>;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON for --params: ${message}`, { cause: error });
  }
}

export function outputResult(data: any, text: string, json: boolean) {
  if (json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(text);
  }
}
