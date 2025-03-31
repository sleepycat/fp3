import config from "./config";
// Import the merged class
import { RemixLingui } from "./remix.server";
import { createCookie } from "react-router";

export const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
});

// Instantiate the merged RemixLingui class directly
// Pass the options object without the 'detection' nesting
export const linguiServer = new RemixLingui({
  supportedLanguages: config.locales,
  fallbackLanguage:
    (!!config.fallbackLocales && config.fallbackLocales?.default) || "en",
  cookie: localeCookie,
  // Add other options like 'order', 'sessionStorage', 'searchParamKey' here if needed
});