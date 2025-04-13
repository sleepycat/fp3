import { fromSearchParams } from "../fromSearchParams";
import { describe, it, expect } from "vitest";

describe("fromSearchParams", () => {
	it("should return the language from the search params", () => {
        // example.com is a IANA reserved domain for use in documentation
        // https://en.wikipedia.org/wiki/Example.com
        const request = new Request("http://example.com/?lang=en");
		const language = fromSearchParams(request, {paramName: "lang"});
        expect(language).toBe("en");
	});

    it("should return null if the language is not in the search params", () => {
        const request = new Request("http://example.com");
        const language = fromSearchParams(request, {paramName: "lang"});
        expect(language).toBeNull();
    });

});