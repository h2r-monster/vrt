import { test, expect } from '@playwright/test';

const sites = [
  {
    name: 'siteA',
    baseUrl: 'https://example-a.com',
    pages: ['/', '/about/', '/contact/'],
  },
  {
    name: 'siteB',
    baseUrl: 'https://example-b.com',
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
