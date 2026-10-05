import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ofrendas");
});

test("shows available giving options and allows a clear amount selection", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Haz tu donación" })).toBeVisible();
  await expect(page.getByText("Tarjeta bancaria")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bizum" })).toBeVisible();
  await expect(page.getByText("ES00 0000 0000 0000 0000 0000")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Donar con tarjeta" })).toBeDisabled();

  const amount = page.getByRole("button", { name: "25 €" });
  await amount.click();
  await expect(amount).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/Aportación seleccionada:.*25,00/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Donar con tarjeta" })).toBeEnabled();
});

test("accepts decimal comma and sends a one-time payment handoff to the payment gateway", async ({ page }) => {
  await page.getByLabel("Otra cantidad").fill("12,50");
  await expect(page.getByText(/Aportación seleccionada:.*12,50/)).toBeVisible();

  await page.route("**/api/payments/create", async (route) => {
    const body = route.request().postDataJSON() as { amount: number; returnUrl: string };
    expect(body.amount).toBe(1250);
    expect(body.returnUrl).toContain("/ofrendas");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, data: { form: { action: "/e2e-payment-sink", params: { Ds_Merchant_Amount: "1250" } } } }),
    });
  });

  await page.route("**/e2e-payment-sink", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postData()).toContain("Ds_Merchant_Amount=1250");
    await route.fulfill({ status: 200, contentType: "text/html", body: "<main>Pago preparado</main>" });
  });

  await page.getByRole("button", { name: "Donar con tarjeta" }).click();
  await expect(page.getByText("Pago preparado")).toBeVisible();
});

test("shows a useful error when the payment API rejects a request", async ({ page }) => {
  await page.getByRole("button", { name: "50 €" }).click();
  await page.route("**/api/payments/create", (route) => route.fulfill({
    status: 400,
    contentType: "application/json",
    body: JSON.stringify({ ok: false, error: "Sensitive server detail" }),
  }));

  await page.getByRole("button", { name: "Donar con tarjeta" }).click();
  const paymentError = page.locator(".alert-error[role='alert']");
  await expect(paymentError).toContainText("No se pudo iniciar el pago");
  await expect(paymentError).not.toContainText("Sensitive server detail");
  await expect(page.getByRole("button", { name: "Donar con tarjeta" })).toBeEnabled();
});
