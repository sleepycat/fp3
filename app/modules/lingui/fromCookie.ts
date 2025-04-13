import cookie from 'cookie';

export function fromCookie(request: Request, {keyName}: {keyName: string}): string | null {
    if (!request.headers.has("Cookie")) return null;
    const cookies = cookie.parse(request.headers.get("Cookie") ?? "");
    const language = cookies[keyName];
    if (typeof language !== "string" || !language) return null;
    return language;
}