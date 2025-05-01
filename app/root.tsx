import { i18n } from "@lingui/core";
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	LinksFunction,
} from "react-router";
import {
	data,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { loadCatalog, useLocale } from "./modules/lingui/lingui";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Navigation from "./Navigation";
import TitleBar from "./TitleBar";
import { css } from "../styled-system/css";
import favicon from "./images/favicon.ico?url";
import font from "./fonts/OverusedGrotesk-VF.woff2?url";
import stylesheet from "./app.css?url";
import { getLocale } from "./entry.server";
import { localeCookie } from "./sessions.server";

export const links: LinksFunction = () => [
	// ...
	{ rel: "icon", href: favicon, type: "image/x-icon" },
	{ rel: "stylesheet", href: stylesheet, crossOrigin: "anonymous" },
	{
		rel: "preload",
		as: "font",
		href: font,
		type: "font/woff2",
		crossOrigin: "anonymous",
	},
];

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const locale = formData.get("locale") ?? "en";
	return data(
		{ locale },
		{
			headers: {
				"Set-Cookie": await localeCookie.serialize(locale),
			},
		},
	);
}

export async function loader({ request }: LoaderFunctionArgs) {
	const locale = await getLocale(request);
	return data(
		{
			locale,
		},
		{
			headers: {
				"Set-Cookie": await localeCookie.serialize(locale),
				"Cache-Control": "private, max-age=10",
			},
		},
	);
}

const mainClass = css`
  width: 75%;
  height: 100%;
  margin: auto auto;
  padding: 1em 2em;
`;

export type RootLoaderType = typeof loader;

export function Layout({ children }: { children: React.ReactNode }) {
	const locale = useLocale();

	useEffect(() => {
		if (i18n.locale !== locale) {
			loadCatalog(locale);
		}
	}, [locale]);

	return (
		<html lang={locale ?? "en"}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Header />
				<TitleBar />
				<Navigation />
				{/*
         No need for "skip to main content" links:
         "The main role is a non-obtrusive alternative for "skip to main content" links"
         https://www.w3.org/TR/wai-aria/#main
         The <main> element has the role="main" by default.
        */}
				<main className={mainClass}>{children}</main>
				<Footer />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
