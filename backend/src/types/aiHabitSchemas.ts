// src/types/aiHabitSchemas.ts
import { z } from "zod";

export type CategoryKey =
  | "fitness"
  | "mental clarity"
  | "productivity"
  | "looks"
  | "dopamine control";

export const AllowedCategoryKeys = [
  "fitness",
  "mental clarity",
  "productivity",
  "looks",
  "dopamine control",
] as const;
const BaseHabit = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  frequency: z.enum(["per_day", "per_week", "per_month"]),
  freq_count: z.number().int().min(1).max(31),
});

// cross-field bounds: tighten count by unit
export const HabitItemSchema = BaseHabit.superRefine((h, ctx) => {
  if (h.frequency === "per_day"   && (h.freq_count < 1 || h.freq_count > 10))  ctx.addIssue({ code: z.ZodIssueCode.custom, message: "per_day requires 1–10", path: ["freq_count"] });
  if (h.frequency === "per_week"  && (h.freq_count < 1 || h.freq_count > 7))   ctx.addIssue({ code: z.ZodIssueCode.custom, message: "per_week requires 1–7", path: ["freq_count"] });
  if (h.frequency === "per_month" && (h.freq_count < 1 || h.freq_count > 31))  ctx.addIssue({ code: z.ZodIssueCode.custom, message: "per_month requires 1–31", path: ["freq_count"] });
});


export const AiHabitsSchema = z.record(
  z.enum(AllowedCategoryKeys),
  z.array(HabitItemSchema)
);

export type HabitItem = z.infer<typeof HabitItemSchema>;
export type AiHabits = z.infer<typeof AiHabitsSchema>;
