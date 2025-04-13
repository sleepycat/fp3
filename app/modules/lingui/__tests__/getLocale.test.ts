import { createCookie, createMemorySessionStorage } from "react-router";
import { describe, it, expect } from "vitest";
import { createLanguageDetector } from "../getLocale";

describe("getLocale", () => {
    const defaultOptions = {
        supportedLanguages: ["en", "es"],
        fallbackLanguage: "en",
        cookie: createCookie("lng"),
        sessionStorage: createMemorySessionStorage({
            cookie: {
                secrets: ["test"]
            }
        }),
    };

    it("should use the default (searchParams, cookie, session, header) order of detection", async () => {
        const getLocale = createLanguageDetector(defaultOptions);
        
        // Test searchParams first (should override cookie, session, and header)
        const request1 = new Request("http://example.com/?lng=es", {
            headers: {
                "Cookie": await defaultOptions.cookie.serialize("en"),
                "accept-language": "en, es;q=0.9"
            }
        });
        expect(await getLocale(request1)).toBe("es");

        // Test cookie second (should override session and header)
        const request2 = new Request("http://example.com", {
            headers: {
                "Cookie": await defaultOptions.cookie.serialize("es"),
                "accept-language": "en, es;q=0.9"
            }
        });
        expect(await getLocale(request2)).toBe("es");

        // Test session third (should override header)
        const session = await defaultOptions.sessionStorage.getSession();
        session.set("lng", "es");
        const request3 = new Request("http://example.com", {
            headers: {
                "Cookie": await defaultOptions.sessionStorage.commitSession(session),
                "accept-language": "en, es;q=0.9"
            }
        });
        expect(await getLocale(request3)).toBe("es");

        // Test header last (should be used when nothing else is present)
        const request4 = new Request("http://example.com", {
            headers: {
                "accept-language": "es, en;q=0.9"
            }
        });
        expect(await getLocale(request4)).toBe("es");
    });

    it("should respect custom order of detection", async () => {
        const getLocale = createLanguageDetector({
            ...defaultOptions,
            order: ["header", "cookie", "searchParams", "session"]
        });

        // Should get from header even though searchParams has a value
        const request = new Request("http://example.com/?lng=es", {
            headers: {
                "accept-language": "en, es;q=0.9",
                "Cookie": await defaultOptions.cookie.serialize("es")
            }
        });
        expect(await getLocale(request)).toBe("en");
    });

    it("should fallback to fallbackLanguage when no language is found", async () => {
        const getLocale = createLanguageDetector(defaultOptions);
        const request = new Request("http://example.com");
        expect(await getLocale(request)).toBe("en");
    });

    it("should throw error when session is the only method but no sessionStorage provided", () => {
        expect(() => {
            createLanguageDetector({
                ...defaultOptions,
                order: ["session"],
                sessionStorage: undefined
            });
        }).toThrow("You need a sessionStorage if you want to only get the locale from the session");
    });

    it("should throw error when cookie is the only method but no cookie provided", () => {
        expect(() => {
            createLanguageDetector({
                ...defaultOptions,
                order: ["cookie"],
                cookie: undefined
            });
        }).toThrow("You need a cookie if you want to only get the locale from the cookie");
    });

    it("should use custom key names when provided", async () => {
        const getLocale = createLanguageDetector({
            ...defaultOptions,
            searchParamKey: "lang",
            cookieKey: "lang",
            sessionKey: "lang"
        });

        // Test custom searchParam key
        const request1 = new Request("http://example.com/?lang=es");
        expect(await getLocale(request1)).toBe("es");

        // Test custom cookie key
        const request2 = new Request("http://example.com", {
            headers: {
                "Cookie": await defaultOptions.cookie.serialize("es")
            }
        });
        expect(await getLocale(request2)).toBe("es");

        // Test custom session key
        const session = await defaultOptions.sessionStorage.getSession();
        session.set("lang", "es");
        const request3 = new Request("http://example.com", {
            headers: {
                "Cookie": await defaultOptions.sessionStorage.commitSession(session)
            }
        });
        expect(await getLocale(request3)).toBe("es");
    });
}); 