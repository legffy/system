import { supabase } from "../supabase-client";
import express from "express";
import { serialize } from "cookie";
import dotenv from "dotenv";
dotenv.config();
const signup = async (req: express.Request, res: express.Response) => {
  const { email, password, username } = req.body;

  //  Pass the username in the options.data object
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error || !data.user || !data.session) {
    console.error("Error signing up:", error);
    // Use the error message from Supabase for better debugging
    return res
      .status(400)
      .json({ error: error?.message || "Failed to sign up" });
  }

  console.log("User signed up successfully:", data.user.id);
  const token = data.session.access_token;
  // Set the token in a cookie
  res.setHeader(
    "Set-Cookie",
    serialize("sb-access-token", token, {
      httpOnly: true,
      secure: false, // allow HTTP for localhost
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax", // allow cross-port requests from browser & SSR
    })
  );
  return res.status(201).json({ user: data.user });
};
const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    console.error("Error logging in:", error);
    res.status(400).json({ error: "Failed to log in" });
    return;
  }
  const token = data.session.access_token;
  // Set the token in a cookie
  res.setHeader(
    "Set-Cookie",
    serialize("sb-access-token", token, {
      httpOnly: true,
      secure: false, // allow HTTP for localhost
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax", // allow cross-port requests from browser & SSR
    })
  );
  console.log("User logged in:", data);
  res.status(200).json({ user: data.user });
};
export { signup, login };
