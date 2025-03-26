import { lingui } from "@lingui/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import macrosPlugin from "vite-plugin-babel-macros";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
	// or cloudflare, deno, etc.
	interface Future {
		v3_singleFetch: true;
	}
}

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		reactRouter({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
			},
		}),
		macrosPlugin(),
		lingui(),
		tsconfigPaths(),
	],
});
