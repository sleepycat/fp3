import { fromHeader } from "../fromHeader";
import { describe, it, expect } from "vitest";


describe("fromHeader", () => {
    it("should return the locales from the header", () => {
        const request = new Request("https://example.com/", {
            headers: {
              "accept-language": "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
            },
          });
        const locales = fromHeader(request);
        expect(locales).toEqual(["fr-CH", "fr", "en", "de", "*"]);
    });

    it("should return null if the header is not present", () => {
        const request = new Request("https://example.com/");
        const locales = fromHeader(request);
        expect(locales).toBeNull();
    });
    
    
});


