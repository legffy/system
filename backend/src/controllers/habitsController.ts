// src/controllers/addHabits.ts
import type { Request, Response } from "express";
import { parse } from "cookie";
import { habitCreation } from "./aiController";
import { safeParseJson } from "../utils/parseModelJson";
import { AiHabitsSchema, type AiHabits } from "../types/aiHabitSchemas";
import { aiHabitsToRows } from "../services/aiHabitTransform";
import { supabaseWithUser } from "../lib/supabasePerRequest";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

type HabitInput = Array<{ category: string; question: string; answer: string }>;

type AddHabitsBody = {
  habits: HabitInput;
  surveyId?: string | null;
};

export async function addHabits(req: Request, res: Response): Promise<Response> {
    console.log("habit time");
  try {
    // get JWT from cookie (same as your auth middleware)
    const cookies = parse(req.headers.cookie || "");
    const token: string | undefined = cookies["sb-access-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // you already ran authenticate elsewhere; if not, also fetch user:
    // but we’ll accept user id from your earlier middleware if attached.
    const userId: string | undefined =
      // @ts-ignore (if you attach req.user)
      (req as any)?.user?.id || undefined;

    // fallback: require it in the body if you’re not attaching req.user
    const body = req.body as AddHabitsBody & { user?: { id: string } };
    const finalUserId= userId ?? body?.user?.id;
    if (!finalUserId) return res.status(400).json({ error: "user.id missing" });

    const inputHabits: HabitInput = body.habits ?? [];
    console.log("Adding habits for user:", finalUserId);

    // 1) Call AI (string)
    const aiText: string = await habitCreation(inputHabits);

    // 2) Parse + validate
    let ai: AiHabits;
    try {
      const candidate = safeParseJson<unknown>(aiText);
      const validated = AiHabitsSchema.safeParse(candidate);
      if (!validated.success) {
        return res.status(502).json({
          error: "AI JSON failed validation",
          details: validated.error.flatten(),
          raw: aiText.slice(0, 4000),
        });
      }
      ai = validated.data;
      ai = Object.fromEntries(
        Object.entries(ai).filter(([,arr]) => Array.isArray(arr) && arr.length > 0)
      ) as AiHabits;
      // ADD: cap to exactly 5 total habits (trim deterministically)
{
  let remaining: number = 5;
  for (const k of Object.keys(ai)) {
    const arr = ai[k as keyof AiHabits]!;
    const take: number = Math.min(arr.length, Math.max(0, remaining));
    (ai as any)[k] = arr.slice(0, take);
    remaining -= take;
  }
  if (remaining === 5) {
    // nothing usable after trimming
    return res.status(502).json({
      error: "AI returned no usable habits",
      raw: aiText.slice(0, 1000),
    });
  }
}
    } catch (e) {
      return res.status(502).json({
        error: "AI returned non-JSON or malformed JSON",
        message: (e as Error).message,
        raw: aiText.slice(0, 4000),
      });
    }

    // 3) Transform → rows
    const rows = aiHabitsToRows(ai, finalUserId, body.surveyId ?? null);

    // 4) Insert (or upsert to avoid dupes)
    const supabase = supabaseWithUser(token);
    const { data, error } = await supabase
      .from("habits")
      .upsert(rows, { onConflict: "user_id,name" }) // requires unique index
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save habits", details: error.message });
    }

    return res.status(200).json({
      message: "Habits added successfully",
      count: data?.length ?? 0,
      data,
    });
  } catch (err) {
    console.error("addHabits fatal:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function getHabits(req: AuthenticatedRequest, res: Response): Promise<Response>{
  try{
      const cookies = parse(req.headers.cookie || "");
    const token: string | undefined = cookies["sb-access-token"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const userId: string = req.user!.id;
    console.log("test",userId);
    const supabase = supabaseWithUser(token);
    const {data, error} = await supabase.from('habits').select().eq('user_id',userId);
    if (error) return res.status(500).json({ error: "DB query failed", details: error.message });
    console.log(data);
    return res.status(200).json({habits: data ?? []});
  }catch(error){
    return res.status(500);
  }
}
