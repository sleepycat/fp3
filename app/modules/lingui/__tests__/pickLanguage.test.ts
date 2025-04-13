import { pickLanguage } from "../pickLanguage";
import { describe, it, expect } from "vitest";

describe("pickLanguage", () => {
    it("should return the first language if no preferred language is found", () => {
        const availableLanguages = ["en", "fr"];
        const acceptLanguage = "en-US, en;q=0.9, fr;q=0.8, de;q=0.7, *;q=0.5";
        const result = pickLanguage({availableLanguages, acceptLanguage});
        expect(result).toBe("en");
    });

});