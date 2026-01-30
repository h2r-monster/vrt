# Playwright + GitHub Actions によるビジュアルリグレッションテスト

## 目的
以下の条件を満たす **費用ゼロのビジュアルリグレッションテスト** を構築する。
- 月1回程度の更新チェック
- 限られたページのみテスト
- 更新（修正）「前後」の差分確認
- 簡易的な表示崩れのみを確認

---

## ディレクトリ構成

```
GitHub Repository
├─ playwright.config.js
├─ package.json
├─ sites.config.json　# sample
├─ .env               # sample
├─ tests/
│  └─ visual.spec.ts
├─ snapshots/
└─  workflows/
      └─ visual-regression.yml
```

---

## セットアップ手順

### 1. Node.js 初期化
```bash
npm init -y
npm install -D @playwright/test
npx playwright install chromium
```

---

### 2. Playwright.config.ts 設定

```ts
import "dotenv/config";
import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	snapshotDir: "./snapshots",
	retries: 0,
	reporter: [["html"], ["list"]],
	use: {
		browserName: "chromium",
		viewport: { width: 1280, height: 800 },
		animations: "disabled",
	},
});
```

---

### テスト対象ページの定義（限定ページ）

#### .envにベースURLを設定
```
SITE_1_URL=https://example-aaa.com
SITE_2_URL=https://example-bbb.com
```

#### sites.config.jsonにテスト対象のページを設定
```json
[
	{
		"name": "site-1",
		"baseUrlEnv": "SITE_1_URL",
		"pages": ["/", "/business/", "/csr/"]
	},
	{
		"name": "site-2",
		"baseUrlEnv": "SITE_2_URL",
		"pages": ["/", "/staff/", "/menu/", "/news/"]
	}
]
```
---

## ローカルでのビジュアルリグレッションテストの流れ
1. 基準（baseline）スクリーンショット作成
```bash
npx playwright test --update-snapshots
```
2. サイトの更新または修正
3. 更新後スクリーンショット取得 & 差分比較 → PlayWriteのレポートが作成
```bash
npx playwright test
```
4. レポートの確認
```bash
npx playwright show-report
```
5.  問題なければ、基準スクリーンショットを更新
```bash
npx playwright test --update-snapshots
```
