import { test, expect } from "@playwright/test";
import { houses } from "../../src/content/houses";
const routes = [
  "/",
  "/projekty",
  "/technologia",
  "/o-nas",
  "/kontakt",
  "/faq",
  "/polityka-prywatnosci",
  "/polityka-cookies",
  ...houses.map((h) => `/projekty/${h.slug}`),
];
test("all public routes render unique SEO, valid local images and fit the viewport", async ({
  page,
}) => {
  test.setTimeout(180000);
  const titles = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title), title).toBe(false);
    titles.add(title);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://domy-szkiletowy.vercel.app"}${route === "/" ? "" : route}`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow: ${route}`,
    ).toBe(true);
    const images = page.locator("main img");
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      await expect(img).not.toHaveJSProperty("naturalWidth", 0);
    }
  }
});
test("catalog filters, empty state, reset and sorting", async ({ page }) => {
  await page.goto("/projekty");
  await expect(page.locator(".house-card")).toHaveCount(10);
  await page.getByLabel("Kondygnacje").selectOption("2");
  await expect(page.locator(".house-card")).toHaveCount(4);
  await page.getByLabel("Pokoje (z salonem)").selectOption("4");
  await expect(page.locator(".house-card")).toHaveCount(3);
  await page.getByRole("combobox", {name:"Dach",exact:true}).selectOption("Płaski");
  await expect(page.getByText("Jeszcze nie ma takiej kombinacji.")).toBeVisible();
  await page.getByRole("button", { name: "Pokaż wszystkie domy" }).click();
  await page.getByRole("combobox", {name:"Dach",exact:true}).selectOption("Płaski");
  await expect(page.locator(".house-card h3")).toHaveText("OPTIMA 70");
  await page.getByRole("button", { name: "Wyczyść filtry" }).click();
  await page.getByRole("combobox", {name:"Taras",exact:true}).selectOption("no");
  await expect(page.locator(".house-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Wyczyść filtry" }).click();
  await page.getByLabel("Łączna powierzchnia podłóg").selectOption("45");
  await expect(page.locator(".house-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Wyczyść filtry" }).click();
  await page.getByLabel("Sortuj").selectOption("area-desc");
  await expect(page.locator(".house-card h3").first()).toHaveText("MAX");
});
test("project quote carries ID and name, and unconfigured delivery never succeeds", async ({
  page,
}) => {
  await page.goto("/projekty/komfort-60");
  await expect(page.getByLabel("Projekt domu")).toHaveValue("DOM-04");
  await expect(page.getByLabel("Powierzchnia zabudowy (m²)")).toHaveValue("60");
  await page.getByLabel("Zakres prac").selectOption("Stan surowy");
  await page.getByLabel("Województwo").selectOption("mazowieckie");
  await page.getByLabel("Twoje imię").fill("Test użytkownika");
  await page.getByLabel("Telefon").fill("+48 500 000 000");
  await page.getByLabel("Adres e-mail").fill("test@example.invalid");
  await page.getByRole("checkbox").check();
  const pending = page.waitForRequest("**/api/leads");
  await page.getByRole("button", { name: "Wyślij zapytanie o wycenę" }).click();
  const sent = await pending;
  expect(sent.postDataJSON().project).toBe("DOM-04");
  await expect(page.locator(".lead-form").getByRole("alert")).toContainText(
    "nie jest jeszcze skonfigurowana",
  );
  await expect(
    page.getByText("Dziękujemy za rozmowę na dobry początek."),
  ).toHaveCount(0);
});
test("gallery, FAQ, hidden realisations and consent-free tracking behavior", async ({
  page,
  context,
}) => {
  await page.goto("/projekty/smart-48");
  await page.getByRole("button", { name: "Następne zdjęcie" }).click();
  await expect(
    page.getByRole("button", { name: "Pokaż zdjęcie 2" }),
  ).toHaveAttribute("aria-pressed", "true");
  const expand = page.getByRole("button", { name: "Otwórz galerię na pełnym ekranie" });
  await expand.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("End");
  await expect(dialog.locator("img")).toHaveAttribute("src", /plan/);
  await page.keyboard.press("Home");
  await expect(dialog.locator("img")).toHaveAttribute("alt", /widok główny/);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(expand).toBeFocused();
  await page.goto("/faq");
  const summary = page.locator("summary").first();
  await summary.click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await expect(
    page.locator('script[src*="google-analytics"],script[src*="facebook"]'),
  ).toHaveCount(0);
  expect(await context.cookies()).toHaveLength(0);
  expect((await page.goto("/realizacje"))?.status()).toBe(404);
  expect((await page.goto("/projekty/not-a-house"))?.status()).toBe(404);
});

test("requested viewport widths keep navigation, catalog and project readable", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Widths exercised once in desktop Chromium; mobile gestures have separate tests.");
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [360,390,430,768,1024,1440,1920]) {
    await page.setViewportSize({width, height: 1000});
    for (const route of ["/", "/projekty", "/projekty/mini-35", "/projekty/max-70", "/kontakt"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}`).toBe(true);
      const small = await page.locator("main p, main label, main .button, main .render-caption").evaluateAll(nodes => nodes.filter(n => getComputedStyle(n).display !== "none" && parseFloat(getComputedStyle(n).fontSize) < 14).map(n => n.textContent));
      expect(small, `${route} tiny text at ${width}`).toEqual([]);
    }
    await page.goto("/projekty");
    await page.screenshot({path: `test-results/catalog-${width}.png`, fullPage: true});
  }
  expect(errors).toEqual([]);
});
test("mobile menu opens, navigates and closes; screenshots", async ({
  page,
}, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Otwórz menu" }).click();
    await expect(
      page.getByRole("navigation", { name: "Menu mobilne" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Menu mobilne" })
      .getByRole("link", { name: "Technologia" })
      .click();
    await expect(page).toHaveURL(/technologia/);
    await expect(
      page.getByRole("navigation", { name: "Menu mobilne" }),
    ).toHaveCount(0);
    await page.goto("/");
  }
  await page.screenshot({
    path: `test-results/home-viewport-${info.project.name}.png`,
  });
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
  });
});

test("approved brand assets, internal links and page metadata", async ({
  page,
}) => {
  test.setTimeout(180000);
  const checked = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(/VERTEX I\.S\.O$/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S.{30}/,
    );
    await expect(page.locator("body")).not.toContainText("FORMA");
    for (const img of await page.locator("header img, footer img").all()) {
      await expect(img).toHaveAttribute(
        "alt",
        "VERTEX I.S.O — domy szkieletowe",
      );
      await expect(img).toHaveJSProperty("complete", true);
      await expect(img).not.toHaveJSProperty("naturalWidth", 0);
    }
    const links = await page
      .locator("a[href]")
      .evaluateAll((nodes) =>
        nodes.map((n) => (n as HTMLAnchorElement).getAttribute("href")!),
      );
    for (const href of links) {
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(href, `http://localhost:3000${route}`);
      const key = url.pathname + url.hash;
      if (checked.has(key)) continue;
      checked.add(key);
      const response = await page.request.get(url.pathname);
      expect(response.status(), `broken link ${href}`).toBe(200);
      if (url.hash)
        expect(await response.text(), `missing anchor ${href}`).toContain(
          `id="${url.hash.slice(1)}"`,
        );
    }
  }
  for (const name of [
    "logo-light.svg",
    "logo-dark.svg",
    "mark-light.svg",
    "mark-dark.svg",
    "favicon.svg",
  ]) {
    expect((await page.request.get(`/brand/${name}`)).status()).toBe(200);
  }
});

test("vector plan switches floors, zooms, closes and restores focus", async ({page})=>{
  await page.goto('/projekty/family-plus-55');
  const viewer=page.locator('.plan-viewer');
  await viewer.getByRole('button',{name:'Poddasze',exact:true}).click();
  await expect(viewer.locator('.plan-preview')).toHaveAttribute('src',/plan-1.svg/);
  const opener=viewer.getByRole('button',{name:'Powiększ rzut'});
  await opener.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button',{name:'Parter',exact:true}).click();
  await expect(dialog.locator('img')).toHaveAttribute('src',/plan-0.svg/);
  await dialog.getByRole('slider').fill('400');
  await expect(dialog.locator('output')).toHaveText('400%');
  expect(await dialog.locator('.plan-pan').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});
