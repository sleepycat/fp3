import { acceptsLanguages } from "@std/http/negotiation";

export function fromSearchParams(
    request: Request,
    { paramName = "locale", supportedLanguages }: { paramName?: string; supportedLanguages: string[] }
): string | null {
    const url = new URL(request.url);
    const language = url.searchParams.get(paramName);
    if (!language) return null;
    
    return supportedLanguages.includes(language) ? language : null;
}