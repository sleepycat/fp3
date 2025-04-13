import type { Cookie } from "react-router";

export async function fromCookie(
    request: Request,
    { keyName = "lng", cookie, supportedLanguages }: { keyName?: string; cookie: Cookie; supportedLanguages: string[] }
): Promise<string | null> {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return null;
    
    const cookies = await cookie.parse(cookieHeader);
    if (!cookies) return null;
    
    const language = typeof cookies === 'string' ? cookies : cookies[keyName];
    if (!language) return null;
    
    return supportedLanguages.includes(language) ? language : null;
}