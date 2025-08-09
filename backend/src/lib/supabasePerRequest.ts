import { createClient,type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv"
dotenv.config();
export function supabaseWithUser(token: string): SupabaseClient {
    const url: string = process.env.SUPABASE_URL as string;
    const anonKey: string = process.env.SUPABASE_KEY as string;
    return createClient(url,anonKey, {
        global: {headers : {Authorization: `Bearer ${token}`}},
        auth: {persistSession: false, autoRefreshToken: false}
    })
}