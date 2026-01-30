import "dotenv/config";
import { test, expect } from "@playwright/test";
import sites from "../sites.config.json";

async function prepareForVisualTest(page: Page) {
	await page.addStyleTag({
		content: `
      * {
        animation: none !important;
        transition: none !important;
      }

      .swiper, .slider, .ad, .popup {
        visibility: hidden !important;
      }
    `,
	});

	await page.evaluate(() => document.fonts.ready);
}

for (const site of sites) {
	const baseUrl = process.env[site.baseUrlEnv];

	if (!baseUrl) {
		throw new Error(`Env ${site.baseUrlEnv} is not defined`);
	}

	test.describe(site.name, () => {
		for (const path of site.pages) {
			test(`${site.name} ${path}`, async ({ page }) => {
				await page.goto(baseUrl + path, { waitUntil: "networkidle" });
				await prepareForVisualTest(page);

				await expect(page).toHaveScreenshot(
					`${site.name}${path.replace(/\W/g, "_")}.png`,
					{ maxDiffPixelRatio: 0.005 },
				);
			});
		}
	});
}
