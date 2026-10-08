import { describe, expect, it } from "vitest";
import { validateSignUp } from "@/lib/auth/validate-sign-up";

const valid = { role: "client", name: "Test Client", email: "client@example.com", password: "long-enough" };

describe("validateSignUp", () => {
  it("accepts a complete form and tidies the name and email", () => {
    const result = validateSignUp({ ...valid, name: "  Test Client ", email: " Client@Example.com " });
    expect(result).toEqual({
      ok: true,
      data: { role: "client", name: "Test Client", email: "client@example.com", password: "long-enough" },
    });
  });

  it("asks for a role when none is chosen", () => {
    const result = validateSignUp({ ...valid, role: null });
    expect(result).toMatchObject({ ok: false, errors: { role: "Choose trainer or client." } });
  });

  it("rejects a role that isn't trainer or client", () => {
    const result = validateSignUp({ ...valid, role: "admin" });
    expect(result).toMatchObject({ ok: false, errors: { role: "Choose trainer or client." } });
  });

  it("asks for a name when it's empty or only spaces", () => {
    const result = validateSignUp({ ...valid, name: "   " });
    expect(result).toMatchObject({ ok: false, errors: { name: "Enter your name." } });
  });

  it("asks for a valid email", () => {
    const result = validateSignUp({ ...valid, email: "not-an-email" });
    expect(result).toMatchObject({ ok: false, errors: { email: "Enter a valid email, like name@example.com." } });
  });

  it("asks for a password of at least 8 characters", () => {
    const result = validateSignUp({ ...valid, password: "short" });
    expect(result).toMatchObject({ ok: false, errors: { password: "Use at least 8 characters." } });
  });

  it("reports every problem at once, so people can fix them in one go", () => {
    const result = validateSignUp({ role: null, name: "", email: "", password: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["email", "name", "password", "role"]);
  });
});
