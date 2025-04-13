import { fromCookie } from "../fromCookie";
import { describe, it, expect } from "vitest";
import { createCookie } from "react-router";

describe("fromCookie", () => {
    it("should return the language from the cookie", async () => {
        // example.com is a IANA reserved domain for use in documentation
        // https://en.wikipedia.org/wiki/Example.com
        const cookie = createCookie("lang");
        const request = new Request("http://example.com", {
            headers: {
                "Cookie": await cookie.serialize("en")
            },
        });
        const language = await fromCookie(request, {
            cookie,
            supportedLanguages: ["en", "es"],
            keyName: "lang"
        });
        expect(language).toBe("en");
    });

    it("should return null if the language key isn't included in the cookie", async () => {
        const cookie = createCookie("lang");
        const request = new Request("http://example.com");
        const language = await fromCookie(request, {
            cookie,
            supportedLanguages: ["en", "es"],
            keyName: "lang"
        });
        expect(language).toBeNull();
    });
});