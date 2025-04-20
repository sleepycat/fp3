import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ["./app/**/*.{ts,tsx,js,jsx}"],

	// Files to exclude
	exclude: [],
	hash: true,

	// Useful for theme customization
	theme: {
		extend: {},
	},

	// The output directory for your css system
	outdir: "styled-system",

	// The JSX framework to use
	jsxFramework: "react",

	// The CSS Syntax to use to use
	syntax: "template-literal",
});
