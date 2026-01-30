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
