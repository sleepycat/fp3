import { fromHeader } from "../fromHeader";
import { describe, it, expect } from "vitest";

describe("fromHeader", () => {
    it("should return the first supported language from the header", () => {
        // example.com is a IANA reserved domain for use in documentation
        // https://en.wikipedia.org/wiki/Example.com
        const request = new Request("https://example.com/", {
            headers: {
                "accept-language": "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
            },
        });
        const language = fromHeader(request, {
            supportedLanguages: ["en", "es"]
        });
        expect(language).toBe("en");
    });

    it("should return null if no supported language is found", () => {
        const request = new Request("https://example.com/", {
            headers: {
                "accept-language": "fr-CH, fr;q=0.9, de;q=0.7, *;q=0.5",
            },
        });
        const language = fromHeader(request, {
            supportedLanguages: ["en", "es"]
        });
        expect(language).toBeNull();
    });

    it("should return null if the header is not present", () => {
        const request = new Request("https://example.com/");
        const language = fromHeader(request, {
            supportedLanguages: ["en", "es"]
        });
        expect(language).toBeNull();
    });
});


