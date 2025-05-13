import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
	root: "./src",
	build: {
		outDir: "../dist",
	},
	plugins: [ViteMinifyPlugin()],
});
