import { LocaleSelector } from "~/modules/lingui/lingui";
import { t, Trans } from "@lingui/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { LinksFunction } from "react-router";
import { data } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { linguiServer, localeCookie } from "./modules/lingui/lingui.server";
import { loadCatalog, useLocale } from "./modules/lingui/lingui";
import { useEffect } from "react";
import { i18n } from "@lingui/core";
import { css } from "../styled-system/css";
import stylesheet from "./app.css?url";

export const links: LinksFunction = () => [
	// ...
	{ rel: "stylesheet", href: stylesheet },
];

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const locale = formData.get("locale") ?? "en";

	return data(null, {
		headers: {
			"Set-Cookie": await localeCookie.serialize(locale),
		},
	});
}

export async function loader({ request }: LoaderFunctionArgs) {
	const locale = await linguiServer.getLocale(request);

	return data(
		{
			locale,
		},
		{
			headers: {
				"Set-Cookie": await localeCookie.serialize(locale),
			},
		},
	);
}

const headerClass = css`
  padding: 1em;
  display: flex;
  justify-content: space-between;
`;

const mainClass = css`
  width: 80%;
  margin: auto auto;
  flex: 1 0 auto;
`;

const footerClass = css`
  padding: 2em;
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  background-color: #f1f2f3;
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
			<body className={css`background-color: #ffffff;`}>
				<header className={headerClass}>
					<Trans>Royal Canadian Mounted Police</Trans>
					<LocaleSelector />
				</header>
				<main className={mainClass}>{children}</main>
				<footer className={footerClass}>
					<Trans>links</Trans>
				</footer>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
