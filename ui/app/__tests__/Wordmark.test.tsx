/**
 * @jest-environment jsdom
 */
import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Wordmark from "../Wordmark.js";

describe("<Wordmark.SVG />", () => {
	it("renders an SVG element", async () => {
		render(
			<Wordmark.SVG
				aria-label={"Symbol of the Government of Canada"}
				role="img"
				width="10em"
			>
				<Wordmark.Flag />
				<Wordmark.Text />
			</Wordmark.SVG>,
		);
		const image = await screen.findByRole("img");
		expect(image.tagName).toEqual("svg");
	});

	it("has preserve aspect ratio set", async () => {
		render(
			<Wordmark.SVG aria-label={"wordmark"} role="img" width="10em">
				<Wordmark.Flag />
				<Wordmark.Text />
			</Wordmark.SVG>,
		);
		const image = screen.getByLabelText("wordmark");
		expect(image.getAttribute("preserveAspectRatio")).toEqual("xMinYMin meet");
	});

	it("passes through whatever props you supply", async () => {
		render(
			<Wordmark.SVG aria-label={"arbitraryprops"} role="img" data-foo="bar">
				<Wordmark.Flag />
				<Wordmark.Text />
			</Wordmark.SVG>,
		);
		const image = screen.getByLabelText("arbitraryprops");
		expect(image.getAttribute("data-foo")).toEqual("bar");
	});

	it("passing a <title> for accessibility works", async () => {
		render(
			<Wordmark.SVG role="img" data-foo="this one!">
				<title>some title</title>
				<Wordmark.Flag />
				<Wordmark.Text />
			</Wordmark.SVG>,
		);

		const titleElement = screen.getByTitle("some title");
		expect(titleElement.parentElement?.getAttribute("data-foo")).toEqual(
			"this one!",
		);
	});
});

describe("<Wordmark.Flag />", () => {
	it("passes through whatever props you supply", async () => {
		const { container } = render(
			<Wordmark.SVG role="img">
				<Wordmark.Flag data-foo="bar" />
				<Wordmark.Text />
			</Wordmark.SVG>,
		);
		const flag = container.querySelector('[data-foo="bar"]');
		expect(flag?.tagName).toEqual("path");
	});
});
describe("<Wordmark.Text/>", () => {
	it("passes through whatever props you supply", async () => {
		const { container } = render(
			<Wordmark.SVG
				aria-label={"Symbol of the Government of Canada"}
				role="img"
			>
				<Wordmark.Flag />
				<Wordmark.Text data-foo="bar" />
			</Wordmark.SVG>,
		);
		const flag = container.querySelector('[data-foo="bar"]');
		expect(flag.tagName).toEqual("path");
	});
});
