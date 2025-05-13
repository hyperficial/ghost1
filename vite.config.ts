import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { viteStaticCopy } from "vite-plugin-static-copy";

import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// @ts-ignore
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";

export default defineConfig({
	root: "./src",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},
	plugins: [
		ViteMinifyPlugin(),
		viteStaticCopy({
			targets: [
				{
					src: `${uvPath}/**/*`.replace(/\\/g, "/"),
					dest: "uv",
					overwrite: false,
				},
				{
					src: `${baremuxPath}/**/*`.replace(/\\/g, "/"),
					dest: "bare-mux",
					overwrite: false,
				},
				{
					src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
					dest: "epoxy",
					overwrite: false,
				},
			],
		}),
		{
			name: "Wisp Server",
			configureServer(server) {
				server.httpServer?.on("upgrade", (req, socket, head) => {
					if (req.url?.startsWith("/wisp/")) {
						wisp.routeRequest(req, socket, head);
					}
				});
			},
		},
	],
});
