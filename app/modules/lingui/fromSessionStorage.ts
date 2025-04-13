import type { SessionStorage } from "react-router";

export async function fromSessionStorage(request: Request, {sessionStorage, sessionKey}: {sessionStorage: SessionStorage, sessionKey: string}): Promise<string | null> {
    if (!request.headers.has("Cookie")) return null;
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie"),
    );

    const language = session.get(sessionKey);

    if (!language) return null;

    return language;
}