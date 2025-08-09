import { Request, Response, NextFunction } from "express";
import { parse } from "cookie";
import dotenv from "dotenv";
import { User } from '@supabase/supabase-js';
import { supabase } from "../supabase-client";
dotenv.config();
export interface AuthenticatedRequest extends Request {
    user?: User;
}
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("Authenticating request...");
    const cookies = parse(req.headers.cookie || '');
    console.log("Cookies received:", cookies);
    const token = cookies['sb-access-token']
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = data.user;
    next();
    console.log("User authenticated:", req.user.id);
}