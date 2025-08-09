import { OpenAI } from 'openai';
type HabitInput = Array<{ category: string; question: string; answer: string }>;

const client: OpenAI = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function habitCreation(habits: HabitInput): Promise<string> {
  const topics: string = habits.map(h => h.category).join(", ");
  const questions: string = habits.map(h => h.question).join(", ");
  const answers: string = habits.map(h => h.answer).join(", ");

  const prompt: string = `
You are to generate exactly 5 habits based on the user's answers.

Output REQUIREMENTS:
- Output ONLY valid JSON — no extra text, no markdown code fences, no explanations.
- The JSON must be a single object.
- The keys can only be be ONLY from: "fitness", "mental clarity", "productivity", "looks", "dopamine control".
- Include ONLY categories the user selected. If none selected, include all five.
- Each category value is an array of habit objects.
- Each habit object has ONLY:
  - "title": string
  - "description": string
  - "difficulty": integer 1..5
  - "frequency": one of "per_day", "per_week", "per_month"
  - "freq_count": integer (for per_day: 1–10, per_week: 1–7, per_month: 1–31)

User’s Selected Categories & Answers:
${JSON.stringify({ topics, questions, answers })}
`.trim();

  const res = await client.chat.completions.create({
    model: "deepseek/deepseek-r1-0528:free",
    messages: [
      { role: "system", content: "Return ONLY valid JSON. No commentary, no code fences." },
      { role: "user", content: prompt },
    ],
    // If the model respects this, great. If not, our parser still handles it.
    response_format: { type: "json_object" } as any,
    temperature: 0.2,
  });
   console.log("==== FULL MODEL RESPONSE ====");
  console.dir(res, { depth: null });
  console.log("==============================");
  return res.choices[0]?.message?.content ?? "";
}