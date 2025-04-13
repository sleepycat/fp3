// Used deno's std library instead of opentable/accept-language-parser:
// https://github.com/opentable/accept-language-parser/issues/41
// https://jsr.io/@std/http/doc/negotiation/~/acceptsLanguages
// jsr compatibility: https://jsr.io/docs/with/node
import { acceptsLanguages } from "@std/http/negotiation";

export function fromHeader(request: Request): string[] | null {
    const locales = acceptsLanguages(request) // Returns string | string[] | undefined

    // If the header is not present or the first locale is '*' (wildcard), return null
    if (!locales || locales[0] === '*') {
        return null;
    }

    return locales;
}