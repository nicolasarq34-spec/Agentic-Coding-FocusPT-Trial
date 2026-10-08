"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole } from "@/lib/auth/home-path";
import { validateSignUp, type SignUpField } from "@/lib/auth/validate-sign-up";

// What the sign-up form gets back when something needs fixing.
// `fields` sends back what the person typed (never the password), so the form keeps it.
export type SignUpState = {
  errors?: Partial<Record<SignUpField, string>>;
  formError?: string;
  fields?: { role: string; name: string; email: string };
};

// "use server" makes this a Server Action: the sign-up form calls it directly,
// and it runs on the server, never in the browser.
export async function signUp(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const input = {
    role: formData.get("role")?.toString() ?? null,
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };
  const fields = { role: input.role ?? "", name: input.name, email: input.email };

  const result = validateSignUp(input);
  if (!result.ok) return { errors: result.errors, fields };

  const { role, name, email, password } = result.data;
  const supabase = await createClient();
  // The role and name travel as sign-up "metadata"; the database trigger turns them into a profile.
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { role, name } } });

  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { errors: { email: "That email already has an account. Log in instead?" }, fields };
    }
    console.error("Sign-up failed:", error.code, error.message);
    return { formError: "Something went wrong on our side. Please try again.", fields };
  }

  // redirect() works by stopping this function, so it must come last (not inside try/catch).
  redirect(homePathForRole(role));
}

export type LogInState = {
  errors?: { email?: string; password?: string };
  formError?: string;
  email?: string;
};

export async function logIn(_prevState: LogInState, formData: FormData): Promise<LogInState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const errors: LogInState["errors"] = {};
  if (!email) errors.email = "Enter your email.";
  if (!password) errors.password = "Enter your password.";
  if (errors.email || errors.password) return { errors, email };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Same message for "no such email" and "wrong password", so nobody can find out who has an account.
    if (error.code === "invalid_credentials") {
      return { formError: "That email and password don't match. Check them and try again.", email };
    }
    console.error("Log-in failed:", error.code, error.message);
    return { formError: "Something went wrong on our side. Please try again.", email };
  }

  // Now logged in, so Row Level Security lets us read our own profile to find the right home.
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  redirect(profile ? homePathForRole(profile.role) : "/");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
