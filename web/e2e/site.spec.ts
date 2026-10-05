import { expect, test } from "@playwright/test";

test("home renders and its shared background stays fixed without tiling", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Bienvenidos a CCI Sabadell" })).toBeVisible();
  const background = page.locator(".route-background-layer");
  await expect(background).toHaveCount(1);

  const styles = await background.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { position: computed.position, repeat: computed.backgroundRepeat };
  });
  expect(styles).toEqual({ position: "fixed", repeat: "no-repeat" });

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

test("main routes render without horizontal overflow", async ({ page }) => {
  const routes = [
    { path: "/about", heading: "CCI Sabadell" },
    { path: "/blog", heading: "Blog y reflexiones" },
    { path: "/predicaciones", heading: "Mensajes y Predicaciones" },
    { path: "/ofrendas", heading: "Donaciones y Ofrendas" },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(widths.document, `${route.path} should fit the viewport`).toBeLessThanOrEqual(widths.viewport);
  }
});

test("mobile navigation opens and reaches the donation page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile drawer is specific to the mobile layout");
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toHaveClass(/opacity-0/);
  await expect(header).toHaveClass(/pointer-events-none/);
  await page.evaluate(() => window.scrollTo(0, 50));
  await expect(header).toHaveClass(/opacity-100/);
  const menuButton = page.getByLabel("Abrir menú");
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  const mobileNav = page.getByRole("navigation", { name: "Menú móvil" });
  await expect(mobileNav.getByRole("link", { name: "Ofrendas y Diezmos" })).toBeVisible();
  await mobileNav.getByRole("link", { name: "Ofrendas y Diezmos" }).click();

  await expect(page).toHaveURL(/\/ofrendas$/);
  await expect(page.getByRole("heading", { name: "Donaciones y Ofrendas" })).toBeVisible();
});

test("desktop navigation replaces the mobile menu from 900 pixels", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Breakpoint check runs in the desktop project");
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toHaveClass(/opacity-0/);
  await expect(header).toHaveClass(/pointer-events-none/);
  await page.evaluate(() => window.scrollTo(0, 50));
  await expect(header).toHaveClass(/opacity-100/);
  await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
  await expect(page.getByLabel("Abrir menú")).toBeHidden();
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});

test("section navigation arrows fit a short mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Short viewport regression check runs on mobile");
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto("/");
  for (const id of ["verse-of-the-day", "predicaciones-section"]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    const geometry = await section.evaluate((element) => {
      const arrow = element.querySelector("a[aria-label^='Desplazarse']")?.getBoundingClientRect();
      return { arrowTop: arrow?.top, arrowBottom: arrow?.bottom, viewport: innerHeight };
    });
    expect(geometry.arrowTop, `${id} should show its arrow inside the viewport`).toBeGreaterThanOrEqual(0);
    expect(geometry.arrowBottom, `${id} should show its arrow inside the viewport`).toBeLessThanOrEqual(geometry.viewport);
  }
});
