import { fromCookie } from "../fromCookie";
import { describe, it, expect } from "vitest";

describe("fromCookie", () => {
    it("should return the language from the cookie", () => {
        // example.com is a IANA reserved domain for use in documentation
        // https://en.wikipedia.org/wiki/Example.com
        const request = new Request("http://example.com", {
            headers: {
              "Cookie": "lang=en; yummy_cookie=chocolate; tasty_cookie=strawberry",
            },
          });
        const language = fromCookie(request, {keyName: "lang"});
        expect(language).toBe("en");
    });

    it("should return null if the language key isn't included in the cookie", () => {
        const request = new Request("http://example.com", {
            headers: {
              "Cookie": "yummy_cookie=chocolate; tasty_cookie=strawberry",
            },
          });
        const language = fromCookie(request, {keyName: "lang"});
        expect(language).toBeNull();
    });

});