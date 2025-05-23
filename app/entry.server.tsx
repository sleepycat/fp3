/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from "node:stream";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { AppLoadContext, EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { loadCatalog } from "./modules/lingui/lingui";
import { createLanguageDetector } from "./modules/lingui/getLocale";
import config from "./modules/lingui/config";
import { localeCookie } from "./sessions.server";
import { createContext } from "./context";

export const streamTimeout = 5000;

// Configure the language detector
export const getLocale = createLanguageDetector({
	supportedLanguages: config.locales,
	fallbackLanguage:
		(!!config.fallbackLocales && config.fallbackLocales?.default) || "en",
	cookie: localeCookie,
	cookieKey: "locale",
});

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
	// This is ignored so we can keep it in the template for visibility.  Feel
	// free to delete this parameter in your app if you're not using it!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	loadContext: AppLoadContext = createContext(),
) {
	return isbot(request.headers.get("user-agent") || "")
		? handleBotRequest(
				request,
				responseStatusCode,
				responseHeaders,
				reactRouterContext,
				loadContext,
			)
		: handleBrowserRequest(
				request,
				responseStatusCode,
				responseHeaders,
				reactRouterContext,
				loadContext,
			);
}

async function handleBotRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
	loadContext: AppLoadContext,
) {
	const locale = await getLocale(request);
	await loadCatalog(locale);

	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const { pipe, abort } = renderToPipeableStream(
			<I18nProvider i18n={i18n}>
				<ServerRouter context={reactRouterContext} url={request.url} />
			</I18nProvider>,
			{
				onAllReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, streamTimeout + 1000);
	});
}

async function handleBrowserRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
	loadContext: AppLoadContext,
) {
	const locale = await getLocale(request);
	await loadCatalog(locale);

	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const { pipe, abort } = renderToPipeableStream(
			<I18nProvider i18n={i18n}>
				<ServerRouter context={reactRouterContext} url={request.url} />
			</I18nProvider>,
			{
				onShellReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, streamTimeout + 1000);
	});
}
