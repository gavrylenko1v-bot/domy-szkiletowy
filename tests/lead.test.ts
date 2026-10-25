import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/leads/route";
import { validateLead } from "../src/lib/lead-validation";
import { localLimit } from "../src/lib/rate-limit";
import { houses } from "../src/content/houses";
import { round, floorPlans, overlaps } from "../src/content/floor-plans";
import { houseDetails } from "../src/content/house-details";
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
    assert.equal(round(h.width * h.depth), h.footprint);
    assert.ok(h.usable <= 70);
    assert.ok(h.footprint <= 70);
    assert.ok(h.usable < h.footprint * h.floors);
    const details = houseDetails(h);
    assert.equal(round(details.rooms.reduce((sum, room) => sum + room.area, 0)), h.usable, h.name);
    assert.equal(details.rooms.filter((room) => /Łazienka/.test(room.name)).length, h.bathrooms, h.name);
    assert.ok(details.rooms.every((room) => room.area > 0 && room.level < h.floors));
    for (const path of [h.image, h.alternate, h.plan, ...["garden", "terrace", "side", "aerial", "living", "kitchen", "bedroom"].map(view => `/images/houses/${h.slug}/${view}.webp`)])
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

test("every concept has consistent rooms, circulation, furnished bathrooms and aligned stairs", () => {
  for (const h of houses) {
    const floors=floorPlans(h);
    assert.equal(floors.length,h.floors);
    let beds=0;
    for(const f of floors) {
      const seen=new Set([f.rooms[0].id]);
      for(let n=0;n<f.rooms.length;n++) for(const door of f.doors) {
        if(door.b && (seen.has(door.a) || seen.has(door.b))) {seen.add(door.a);seen.add(door.b);}
      }
      assert.equal(seen.size,f.rooms.length,`${h.slug}: disconnected rooms`);
      for(const r of f.rooms) {
        assert.equal(r.area,round(r.w*r.d),`${h.slug} ${r.label}: area`);
        assert.ok(r.w>0 && r.d>0 && r.x>=.28 && r.y>=.28);
        assert.ok(r.x+r.w<=h.width-.28+.001 && r.y+r.d<=h.depth-.28+.001);
        for(const b of f.rooms) if(r!==b) assert.equal(overlaps(r,b),false,`${h.slug}: overlapping rooms`);
        const furnishings=f.furniture.filter(v=>v.room===r.id);
        if(r.type === "bed") {beds++;assert.ok(furnishings.some(v=>v.kind === "bed"),`${h.slug}: missing bed`);}
        if(r.type === "bath") for(const kind of ["shower","wc","basin"]) assert.ok(furnishings.some(v=>v.kind===kind),`${h.slug}: missing ${kind}`);
      }
      for(const piece of f.furniture) {
        const r=f.rooms.find(r=>r.id===piece.room)!;
        assert.ok(piece.x>=r.x && piece.y>=r.y && piece.x+piece.w<=r.x+r.w+.001 && piece.y+piece.d<=r.y+r.d+.001);
        for(const other of f.furniture) if(piece!==other) assert.equal(overlaps(piece,other),false,`${h.slug}: furniture overlap`);
        for(const o of f.doors) {
          const swing=o.vertical ? {x:o.x-.86,y:o.y,w:1.72,d:o.size} : {x:o.x,y:o.y-.86,w:o.size,d:1.72};
          assert.equal(overlaps(piece,swing),false,`${h.slug}: blocked door`);
        }
      }
    }
    assert.equal(beds,h.bedrooms,`${h.slug}: bedroom count`);
    assert.equal(floors[0].doors.filter(d=>!d.b).length,1);
    assert.ok(floors[0].furniture.some(v=>v.kind === "kitchen"));
    assert.ok(floors[0].furniture.some(v=>v.kind === "wardrobe"));
    if(h.floors===2) {
      const a=floors[0].furniture.find(v=>v.kind==="stairs"),b=floors[1].furniture.find(v=>v.kind==="stairs");
      assert.ok(a && b,`${h.slug}: stairs missing`);
      assert.deepEqual([a.x,a.y,a.w,a.d],[b.x,b.y,b.w,b.d]);
    }
  }
});
