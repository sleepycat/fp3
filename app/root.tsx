import { ActionFunctionArgs, LoaderFunctionArgs, logDevReady } from "react-router";
import { data } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { linguiServer, localeCookie } from "./modules/lingui/lingui.server";
import { loadCatalog, useLocale } from "./modules/lingui/lingui";
import { useEffect } from "react";
import { i18n } from "@lingui/core";

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
	console.log({ rootLoaderlocale: locale, url: request.url });

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
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
