import { acceptsLanguages } from "@std/http/negotiation";

export function fromSearchParams(
    request: Request,
    { paramName = "lng", supportedLanguages }: { paramName?: string; supportedLanguages: string[] }
): string | null {
    const url = new URL(request.url);
    const language = url.searchParams.get(paramName);
    if (!language) return null;

    const requestWithLanguage = new Request("http://example.com", {
        headers: {
            "accept-language": language
        }
    });
    
    const preferred = acceptsLanguages(requestWithLanguage);
    if (!preferred) return null;
    
    for (const lang of preferred) {
        if (supportedLanguages.includes(lang)) {
            return lang;
        }
    }
    
    return null;
}