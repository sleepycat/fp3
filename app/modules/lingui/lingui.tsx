import { i18n } from "@lingui/core";
import { t, msg } from "@lingui/core/macro";
import {
	useFetcher,
	useFetchers,
	useMatches,
	useRouteLoaderData,
} from "react-router";
import { Trans } from "@lingui/react/macro";
import type { MessageDescriptor } from "@lingui/core";
import type config from "./config";
import type { ComponentProps } from "react";
import type { action, RootLoaderType } from "~/root";

export function getLanguages(): Array<{
	key: (typeof config.locales)[number];
	label: MessageDescriptor;
}> {
	return [
		{ key: "en", label: msg`English` },
		{ key: "fr", label: msg`French` },
	];
}

export async function loadCatalog(locale: string) {
	const { messages } = await import(`../../locales/${locale}.po`);

	return i18n.loadAndActivate({ locale, messages });
}

/**
 * Get the locale returned by the root route loader under the `locale` key.
 * @example
 * let locale = useLocale()
 * let formattedDate = date.toLocaleDateString(locale);
 * @example
 * let locale = useLocale("language")
 * let formattedDate = date.toLocaleDateString(locale);
 */
export function useLocale(localeKey = "locale"): string {
	const [rootMatch] = useMatches();
	const { [localeKey]: locale } =
		(rootMatch.data as Record<string, string>) ?? {};
	if (!locale) throw new Error("Missing locale returned by the root loader.");
	if (typeof locale === "string") return locale;
	throw new Error("Invalid locale returned by the root loader.");
}

export function useOptimisticLocale() {
	const fetchers = useFetchers();
	const themeFetcher = fetchers.find((f) => f.formAction === "/");

	if (themeFetcher?.formData) {
		const submission = Object.fromEntries(themeFetcher.formData);

		// Use Valibot or zod to validate
		if (
			submission.status === "success" &&
			typeof submission.value === "object" &&
			"locale" in submission.value
		) {
			return submission.value.locale as string;
		}
	}
}

export function LocaleSelector(props: ComponentProps<"select">) {
	// use a select for languages because we want to support
	//  more than just fr/en.
	const languages = getLanguages();
	const { locale, setLocale } = useLocaleSelector();

	return (
		<select
			aria-label={i18n._("Switch language")}
			onChange={(e) => setLocale(e.currentTarget.value)}
			defaultValue={i18n.locale}
			{...props}
		>
			{languages.map((language) => (
				<option key={language.key} value={language.key}>
					{t(language.label)}
				</option>
			))}
		</select>
	);
}

export function useLocaleSelector() {
	const data = useRouteLoaderData<RootLoaderType>("root");
	const fetcher = useFetcher<typeof action>();

	const optimisticLocale = useOptimisticLocale();
	const locale = optimisticLocale ?? data?.locale ?? "en";

	const setLocale = (newLocale: string) => {
		// Only submit if the locale is actually changing
		if (newLocale !== locale) {
			fetcher.submit(
				{
					locale: newLocale,
				},
				{
					method: "POST",
					action: "/",
				},
			);
		}
	};

	return {
		locale,
		setLocale,
	};
}
