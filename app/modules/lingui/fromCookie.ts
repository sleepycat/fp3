import type { Cookie } from "react-router";

export async function fromCookie(
    request: Request,
    { keyName = "lng", cookie, supportedLanguages }: { keyName?: string; cookie: Cookie; supportedLanguages: string[] }
): Promise<string | null> {
    const cookieHeader = request.headers.get("Cookie");
    
    const cookies = await cookie.parse(cookieHeader);
 
    // Handle case where cookies is a string (direct value)
    const language = typeof cookies === 'string' ? cookies : cookies?.[keyName];
  
    if (!language) return null;

    if (supportedLanguages.includes(language)) {
        return language;
    }
    
    return null;
}