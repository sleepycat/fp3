import { acceptsLanguages } from "@std/http/negotiation";

export function pickLanguage({availableLanguages, acceptLanguage}: {availableLanguages: string[], acceptLanguage: string}): string {

    const preferred = acceptsLanguages(new Request("http://example.com", {
        headers: {
            "accept-language": acceptLanguage
        }
    }));
    if (!preferred) return availableLanguages[0];
    
    // Find the first preferred language that matches an available language
    for (const lang of preferred) {
        if (availableLanguages.includes(lang)) {
            return lang;
        }
    }
    
    return availableLanguages[0];
}