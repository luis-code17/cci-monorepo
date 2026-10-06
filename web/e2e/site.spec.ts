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

test("home preaching section uses the swapped light and dark backgrounds", async ({ page }) => {
  await page.goto("/");

  const backgrounds = await page.locator("#predicaciones-section").evaluate((section) =>
    Object.fromEntries(Array.from(section.querySelectorAll<HTMLImageElement>("img[class*='section-theme-']"), (image) => {
      const themeClass = Array.from(image.classList).find((name) => name.startsWith("section-theme-"));
      return [themeClass, new URL(image.src).searchParams.get("url")];
    })),
  );
  expect(backgrounds).toMatchObject({
    "section-theme-light": "/predicaciones_dark.jpeg",
    "section-theme-dark": "/predicaciones_light.jpeg",
    "section-theme-mobile": "/predicaciones_dark.jpeg",
    "section-theme-mobile-dark": "/predicaciones_mobile.jpeg",
  });
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

test("predicaciones keeps each panel separated and fits the viewport", async ({ page }) => {
  await page.goto("/predicaciones");

  await expect(page.getByRole("heading", { name: "Encuentra una predicación" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shorts de predicaciones" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Todos los mensajes, a tu ritmo" })).toBeVisible();

  const layout = await page.getByTestId("predicaciones-panels").evaluate((container) => {
    const panels = Array.from(container.querySelectorAll<HTMLElement>("[data-testid^='predicaciones-']"));
    const boxes = panels.map((panel) => {
      const rect = panel.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, width: panel.clientWidth, scrollWidth: panel.scrollWidth };
    });
    return {
      gaps: boxes.slice(1).map((box, index) => box.top - boxes[index].bottom),
      panelsFit: boxes.every((box) => box.scrollWidth <= box.width),
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    };
  });

  expect(layout.gaps.every((gap) => gap >= 28), "each panel should have visible breathing room").toBe(true);
  expect(layout.panelsFit, "panel contents should not be clipped horizontally").toBe(true);
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);

  await page.getByRole("button", { name: /Todos los mensajes Todo el canal/ }).click();
  await expect(page.getByRole("heading", { name: "Todos los mensajes", exact: true })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "Buscar en todos los mensajes" })).toBeInViewport();
});

test("shorts viewer stays above the footer and has a visible exit on desktop and mobile", async ({ page }) => {
  await page.addInitScript(() => {
    type MockWindow = Window & {
      YT?: {
        PlayerState: { ENDED: number };
        Player: new (element: HTMLIFrameElement, options: { events: {
          onReady: (event: { target: { destroy: () => void; playVideo: () => void; unMute: () => void; setVolume: (volume: number) => void } }) => void;
          onStateChange: (event: { data: number }) => void;
          onVolumeChange: (event: { data: { muted: boolean; volume: number } }) => void;
        } }) => { destroy: () => void };
      };
      mockYouTubeVideoSrc?: string;
      mockYouTubeEnded?: () => void;
      mockYouTubeVolumeChange?: () => void;
      mockYouTubeUnmuteCalls?: number;
      mockYouTubePlayCalls?: number;
    };
    const mockWindow = window as MockWindow;
    mockWindow.YT = {
      PlayerState: { ENDED: 0 },
      Player: class {
        constructor(element: HTMLIFrameElement, options: { events: {
          onReady: (event: { target: { destroy: () => void; playVideo: () => void; unMute: () => void; setVolume: (volume: number) => void } }) => void;
          onStateChange: (event: { data: number }) => void;
          onVolumeChange: (event: { data: { muted: boolean; volume: number } }) => void;
        } }) {
          mockWindow.mockYouTubeVideoSrc = element.getAttribute("src") ?? "";
          mockWindow.mockYouTubeEnded = () => options.events.onStateChange({ data: 0 });
          mockWindow.mockYouTubeVolumeChange = () => options.events.onVolumeChange({ data: { muted: false, volume: 100 } });
          options.events.onReady({ target: {
            destroy: () => {},
            playVideo: () => { mockWindow.mockYouTubePlayCalls = (mockWindow.mockYouTubePlayCalls ?? 0) + 1; },
            unMute: () => { mockWindow.mockYouTubeUnmuteCalls = (mockWindow.mockYouTubeUnmuteCalls ?? 0) + 1; },
            setVolume: () => {},
          } });
        }
        destroy() {}
        playVideo() {}
        unMute() {}
        setVolume() {}
      },
    };
  });
  await page.goto("/predicaciones");
  await page.getByRole("button", { name: /Ver Shorts/ }).click();

  const viewer = page.getByRole("dialog", { name: "Shorts de predicaciones" });
  await expect(viewer).toBeVisible();
  const progress = viewer.getByTestId("shorts-progress");
  await expect(progress).toHaveText("1 de 2");
  await expect(viewer.getByTestId("shorts-controls")).toHaveCSS("top", "8px");
  const videoFrame = viewer.getByTestId("shorts-video-frame");
  await expect(videoFrame).toHaveAttribute("allowfullscreen", "");
  await expect(videoFrame).toHaveAttribute("allow", /fullscreen/);
  await expect(videoFrame).toHaveAttribute("src", /enablejsapi=1/);
  await expect.poll(() => page.evaluate(() => (window as Window & { mockYouTubePlayCalls?: number }).mockYouTubePlayCalls)).toBe(1);
  await expect(viewer.getByRole("button", { name: /Ampliar Shorts|Reducir Shorts/ })).toHaveCount(0);
  const titleOverlay = viewer.getByTestId("shorts-title-overlay").first();
  await expect(titleOverlay).toHaveCSS("pointer-events", "none");
  await expect(titleOverlay).toHaveCSS("opacity", "0", { timeout: 5000 });
  await viewer.dispatchEvent("pointermove", { pointerType: "touch" });
  await expect(titleOverlay).toHaveCSS("opacity", "1");
  await expect.poll(() => page.evaluate(() => (window as Window & { mockYouTubeVideoSrc?: string }).mockYouTubeVideoSrc)).toContain("e2e-video-01");
  await page.evaluate(() => (window as Window & { mockYouTubeVolumeChange?: () => void }).mockYouTubeVolumeChange?.());
  await page.evaluate(() => (window as Window & { mockYouTubeEnded?: () => void }).mockYouTubeEnded?.());
  await expect(progress).toHaveText("2 de 2");
  await expect.poll(() => page.evaluate(() => (window as Window & { mockYouTubeVideoSrc?: string }).mockYouTubeVideoSrc)).toContain("e2e-video-02");
  await expect.poll(() => page.evaluate(() => (window as Window & { mockYouTubePlayCalls?: number }).mockYouTubePlayCalls)).toBe(2);
  await expect.poll(() => page.evaluate(() => (window as Window & { mockYouTubeUnmuteCalls?: number }).mockYouTubeUnmuteCalls)).toBe(1);
  await page.evaluate(() => (window as Window & { mockYouTubeEnded?: () => void }).mockYouTubeEnded?.());
  await expect(progress).toHaveText("1 de 2");
  await viewer.locator("[data-short-id='e2e-video-02']").scrollIntoViewIfNeeded();
  await expect(progress).toHaveText("2 de 2");
  const exitButton = viewer.getByRole("button", { name: "Salir de Shorts" });
  await expect(exitButton).toBeVisible();
  const viewportWidth = await page.evaluate(() => innerWidth);
  await expect(viewer.getByTestId("shorts-brand-rail")).toHaveCount(0);
  await expect(viewer.getByTestId("shorts-progress-rail")).toHaveCount(0);
  if (viewportWidth >= 1024) {
    const frame = viewer.getByTestId("shorts-video-frame");
    const frameGeometry = await frame.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, viewportWidth: innerWidth };
    });
    expect(frameGeometry.left).toBeGreaterThan(0);
    expect(frameGeometry.right).toBeLessThan(frameGeometry.viewportWidth);
  }
  const exitGeometry = await exitButton.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return {
      top: rect.top,
      bottom: rect.bottom,
      right: rect.right,
      viewportWidth: innerWidth,
      hitTarget: hit?.closest("button")?.getAttribute("aria-label"),
    };
  });
  expect(exitGeometry.top).toBeGreaterThanOrEqual(0);
  expect(exitGeometry.bottom).toBeLessThanOrEqual(await page.evaluate(() => innerHeight));
  expect(exitGeometry.right).toBeLessThanOrEqual(exitGeometry.viewportWidth);
  expect(exitGeometry.hitTarget).toBe("Salir de Shorts");
  await exitButton.click();
  await expect(viewer).toBeHidden();
});

test("all messages use numbered pagination", async ({ page }) => {
  await page.goto("/predicaciones");
  await page.getByRole("button", { name: /Todos los mensajes Todo el canal/ }).click();
  const cards = page.locator("article[role='button']");
  await expect(cards).toHaveCount(12);
  await expect(page.getByText("Mostrando 1–12 de 15")).toBeVisible();

  await page.getByRole("button", { name: "Página siguiente" }).click();
  await expect(cards).toHaveCount(3);
  await expect(page.getByText("Mostrando 13–15 de 15")).toBeVisible();
  await expect(page.getByRole("button", { name: "Página siguiente" })).toBeDisabled();
  await page.getByRole("button", { name: "Página anterior" }).click();
  await expect(cards).toHaveCount(12);
});

test("sort options have an opaque background and update the selected order", async ({ page }) => {
  await page.goto("/predicaciones");
  await page.getByRole("button", { name: /Todos los mensajes Todo el canal/ }).click();
  await page.getByRole("button", { name: "Ordenar mensajes" }).click();

  const menu = page.getByTestId("sort-menu-surface");
  await expect(menu).toBeVisible();
  const background = await menu.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).not.toBe("rgba(0, 0, 0, 0)");
  expect(background).not.toBe("transparent");

  await menu.getByRole("option", { name: "Más antiguos" }).click();
  await expect(page.getByRole("button", { name: "Ordenar mensajes" })).toContainText("Más antiguos");
  await expect(menu).toBeHidden();
});

test("mobile navigation opens and reaches the donation page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile drawer is specific to the mobile layout");
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toHaveClass(/opacity-0/);
  await expect(header).toHaveClass(/pointer-events-none/);
  await page.evaluate(() => window.scrollTo(0, 50));
  await expect(header).toHaveClass(/opacity-100/);
  await expect(page.getByLabel("CCI Sabadell, inicio")).toBeHidden();
  const mobileShell = await page.locator(".site-navbar-shell").evaluate((element) => {
    const style = getComputedStyle(element);
    return { borderWidth: style.borderTopWidth, background: style.backgroundColor };
  });
  expect(Number.parseFloat(mobileShell.borderWidth)).toBe(0);
  expect(mobileShell.background).toBe("rgba(0, 0, 0, 0)");
  const menuButton = page.getByLabel("Abrir menú");
  const themeButton = header.getByLabel("Cambiar tema");
  await expect(menuButton).toBeVisible();
  await expect(themeButton).toBeVisible();
  const [menuBounds, themeBounds] = await Promise.all([menuButton.boundingBox(), themeButton.boundingBox()]);
  expect(menuBounds).not.toBeNull();
  expect(themeBounds).not.toBeNull();
  expect(menuBounds!.x + menuBounds!.width).toBeLessThan(themeBounds!.x);
  const controlsRightGap = await page.locator(".site-nav-controls").evaluate((controls) => {
    const controlsRight = controls.getBoundingClientRect().right;
    const shellRight = controls.parentElement!.getBoundingClientRect().right;
    return shellRight - controlsRight;
  });
  expect(controlsRightGap).toBeGreaterThanOrEqual(8);
  await menuButton.click();
  const mobileNav = page.getByRole("navigation", { name: "Menú móvil" });
  await expect(mobileNav.getByRole("link", { name: "Ofrendas y Diezmos" })).toBeVisible();
  await mobileNav.getByRole("link", { name: "Ofrendas y Diezmos" }).click();

  await expect(page).toHaveURL(/\/ofrendas$/);
  await expect(page.getByRole("heading", { name: "Donaciones y Ofrendas" })).toBeVisible();
});

test("desktop navigation replaces the mobile menu from 900 pixels", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Breakpoint check runs in the desktop project");
  await page.goto("/");

  const header = page.getByRole("banner");
  await expect(header).toHaveClass(/opacity-0/);
  await expect(header).toHaveClass(/pointer-events-none/);
  await page.evaluate(() => window.scrollTo(0, 50));
  await expect(header).toHaveClass(/opacity-100/);

  for (const width of [900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
    await expect(page.getByLabel("Abrir menú")).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Menú móvil" })).toBeHidden();
    await expect(page.getByLabel("CCI Sabadell, inicio")).toBeHidden();
    const shell = await page.locator(".site-navbar-shell").evaluate((element) => {
      const style = getComputedStyle(element);
      return { borderWidth: style.borderTopWidth, background: style.backgroundColor, shadow: style.boxShadow };
    });
    expect(Number.parseFloat(shell.borderWidth)).toBe(0);
    expect(shell.background).toBe("rgba(0, 0, 0, 0)");
    expect(shell.shadow).toBe("none");
    const navTop = await page.getByRole("navigation", { name: "Principal" }).evaluate((element) => element.getBoundingClientRect().top);
    expect(navTop, `desktop navigation at ${width}px should have top spacing`).toBeGreaterThanOrEqual(16);
    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(widths.document, `desktop layout at ${width}px should fit the viewport`).toBeLessThanOrEqual(widths.viewport);
  }
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
