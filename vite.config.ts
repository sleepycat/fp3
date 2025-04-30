/// <reference types="panda" />
/// <reference types="vitest" />
import { lingui } from "@lingui/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import pandacss from "@pandacss/dev/postcss";
import { defineConfig } from "vite";
import macrosPlugin from "vite-plugin-babel-macros";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	css: { postcss: { plugins: [pandacss, autoprefixer] } },
	server: {
		port: 3000,
	},
	// To understand the VITEST thing
	// refer to: https://akoskm.com/react-router-vitest-example
	plugins: [
		!process.env.VITEST && reactRouter(),
		macrosPlugin(),
		lingui(),
		tsconfigPaths(),
	],
});
