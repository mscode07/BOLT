import express, { Request, Response } from "express";
import { supabaseAdmin } from "./supabase";
const app = express();
app.use(express.json());

app.post("/signup", async (req: any, res: any) => {
  try {
    const body = req.body;
    console.log("This is the Sign UP with Email Data", body);
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: existingUser } = await supabaseAdmin
      .from("UserTable")
      .select("Userid")
      .eq("email", body.email)
      .single();
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      const { data, error } = await supabaseAdmin.auth.signUp({
        email,
        password,
      });
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      console.log("This is the Sign UP with Email Data", data);
      return res.status(200).json({ data });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/auth/oauth", async (req: any, res: any) => {
  try {
    const body = req.body;
    const { provider } = body;

    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
      provider: provider as "github" | "google",
      options: {
        redirectTo: `${
          req.headers.origin || "http://localhost:3000"
        }/auth/callback`,
      },
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("auth/callback", async (req: any, res: any) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(
      code as string
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = data.session.user;
    if (user) {
      const { data: existingUser } = await supabaseAdmin
        .from("UserTable")
        .select("Userid")
        .eq("provider_id", user.id)
        .single();

      if (!existingUser) {
        const { data: insertUser } = await supabaseAdmin
          .from("UserTable")
          .insert({
            provider_id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name || user.user_metadata?.name || null,
            IsPaid: false,
            IsActive: true,
            IsDeleted: false,
          });
        if (!insertUser) {
          return res.status(400).json({ error: "Failed to insert user" });
        } else {
          return res.status(200).json({ data: insertUser });
        }
      }
    }
    const redirectUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/dashboard?session=${encodeURIComponent(JSON.stringify(data.session))}`;
    res.redirect(redirectUrl);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signout", async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    async function signOut() {
      const { error } = await supabaseAdmin.auth.signOut();
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(200).json({ data: "User signed out successfully" });
    }
    signOut();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
