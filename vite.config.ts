import { lingui } from "@lingui/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
/// <reference types="panda" />
import pandacss from "@pandacss/dev/postcss";
import { defineConfig } from "vite";
import macrosPlugin from "vite-plugin-babel-macros";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	css: { postcss: { plugins: [pandacss, autoprefixer] } },
	server: {
		port: 3000,
	},
	plugins: [reactRouter(), macrosPlugin(), lingui(), tsconfigPaths()],
});
