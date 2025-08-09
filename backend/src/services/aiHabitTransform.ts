// src/services/aiHabitTransform.ts
import type { AiHabits, HabitItem, CategoryKey } from "../types/aiHabitSchemas";

export type HabitRow = {
  user_id: string;
  name: string;
  description: string;
  frequency: "per_day" | "per_week" | "per_month"; 
  freq_count: number;     // '3/week'
  category: string;       // Title Case
  is_from_ai: boolean;
  completed_today: boolean;
  is_archived: boolean;
  public: boolean;
  survey_id?: string | null;
  priority?: number | null;
  reminder_time?: string | null;
  reminder_timezone?: string | null;
};

const CategoryTitleCase: Record<CategoryKey, string> = {
  "fitness": "Fitness",
  "mental clarity": "Mental Clarity",
  "productivity": "Productivity",
  "looks": "Looks",
  "dopamine control": "Dopamine Control",
};

export function aiHabitsToRows(ai: AiHabits, userId: string, surveyId?: string | null): HabitRow[] {
  const rows: HabitRow[] = [];
  for (const [key, items] of Object.entries(ai) as Array<[CategoryKey, any[]]>) {
    const categoryTitle = CategoryTitleCase[key];
    for (const item of items) {
      rows.push({
        user_id: userId,
        name: item.title,
        description: item.description,
        frequency: item.frequency,     
        freq_count: item.freq_count,   
        category: categoryTitle,
        is_from_ai: true,
        completed_today: false,
        is_archived: false,
        public: false,
        survey_id: surveyId ?? null,
        priority: null,
        reminder_time: null,
        reminder_timezone: null,
      });
    }
  }
  return rows;
}