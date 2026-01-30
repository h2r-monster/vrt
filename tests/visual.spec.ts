import 'dotenv/config';
import { test, expect } from '@playwright/test';

const sites = [
  {
    name: 'site1',
    baseUrl: process.env.SITE_1_URL!,
    pages: ['/', '/about/', '/contact/'],
  },
  {
    name: 'site2',
    baseUrl: process.env.SITE_2_URL!,
    pages: ['/', '/service/'],
  },
];

for (const site of sites) {
  test.describe(site.name, () => {
    for (const path of site.pages) {
      test(`${site.name} ${path}`, async ({ page }) => {
        await page.goto(site.baseUrl + path, {
          waitUntil: 'networkidle',
        });

        // 動的要素の無効化（差分ノイズ対策）
        await page.addStyleTag({
          content: `
            .swiper, .slider, .popup, .ad {
              visibility: hidden !important;
            }
          `,
        });

        await expect(page).toHaveScreenshot(
          `${site.name}${path.replace(/\W/g, '_')}.png`,
          { maxDiffPixelRatio: 0.01 }
        );
      });
    }
  });
}
