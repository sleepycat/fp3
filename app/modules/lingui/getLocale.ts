import type { Cookie, SessionStorage } from "react-router";
import { fromSearchParams } from "./fromSearchParams";
import { fromCookie } from "./fromCookie";
import { fromSessionStorage } from "./fromSessionStorage";
import { fromHeader } from "./fromHeader";

export interface LanguageDetectorOptions {
	supportedLanguages: string[];
	fallbackLanguage: string;
	cookie?: Cookie;
	sessionStorage?: SessionStorage;
	sessionKey?: string;
	cookieKey?: string;
	searchParamKey?: string;
	order?: Array<"searchParams" | "cookie" | "session" | "header">;
}

export function createLanguageDetector(options: LanguageDetectorOptions) {
	// Validate options
	if (
		options.order?.length === 1 &&
		options.order[0] === "session" &&
		!options.sessionStorage
	) {
		throw new Error(
			"You need a sessionStorage if you want to only get the locale from the session",
		);
	}
	if (
		options.order?.length === 1 &&
		options.order[0] === "cookie" &&
		!options.cookie
	) {
		throw new Error(
			"You need a cookie if you want to only get the locale from the cookie",
		);
	}

	return async function getLocale(request: Request): Promise<string> {
		const order = options.order ?? [
			"searchParams",
			"cookie",
			"session",
			"header",
		];

		for (const method of order) {
			let locale: string | null = null;

			switch (method) {
				case "searchParams":
					locale = fromSearchParams(request, {
						paramName: options.searchParamKey,
						supportedLanguages: options.supportedLanguages,
					});
					break;
				case "cookie":
					if (options.cookie) {
						locale = await fromCookie(request, {
							keyName: options.cookieKey ?? "locale",
							cookie: options.cookie,
							supportedLanguages: options.supportedLanguages,
						});
					}
					break;
				case "session":
					if (options.sessionStorage) {
						locale = await fromSessionStorage(request, {
							sessionStorage: options.sessionStorage,
							sessionKey: options.sessionKey,
							supportedLanguages: options.supportedLanguages,
						});
					}
					break;
				case "header":
					locale = fromHeader(request, {
						supportedLanguages: options.supportedLanguages,
					});
					break;
			}

			if (locale) return locale;
		}

		return options.fallbackLanguage;
	};
}
