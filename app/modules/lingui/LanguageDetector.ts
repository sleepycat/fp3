import { pick } from "accept-language-parser";
import { getClientLocales } from "./utils";
import type { Cookie, SessionStorage } from "react-router";

// Options interface remains the same, but will be used directly
export interface LanguageDetectorOption {
	/**
	 * Define the list of supported languages, this is used to determine if one of
	 * the languages requested by the user is supported by the application.
	 * This should be be same as the supportedLngs in the i18next options.
	 */
	supportedLanguages: string[];
	/**
	 * Define the fallback language that it's going to be used in the case user
	 * expected language is not supported.
	 * This should be be same as the fallbackLng in the i18next options.
	 */
	fallbackLanguage: string;
	/**
	 * If you want to use a cookie to store the user preferred language, you can
	 * pass the Cookie object here.
	 */
	cookie?: Cookie;
	/**
	 * If you want to use a session to store the user preferred language, you can
	 * pass the SessionStorage object here.
	 * When this is not defined, getting the locale will ignore the session.
	 */
	sessionStorage?: SessionStorage;
	/**
	 * If defined a sessionStorage and want to change the default key used to
	 * store the user preferred language, you can pass the key here.
	 * @default "lng"
	 */
	sessionKey?: string;
	/**
	 * If you want to use search parameters for language detection and want to
	 * change the default key used to for the parameter name,
	 * you can pass the key here.
	 * @default "lng"
	 */
	searchParamKey?: string;
	/**
	 * The order the library will use to detect the user preferred language.
	 * By default the order is
	 * - searchParams
	 * - cookie
	 * - session
	 * - header
	 * And finally the fallback language.
	 */
	order?: Array<"searchParams" | "cookie" | "session" | "header">;
}

// Removed the old RemixLinguiOptions interface

/**
 * Merged class combining RemixLingui wrapper and LanguageDetector logic.
 * Detects the user preferred language fully server-side using options.
 */
export class LanguageDetector {
	// Renamed from LanguageDetector
	// Store options directly
	constructor(private options: LanguageDetectorOption) {
		// Validation logic remains
		this.isSessionOnly(options);
		this.isCookieOnly(options);
	}

	// Validation methods remain the same
	private isSessionOnly(options: LanguageDetectorOption) {
		if (
			options.order?.length === 1 &&
			options.order[0] === "session" &&
			!options.sessionStorage
		) {
			throw new Error(
				"You need a sessionStorage if you want to only get the locale from the session",
			);
		}
	}

	private isCookieOnly(options: LanguageDetectorOption) {
		if (
			options.order?.length === 1 &&
			options.order[0] === "cookie" &&
			!options.cookie
		) {
			throw new Error(
				"You need a cookie if you want to only get the locale from the cookie",
			);
		}
	}

	/**
	 * Detect the current locale by following the order defined in the
	 * `options.order`.
	 * By default the order is
	 * - searchParams
	 * - cookie
	 * - session
	 * - header
	 * And finally the fallback language.
	 */
	public async getLocale(request: Request): Promise<string> {
		// Renamed from detect
		const order = this.options.order ?? [
			"searchParams",
			"cookie",
			"session",
			"header",
		];

		for (const method of order) {
			let locale: string | null = null;

			// Logic for each detection method remains the same
			if (method === "searchParams") {
				locale = this.fromSearchParams(request);
			}

			if (method === "cookie") {
				locale = await this.fromCookie(request);
			}

			if (method === "session") {
				locale = await this.fromSessionStorage(request);
			}

			if (method === "header") {
				locale = this.fromHeader(request);
			}

			if (locale) return locale;
		}

		return this.options.fallbackLanguage;
	}

	// Helper methods remain exactly the same
	private fromSearchParams(request: Request): string | null {
		const url = new URL(request.url);
		if (!url.searchParams.has(this.options.searchParamKey ?? "lng")) {
			return null;
		}
		return this.fromSupported(
			url.searchParams.get(this.options.searchParamKey ?? "lng"),
		);
	}

	private async fromCookie(request: Request): Promise<string | null> {
		if (!this.options.cookie) return null;

		const cookie = this.options.cookie;
		const lng = await cookie.parse(request.headers.get("Cookie"));

		if (typeof lng !== "string" || !lng) return null;

		return this.fromSupported(lng);
	}

	private async fromSessionStorage(request: Request): Promise<string | null> {
		if (!this.options.sessionStorage) return null;

		const session = await this.options.sessionStorage.getSession(
			request.headers.get("Cookie"),
		);

		const lng = session.get(this.options.sessionKey ?? "lng");

		if (!lng) return null;

		return this.fromSupported(lng);
	}

	private fromHeader(request: Request): string | null {
		const locales = getClientLocales(request); // Returns string | string[] | undefined

		if (!locales) {
			return null;
		}

		// If locales is an array, join it back into a string that 'pick' can parse.
		// If it's already a string, use it directly.
		const localeString = Array.isArray(locales) ? locales.join(",") : locales;

		// Pass the string to fromSupported, which correctly calls 'pick'
		return this.fromSupported(localeString);
	}

	private fromSupported(language: string | null) {
		// Use pick with strict first, then loose if needed
		return (
			pick(
				this.options.supportedLanguages,
				language ?? "", // Provide empty string if language is null
				{ loose: false },
			) ||
			pick(
				this.options.supportedLanguages,
				language ?? "", // Provide empty string if language is null
				{ loose: true },
			) ||
			null // Return null explicitly if pick fails
		);
	}
}
