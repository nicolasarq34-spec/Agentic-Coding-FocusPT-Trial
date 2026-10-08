import { describe, expect, it } from "vitest";
import { homePathForRole } from "@/lib/auth/home-path";

describe("homePathForRole", () => {
  it("sends trainers to the trainer area", () => {
    expect(homePathForRole("trainer")).toBe("/trainer");
  });

  it("sends clients to the client area", () => {
    expect(homePathForRole("client")).toBe("/client");
  });
});
