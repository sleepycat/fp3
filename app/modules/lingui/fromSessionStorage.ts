import type { SessionStorage } from "react-router";
import { acceptsLanguages } from "@std/http/negotiation";

export async function fromSessionStorage(
    request: Request,
    { sessionStorage, sessionKey = "lng", supportedLanguages }: { 
        sessionStorage: SessionStorage; 
        sessionKey?: string;
        supportedLanguages: string[];
    }
): Promise<string | null> {
    if (!request.headers.has("Cookie")) return null;
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie"),
    );

    const language = session.get(sessionKey);
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