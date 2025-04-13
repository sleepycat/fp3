import { createMemorySessionStorage } from "react-router";
import { expect, describe, it } from "vitest";
import { fromSessionStorage } from "../fromSessionStorage";

describe("fromSessionStorage", () => {
    it("should return the language from the session storage", async () => {
        // example.com is a IANA reserved domain for use in documentation
        // https://en.wikipedia.org/wiki/Example.com
        const sessionStorage = createMemorySessionStorage({
            cookie: {
                // This "secret" is required by the session storage
                // otherwise it will print a warning in the console
                secrets: ["test"]
            }
        });
        const session = await sessionStorage.getSession();
        session.set("lng", "en");
        
        const request = new Request("http://example.com", {
            headers: {
                Cookie: await sessionStorage.commitSession(session)
            }
        });
        
        const language = await fromSessionStorage(request, {
            sessionStorage,
            sessionKey: "lng",
            supportedLanguages: ["en", "es"]
        });
        expect(language).toBe("en");
    });

    it("should return null if the language key isn't included in the session storage", async () => {
        const sessionStorage = createMemorySessionStorage({
            cookie: {
                // This "secret" is required by the session storage
                // otherwise it will print a warning in the console
                secrets: ["test"] 
            }
        });
        const session = await sessionStorage.getSession();
    
        const request = new Request("http://example.com", {
            headers: {
                Cookie: await sessionStorage.commitSession(session)
            }
        }); 
        
        const language = await fromSessionStorage(request, {
            sessionStorage,
            sessionKey: "lng",
            supportedLanguages: ["en", "es"]
        });
        expect(language).toBeNull();
    });
});