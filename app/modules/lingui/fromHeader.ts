// Used deno's std library instead of opentable/accept-language-parser:
// https://github.com/opentable/accept-language-parser/issues/41
// https://jsr.io/@std/http/doc/negotiation/~/acceptsLanguages
// jsr compatibility: https://jsr.io/docs/with/node
import { acceptsLanguages } from "@std/http/negotiation";

export function fromHeader(
    request: Request,
    { supportedLanguages }: { supportedLanguages: string[] }
): string | null {
    const acceptLanguage = request.headers.get("accept-language");
    if (!acceptLanguage) return null;
    
    const preferred = acceptsLanguages(request);
    if (!preferred) return null;
    
    return supportedLanguages.find(lang => preferred.includes(lang)) ?? null;
}