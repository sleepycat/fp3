/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { data, createRoutesStub } from "react-router";
import { render, act, screen, waitFor } from "@testing-library/react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import { messages as en } from "../../locales/en";
import { messages as fr } from "../../locales/fr";
import Index from "../home";

i18n.load({
	en,
	fr,
});

const TestingProvider = ({ children }: any) => (
	<I18nProvider i18n={i18n}>{children}</I18nProvider>
);

describe("/", () => {
	it("displays text", async () => {
		const Stub = createRoutesStub([
			{
				path: "/",
				Component: Index,
				// without this you a a warning:
				// No `HydrateFallback` element provided to render during initial hydration
				HydrateFallback: () => <p>fallback</p>,
				loader() {
					data({ title: "foo" });
				},
			},
		]);

		act(() => i18n.activate("en"));

		// render the app stub at "/login"
		render(<Stub initialEntries={["/"]} />, { wrapper: TestingProvider });
		const heading = await screen.findByText("Federal Policing Public Portal");
		expect(heading?.textContent).toContain("Federal");
	});
});
