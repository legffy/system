// src/utils/parseModelJson.ts
export function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
}

export function safeParseJson<T>(raw: string): T {
  const cleaned: string = extractJson(raw).replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(cleaned) as T;
}
