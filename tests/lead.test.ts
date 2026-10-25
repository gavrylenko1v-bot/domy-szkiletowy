import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/leads/route";
import { validateLead } from "../src/lib/lead-validation";
import { localLimit } from "../src/lib/rate-limit";
import { houses } from "../src/content/houses";
const good = {
  name: "Test użytkownika",
  email: "test@example.invalid",
  phone: "+48 500 000 000",
  project: "DOM-04",
  area: 60,
  package: "Stan surowy",
  region: "mazowieckie",
  message: "Test integracji — dane syntetyczne.",
  consent: true,
  website: "",
  requestId: "12345678-1234-1234-1234-123456789012",
};
const request = (data: unknown, origin = "http://localhost:3000") =>
  new NextRequest("http://localhost:3000/api/leads", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
test("catalog geometry, unique identifiers, media and area estimates are consistent", async () => {
  const { access } = await import("node:fs/promises");
  assert.equal(houses.length, 10);
  assert.equal(new Set(houses.map((h) => h.id)).size, 10);
  assert.equal(new Set(houses.map((h) => h.slug)).size, 10);
  for (const h of houses) {
    assert.equal(h.width * h.depth, h.footprint);
    assert.ok(h.footprint <= 70);
    assert.ok(h.usable < h.footprint * h.floors);
    for (const path of [h.image, h.alternate, h.plan])
      await access("public" + path);
  }
});
test("lead validation rejects invalid project, altered area, missing consent and forged options", () => {
  assert.equal(validateLead(good).ok, true);
  for (const patch of [
    { email: "bad" },
    { project: "forged" },
    { area: 45 },
    { area: Infinity },
    { region: "other" },
    { package: "free" },
    { consent: false },
    { message: "x".repeat(3001) },
    { phone: "111" },
    { name: "a" },
    { requestId: "bad" },
  ])
    assert.equal(validateLead({ ...good, ...patch }).ok, false);
});
test("local limiter expires old windows and rejects the sixth request", () => {
  for (let i = 0; i < 5; i++) assert.equal(localLimit("unit-ip", 100), true);
  assert.equal(localLimit("unit-ip", 100), false);
  assert.equal(localLimit("unit-ip", 900101), true);
});
test("API fails closed and only confirms provider acceptance", async () => {
  const names = [
    "RESEND_API_KEY",
    "LEADS_FROM_EMAIL",
    "LEADS_TO_EMAIL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "NEXT_PUBLIC_SITE_URL",
  ] as const;
  const saved = Object.fromEntries(names.map((k) => [k, process.env[k]]));
  const oldFetch = globalThis.fetch;
  try {
    for (const name of names) delete process.env[name];
    assert.equal(
      (await POST(request(good, "https://evil.invalid"))).status,
      403,
    );
    assert.equal(
      (await POST(request({ ...good, website: "bot" }))).status,
      422,
    );
    assert.equal(
      (await POST(request({ ...good, consent: false }))).status,
      422,
    );
    assert.equal((await POST(request(good))).status, 503);
    process.env.RESEND_API_KEY = "synthetic-test-key";
    process.env.LEADS_FROM_EMAIL = "test@example.invalid";
    process.env.LEADS_TO_EMAIL = "test@example.invalid";
    process.env.UPSTASH_REDIS_REST_URL = "https://limiter.example.invalid";
    process.env.UPSTASH_REDIS_REST_TOKEN = "synthetic-test-token";
    let count = 0;
    let mailPayload: Record<string, unknown> = {};
    globalThis.fetch = async (input, init) => {
      if (String(input).includes("limiter."))
        return Response.json({ result: 1 });
      count++;
      mailPayload = JSON.parse(String(init?.body));
      return Response.json({ id: "mock-accepted" });
    };
    const success = await POST(request(good));
    assert.equal(success.status, 200);
    assert.equal(count, 1);
    assert.match(String(mailPayload.text), /DOM-04 — KOMFORT 60/);
    assert.equal(mailPayload.reply_to, good.email);
    globalThis.fetch = async (input) =>
      String(input).includes("limiter.")
        ? Response.json({ result: 6 })
        : Response.json({ id: "should-not-send" });
    assert.equal((await POST(request(good))).status, 429);
    globalThis.fetch = async (input) =>
      String(input).includes("limiter.")
        ? Response.json({ result: 1 })
        : Response.json({ error: "provider failure" }, { status: 500 });
    assert.equal((await POST(request(good))).status, 502);
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    assert.equal((await POST(request(good))).status, 503);
  } finally {
    globalThis.fetch = oldFetch;
    for (const name of names) {
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    }
  }
});
