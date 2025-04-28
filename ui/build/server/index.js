var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { i18n } from "@lingui/core";
import { Trans, I18nProvider } from "@lingui/react";
import { createReadableStreamFromReadable } from "@react-router/node";
import { createCookie, useMatches, useRouteLoaderData, useFetcher, useFetchers, ServerRouter, useActionData, useLoaderData, useParams, data, Meta, Links, Link, ScrollRestoration, Scripts, Outlet } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { pick } from "accept-language-parser";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { createElement, useEffect } from "react";
const config = {
  fallbackLocales: {
    default: "en"
  },
  locales: ["en", "fr"]
};
function getClientLocales(requestOrHeaders) {
  const headers = getHeaders(requestOrHeaders);
  const acceptLanguage = headers.get("Accept-Language");
  if (!acceptLanguage) return void 0;
  const locales = parseAcceptLanguage(acceptLanguage, {
    validate: Intl.DateTimeFormat.supportedLocalesOf,
    ignoreWildcard: true
  });
  if (locales.length === 0) return void 0;
  if (locales.length === 1) return locales[0];
  return locales;
}
function getHeaders(requestOrHeaders) {
  if (requestOrHeaders instanceof Request) {
    return requestOrHeaders.headers;
  }
  return requestOrHeaders;
}
class LanguageDetector {
  // Renamed from LanguageDetector
  // Store options directly
  constructor(options) {
    this.options = options;
    this.isSessionOnly(options);
    this.isCookieOnly(options);
  }
  // Validation methods remain the same
  isSessionOnly(options) {
    var _a2;
    if (((_a2 = options.order) == null ? void 0 : _a2.length) === 1 && options.order[0] === "session" && !options.sessionStorage) {
      throw new Error("You need a sessionStorage if you want to only get the locale from the session");
    }
  }
  isCookieOnly(options) {
    var _a2;
    if (((_a2 = options.order) == null ? void 0 : _a2.length) === 1 && options.order[0] === "cookie" && !options.cookie) {
      throw new Error("You need a cookie if you want to only get the locale from the cookie");
    }
  }
  /**
   * Detect the current locale by following the order defined in the
   * `options.order`.
   * By default the order is
   * - searchParams
   * - cookie
   * - session
   * - header
   * And finally the fallback language.
   */
  async getLocale(request) {
    const order = this.options.order ?? ["searchParams", "cookie", "session", "header"];
    for (const method of order) {
      let locale = null;
      if (method === "searchParams") {
        locale = this.fromSearchParams(request);
      }
      if (method === "cookie") {
        locale = await this.fromCookie(request);
      }
      if (method === "session") {
        locale = await this.fromSessionStorage(request);
      }
      if (method === "header") {
        locale = this.fromHeader(request);
      }
      if (locale) return locale;
    }
    return this.options.fallbackLanguage;
  }
  // Helper methods remain exactly the same
  fromSearchParams(request) {
    const url = new URL(request.url);
    if (!url.searchParams.has(this.options.searchParamKey ?? "lng")) {
      return null;
    }
    return this.fromSupported(url.searchParams.get(this.options.searchParamKey ?? "lng"));
  }
  async fromCookie(request) {
    if (!this.options.cookie) return null;
    const cookie = this.options.cookie;
    const lng = await cookie.parse(request.headers.get("Cookie"));
    if (typeof lng !== "string" || !lng) return null;
    return this.fromSupported(lng);
  }
  async fromSessionStorage(request) {
    if (!this.options.sessionStorage) return null;
    const session = await this.options.sessionStorage.getSession(request.headers.get("Cookie"));
    const lng = session.get(this.options.sessionKey ?? "lng");
    if (!lng) return null;
    return this.fromSupported(lng);
  }
  fromHeader(request) {
    const locales = getClientLocales(request);
    if (!locales) {
      return null;
    }
    const localeString = Array.isArray(locales) ? locales.join(",") : locales;
    return this.fromSupported(localeString);
  }
  fromSupported(language) {
    return pick(
      this.options.supportedLanguages,
      language ?? "",
      // Provide empty string if language is null
      {
        loose: false
      }
    ) || pick(
      this.options.supportedLanguages,
      language ?? "",
      // Provide empty string if language is null
      {
        loose: true
      }
    ) || null;
  }
}
const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true
});
const linguiServer = new LanguageDetector({
  supportedLanguages: config.locales,
  fallbackLanguage: !!config.fallbackLocales && ((_a = config.fallbackLocales) == null ? void 0 : _a.default) || "en",
  cookie: localeCookie
  // Add other options like 'order', 'sessionStorage', 'searchParamKey' here if needed
});
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : ""))));
  });
};
function getLanguages() {
  return [{
    key: "en",
    label: (
      /*i18n*/
      {
        id: "lYGfRP"
      }
    )
  }, {
    key: "fr",
    label: (
      /*i18n*/
      {
        id: "nLC6tu"
      }
    )
  }];
}
async function loadCatalog(locale) {
  const {
    messages
  } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../../locales/en.po": () => import("./assets/en-kcN9I8S7.js"), "../../locales/fr.po": () => import("./assets/fr-DTWzH42o.js") }), `../../locales/${locale}.po`, 4);
  return i18n.loadAndActivate({
    locale,
    messages
  });
}
function useLocale(localeKey = "locale") {
  const [rootMatch] = useMatches();
  const {
    [localeKey]: locale
  } = rootMatch.data ?? {};
  if (!locale) throw new Error("Missing locale returned by the root loader.");
  if (typeof locale === "string") return locale;
  throw new Error("Invalid locale returned by the root loader.");
}
function useOptimisticLocale() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find((f) => f.formAction === "/");
  if (themeFetcher == null ? void 0 : themeFetcher.formData) {
    const submission = Object.fromEntries(themeFetcher.formData);
    if (submission.status === "success" && typeof submission.value === "object" && "locale" in submission.value) {
      return submission.value.locale;
    }
  }
}
function LocaleSelector(props) {
  const languages = getLanguages();
  const {
    setLocale
  } = useLocaleSelector();
  return /* @__PURE__ */ jsx("select", { "aria-label": i18n._("Switch language"), onChange: (e) => setLocale(e.currentTarget.value), defaultValue: i18n.locale, ...props, children: languages.map((language) => /* @__PURE__ */ jsx("option", { value: language.key, children: /* @__PURE__ */ jsx(Trans, { id: language.label.id }) }, language.key)) });
}
function useLocaleSelector() {
  const data2 = useRouteLoaderData("root");
  const fetcher = useFetcher();
  const optimisticLocale = useOptimisticLocale();
  const locale = optimisticLocale ?? (data2 == null ? void 0 : data2.locale) ?? "en";
  const setLocale = (locale2) => {
    fetcher.submit({
      locale: locale2
    }, {
      method: "POST",
      action: "/"
    });
  };
  return {
    locale,
    setLocale
  };
}
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, reactRouterContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext) : handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext);
}
async function handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  const locale = await linguiServer.getLocale(request);
  await loadCatalog(locale);
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const {
      pipe,
      abort
    } = renderToPipeableStream(/* @__PURE__ */ jsx(I18nProvider, { i18n, children: /* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }) }), {
      onAllReady() {
        shellRendered = true;
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(new Response(stream, {
          headers: responseHeaders,
          status: responseStatusCode
        }));
        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    });
    setTimeout(abort, streamTimeout + 1e3);
  });
}
async function handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  const locale = await linguiServer.getLocale(request);
  await loadCatalog(locale);
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const {
      pipe,
      abort
    } = renderToPipeableStream(/* @__PURE__ */ jsx(I18nProvider, { i18n, children: /* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }) }), {
      onShellReady() {
        shellRendered = true;
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(new Response(stream, {
          headers: responseHeaders,
          status: responseStatusCode
        }));
        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    });
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function isObject(value) {
  return typeof value === "object" && value != null && !Array.isArray(value);
}
var isObjectOrArray = (obj) => typeof obj === "object" && obj !== null;
var isBaseCondition = (v) => v === "base";
function filterBaseConditions(c) {
  return c.slice().filter((v) => !isBaseCondition(v));
}
var importantRegex = /\s*!(important)?/i;
function isImportant(value) {
  return typeof value === "string" ? importantRegex.test(value) : false;
}
function withoutImportant(value) {
  return typeof value === "string" ? value.replace(importantRegex, "").trim() : value;
}
function withoutSpace(str) {
  return typeof str === "string" ? str.replaceAll(" ", "_") : str;
}
var memo = (fn2) => {
  const cache = /* @__PURE__ */ new Map();
  const get = (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn2(...args);
    cache.set(key, result);
    return result;
  };
  return get;
};
function mergeProps(...sources) {
  return sources.reduce((prev, obj) => {
    if (!obj)
      return prev;
    Object.keys(obj).forEach((key) => {
      const prevValue = prev[key];
      const value = obj[key];
      if (isObject(prevValue) && isObject(value)) {
        prev[key] = mergeProps(prevValue, value);
      } else {
        prev[key] = value;
      }
    });
    return prev;
  }, {});
}
var isNotNullish = (element) => element != null;
function walkObject(target, predicate, options = {}) {
  const { stop, getKey } = options;
  function inner(value, path = []) {
    if (isObjectOrArray(value)) {
      const result = {};
      for (const [prop, child] of Object.entries(value)) {
        const key = (getKey == null ? void 0 : getKey(prop, child)) ?? prop;
        const childPath = [...path, key];
        if (stop == null ? void 0 : stop(value, childPath)) {
          return predicate(value, path);
        }
        const next = inner(child, childPath);
        if (isNotNullish(next)) {
          result[key] = next;
        }
      }
      return result;
    }
    return predicate(value, path);
  }
  return inner(target);
}
function toResponsiveObject(values, breakpoints) {
  return values.reduce(
    (acc, current, index) => {
      const key = breakpoints[index];
      if (current != null) {
        acc[key] = current;
      }
      return acc;
    },
    {}
  );
}
function normalizeStyleObject(styles, context2, shorthand = true) {
  const { utility, conditions } = context2;
  const { hasShorthand, resolveShorthand } = utility;
  return walkObject(
    styles,
    (value) => {
      return Array.isArray(value) ? toResponsiveObject(value, conditions.breakpoints.keys) : value;
    },
    {
      stop: (value) => Array.isArray(value),
      getKey: shorthand ? (prop) => hasShorthand ? resolveShorthand(prop) : prop : void 0
    }
  );
}
var fallbackCondition = {
  shift: (v) => v,
  finalize: (v) => v,
  breakpoints: { keys: [] }
};
var sanitize = (value) => typeof value === "string" ? value.replaceAll(/[\n\s]+/g, " ") : value;
function createCss(context2) {
  const { utility, conditions: conds = fallbackCondition } = context2;
  const formatClassName = (str) => [utility.prefix, str].filter(Boolean).join("-");
  const hashFn = (conditions, className) => {
    let result;
    {
      const baseArray = [...conds.finalize(conditions), formatClassName(className)];
      result = baseArray.join(":");
    }
    return result;
  };
  return memo(({ base, ...styles } = {}) => {
    const styleObject = Object.assign(styles, base);
    const normalizedObject = normalizeStyleObject(styleObject, context2);
    const classNames = /* @__PURE__ */ new Set();
    walkObject(normalizedObject, (value, paths) => {
      if (value == null)
        return;
      const important = isImportant(value);
      const [prop, ...allConditions] = conds.shift(paths);
      const conditions = filterBaseConditions(allConditions);
      const transformed = utility.transform(prop, withoutImportant(sanitize(value)));
      let className = hashFn(conditions, transformed.className);
      if (important)
        className = `${className}!`;
      classNames.add(className);
    });
    return Array.from(classNames).join(" ");
  });
}
var lengthUnits = "cm,mm,Q,in,pc,pt,px,em,ex,ch,rem,lh,rlh,vw,vh,vmin,vmax,vb,vi,svw,svh,lvw,lvh,dvw,dvh,cqw,cqh,cqi,cqb,cqmin,cqmax,%";
`(?:${lengthUnits.split(",").join("|")})`;
var newRule = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
var ruleClean = /\/\*[^]*?\*\/|  +/g;
var ruleNewline = /\n+/g;
var empty = " ";
var astish = (val, tree = [{}]) => {
  if (!val)
    return tree[0];
  let block, left;
  while (block = newRule.exec(val.replace(ruleClean, ""))) {
    if (block[4])
      tree.shift();
    else if (block[3]) {
      left = block[3].replace(ruleNewline, empty).trim();
      if (!left.includes("&") && !left.startsWith("@"))
        left = "& " + left;
      tree.unshift(tree[0][left] = tree[0][left] || {});
    } else
      tree[0][block[1]] = block[2].replace(ruleNewline, empty).trim();
  }
  return tree[0];
};
const isCondition = (val) => condRegex.test(val);
const condRegex = /^@|&|&$/;
const selectorRegex = /&|@/;
const finalizeConditions = (paths) => {
  return paths.map((path) => selectorRegex.test(path) ? `[${withoutSpace(path.trim())}]` : path);
};
function sortConditions(paths) {
  return paths.sort((a, b) => {
    const aa = isCondition(a);
    const bb = isCondition(b);
    if (aa && !bb) return 1;
    if (!aa && bb) return -1;
    return 0;
  });
}
function transform(prop, value) {
  const className = `${prop}_${withoutSpace(value)}`;
  return { className };
}
const context = {
  conditions: {
    shift: sortConditions,
    finalize: finalizeConditions,
    breakpoints: { keys: [] }
  },
  utility: {
    prefix: void 0,
    transform,
    hasShorthand: false,
    toHash: (path, hashFn) => hashFn(path.join(":")),
    resolveShorthand(prop) {
      return prop;
    }
  }
};
const cssFn = createCss(context);
const fn = (style) => isObject(style) ? style : astish(style[0]);
const css = (...styles) => cssFn(mergeProps(...styles.filter(Boolean).map(fn)));
css.raw = (...styles) => mergeProps(...styles.filter(Boolean).map(fn));
const logo = "/assets/rcmp-crest-black-D-K9fIl9.svg";
function Header() {
  const headerClass = css`
  padding: 1em;
  display: flex;
  justify-content: space-between;
`;
  const logoSectionClass = css`
  display: flex;
  align-items: end;
  line-height: 1em;
`;
  return /* @__PURE__ */ jsxs("header", { className: headerClass, children: [
    /* @__PURE__ */ jsx("section", { className: css`width: 15em;`, children: /* @__PURE__ */ jsxs("div", { className: logoSectionClass, children: [
      /* @__PURE__ */ jsx("img", { alt: i18n._(
        /*i18n*/
        {
          id: "8YYZco"
        }
      ), src: logo, className: css`float: left; padding: 0 1em;`, width: "90px", height: "66.86px" }),
      /* @__PURE__ */ jsx(Trans, { id: "Y/bg5x", components: {
        0: /* @__PURE__ */ jsx("br", {})
      } })
    ] }) }),
    /* @__PURE__ */ jsx(LocaleSelector, {})
  ] });
}
function Flag(props) {
  return /* @__PURE__ */ jsx("path", { ...props, d: "m 137.9,1.2 h 5.2 v 10.4 h -5.2 z m -9,5.2 -0.3,0.1 c 0,0 1.8,1.5 1.8,1.6 0.1,0.1 0.2,0.1 0.1,0.4 -0.1,0.3 -0.2,0.6 -0.2,0.6 0,0 1.6,-0.3 1.8,-0.4 0.2,0 0.3,0 0.3,0.2 0,0.2 -0.1,1.9 -0.1,1.9 h 0.5 c 0,0 -0.1,-1.8 -0.1,-1.9 0,-0.2 0.1,-0.2 0.3,-0.2 0.2,0 1.8,0.4 1.8,0.4 0,0 -0.1,-0.4 -0.2,-0.6 -0.1,-0.3 0,-0.3 0.1,-0.4 0.1,-0.1 1.8,-1.6 1.8,-1.6 L 136.2,6.4 C 136,6.3 136.1,6.2 136.1,6.1 136.1,6 136.4,5 136.4,5 c 0,0 -0.8,0.2 -0.9,0.2 -0.1,0 -0.2,0 -0.2,-0.1 0,-0.1 -0.2,-0.5 -0.2,-0.5 0,0 -0.9,1 -1,1.1 -0.2,0.2 -0.4,0 -0.3,-0.2 0,-0.2 0.5,-2.3 0.5,-2.3 0,0 -0.5,0.3 -0.7,0.4 -0.2,0.1 -0.3,0.1 -0.3,-0.1 -0.1,-0.2 -0.7,-1.3 -0.7,-1.4 0,0 -0.6,1.2 -0.7,1.4 -0.1,0.2 -0.2,0.2 -0.3,0.1 -0.2,-0.1 -0.7,-0.4 -0.7,-0.4 0,0 0.5,2.1 0.5,2.3 0,0.2 -0.1,0.3 -0.3,0.2 l -1,-1.1 c 0,0 -0.1,0.3 -0.2,0.4 0,0.1 -0.1,0.2 -0.2,0.1 -0.2,0 -1,-0.2 -1,-0.2 0,0 0.3,1 0.4,1.1 0,0.1 0,0.3 -0.2,0.4 z m -6.7,-5.2 h 5.2 v 10.4 h -5.2 z" });
}
function Text(props) {
  return /* @__PURE__ */ jsx("path", { ...props, d: "m 144.2,32.4 c -0.4,0.9 -1.2,1.2 -1.7,1.2 -0.6,0 -2.4,-0.1 -2.4,-4.8 0,0 0,-9.5 0,-10.1 0,-3.1 -2.4,-5.6 -8.6,-5.6 -6.7,0 -6.8,3.3 -6.8,4.1 -0.1,0.9 0.4,1.9 2.1,1.9 1.5,0 1.9,-1.7 2.1,-2.3 0.2,-0.7 0.3,-2.7 3,-2.7 2.3,0 3.7,2 3.8,4.9 0,0.5 0,0.8 0,1.1 0,0.2 0,0.3 0,0.5 v 0 0 0.1 c -0.2,1 -0.7,1.5 -1.6,1.9 -1.2,0.6 -4.7,1.1 -5.1,1.2 -1.4,0.3 -5.3,1.3 -5.2,5.4 0.1,4 4.1,5.4 6.9,5.3 2.7,-0.1 4.3,-1.2 5,-1.8 0.4,-0.3 0.4,-0.3 0.7,0.1 0.4,0.4 1.7,1.7 4.8,1.7 3.2,0 3.6,-1.5 3.8,-2 0.1,-0.3 -0.6,-0.6 -0.8,-0.1 z m -12.5,1.1 c -2.8,0 -3.5,-2.3 -3.5,-3.5 0,-1.1 0.6,-3.4 3.4,-5 0,0 1.3,-0.8 3.8,-1.8 0.1,0 0.2,0 0.2,0 0,0 0.1,0.1 0.1,0.2 v 0 0 0.1 0 0 0.1 0 0 0 4.2 c 0,3.3 -1.6,5.7 -4,5.7 z m -9.2,-0.1 c -0.4,-0.1 -2.9,0.2 -2.9,-7.4 0,-7.6 0,-23.9 0,-23.9 0,-0.3 0,-1.1 -0.9,-1.1 -0.9,0 -6.9,0.3 -7.3,0.4 -0.4,0 -0.7,0.5 0,0.5 0.7,0.1 3.9,0.3 3.9,5.6 0,2.6 0,5.2 0,7.1 0,0.1 0,0.2 0,0.2 0,0.2 0,0.3 -0.1,0.4 0,0 0,0 0,0.1 v 0 c -0.1,0.1 -0.2,0 -0.5,-0.2 -0.5,-0.4 -2.8,-1.8 -5.7,-1.8 -4.7,0 -10.5,3.4 -10.5,10.4 0,7.5 5.3,11.1 10.8,11.1 2.7,0 4.6,-1.2 5.3,-1.6 0.8,-0.5 0.7,-0.4 0.8,0.3 0.1,0.5 0,1.5 1.4,1.4 1.5,-0.2 5.1,-0.6 5.8,-0.7 0.7,-0.3 0.5,-0.7 -0.1,-0.8 z m -12.4,0.3 c -4.4,0 -6.7,-5.2 -6.7,-10.2 0,-5.5 3.1,-9.2 6.4,-9 4.3,0.3 5.4,3.7 5.5,9.8 0,0.4 0,0.8 0,1.3 -0.1,6 -2.6,8.1 -5.2,8.1 z M 98.4,32.4 c -0.4,0.9 -1.2,1.2 -1.7,1.2 -0.6,0 -2.4,-0.1 -2.4,-4.8 0,0 0,-9.5 0,-10.1 0,-3.1 -2.4,-5.6 -8.6,-5.6 -6.7,0 -6.8,3.3 -6.8,4.1 -0.1,0.9 0.4,1.9 2.1,1.9 1.5,0 1.9,-1.7 2.1,-2.3 0.2,-0.7 0.3,-2.7 3,-2.7 2.3,0 3.8,2 3.8,5 v 0.1 c 0,0.1 0,0.2 0,0.2 v 0.3 c 0,0.1 0,0.3 0,0.4 -0.1,1.5 -0.5,2 -1.7,2.6 -1.2,0.6 -4.7,1.1 -5.1,1.2 -1.4,0.3 -5.3,1.3 -5.2,5.4 0.1,4 4.1,5.4 6.9,5.3 2.7,-0.1 4.3,-1.2 5,-1.8 0.4,-0.3 0.4,-0.3 0.7,0.1 0.4,0.4 1.7,1.7 4.8,1.7 3.2,0 3.6,-1.5 3.8,-2 0.2,-0.4 -0.4,-0.7 -0.7,-0.2 z M 86,33.5 c -2.8,0 -3.5,-2.3 -3.5,-3.5 0,-1.1 0.6,-3.4 3.4,-5 0,0 1.3,-0.8 3.8,-1.8 0.1,0 0.2,0 0.2,0 v 0.1 0 0 c 0,0.1 0,0.2 0,0.4 v -0.1 c 0,0 0,0 0,0.1 v 4.2 c 0,3.2 -1.6,5.6 -3.9,5.6 z m -9.6,-0.1 c -0.8,-0.2 -2.2,-1.1 -2.2,-5.5 v -8 c 0,-1.9 0.2,-6.8 -7.3,-6.8 -3.9,0 -6.1,2 -6.3,2.1 -0.3,0.3 -0.5,0.4 -0.6,-0.1 -0.1,-0.4 -0.3,-1 -0.4,-1.4 -0.1,-0.3 -0.3,-0.6 -1,-0.5 -0.7,0.1 -5.1,0.8 -5.9,1 -0.7,0.2 -0.5,0.5 0,0.6 0.5,0.1 2.9,0.3 2.9,4.4 0,4.1 0,8.6 0,8.6 0,5 -1,5.4 -1.9,5.7 -1.2,0.3 -0.6,0.7 -0.1,0.7 0,0 8.9,0 9.1,0 0.6,0 0.9,-0.6 -0.3,-0.8 -1.2,-0.2 -2.3,-0.9 -2.3,-4.8 0,-0.4 0,-4.7 0,-5.5 0,-2.1 -0.5,-8.5 5.3,-8.6 4.1,-0.1 4.5,3.3 4.5,5.5 v 8.5 c 0,3.5 -1,4.6 -2.2,4.8 -1.1,0.2 -0.9,0.7 -0.3,0.7 0.2,0 9.3,0 9.3,0 0.5,0.2 1,-0.3 -0.3,-0.6 z m -24.3,-1 c -0.4,0.9 -1.2,1.2 -1.7,1.2 -0.6,0 -2.4,-0.1 -2.4,-4.8 0,0 0,-9.5 0,-10.1 0,-3.1 -2.4,-5.6 -8.6,-5.6 -6.7,0 -6.8,3.3 -6.8,4.1 -0.1,0.9 0.4,1.9 2.1,1.9 1.5,0 1.9,-1.7 2.1,-2.3 0.2,-0.7 0.3,-2.7 3,-2.7 2.3,0 3.7,2 3.8,4.9 0,0.5 0,0.8 0,1.1 0,0.2 0,0.4 -0.1,0.5 v 0.1 0 c -0.2,1 -0.7,1.5 -1.6,1.9 -1.2,0.6 -4.7,1.1 -5.1,1.2 -1.4,0.3 -5.3,1.3 -5.2,5.4 0.1,4 4.1,5.4 6.9,5.3 2.7,-0.1 4.3,-1.2 5,-1.8 0.4,-0.3 0.4,-0.3 0.7,0.1 0.4,0.4 1.7,1.7 4.8,1.7 3.2,0 3.6,-1.5 3.8,-2 0.2,-0.3 -0.5,-0.6 -0.7,-0.1 z m -12.5,1.1 c -2.8,0 -3.5,-2.3 -3.5,-3.5 0,-1.2 0.6,-3.4 3.4,-5 0,0 1.3,-0.8 3.8,-1.8 0.1,0 0.2,0 0.2,0 0,0 0.1,0.1 0.1,0.2 v 0 0 0 c 0,0 0,0.1 0,0.2 v 0 0 0.1 0 0 0 4.2 c 0,3.2 -1.6,5.6 -4,5.6 z M 30,24.8 C 29,28 27.1,33.2 20.2,33.4 13,33.5 8.7,28.6 8.5,19.5 8.2,9.8 12.4,2.4 18.9,2.2 c 7.3,-0.1 9.9,8.6 10,9.9 0.1,1 1.4,0.9 1.4,-0.1 0,-0.5 -0.6,-9.1 -0.8,-10.1 -0.2,-1 -1,-0.6 -1.2,-0.2 C 28.2,2 28.4,1.4 28,2.3 27.6,3.2 26.5,2.7 26.1,2.6 24.9,2.1 22.6,0.9 18.9,1 10.4,1.2 1.7,7.5 1.9,18.5 2.1,29.2 10.7,35.2 18.7,35.1 26,35 30.1,30.4 31.3,25.1 31.7,23.8 30.4,23.5 30,24.8 Z" });
}
const SVG = ({
  children,
  ...rest
}) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: we're exposing this so people can add aria-labels to it.
    /* @__PURE__ */ jsx("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 143 35", preserveAspectRatio: "xMinYMin meet", ...rest, children: /* @__PURE__ */ jsx("g", { children }) })
  );
};
const Wordmark = {
  SVG,
  Flag,
  Text
};
function Footer() {
  const footerClass = css`
  padding: 2em;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  background-color: #f1f2f3;
  border-top: 1px solid rgb(51, 51, 51);
`;
  const canadaRed = css`fill: #EA2D37;`;
  return /* @__PURE__ */ jsxs("footer", { className: footerClass, children: [
    /* @__PURE__ */ jsx(Trans, { id: "Z3jxtm" }),
    /* @__PURE__ */ jsxs(Wordmark.SVG, { "aria-label": i18n._(
      /*i18n*/
      {
        id: "eyFYak"
      }
    ), role: "img", width: "10em", children: [
      /* @__PURE__ */ jsx(Wordmark.Flag, { className: canadaRed }),
      /* @__PURE__ */ jsx(Wordmark.Text, {})
    ] })
  ] });
}
const favicon = "/assets/favicon-ByktVmfW.ico";
const font = "/assets/OverusedGrotesk-VF-B-04Lpzv.woff2";
const stylesheet = "/assets/app-BT1k21Or.css";
const links = () => [
  // ...
  {
    rel: "icon",
    href: favicon,
    type: "image/x-icon"
  },
  {
    rel: "stylesheet",
    href: stylesheet,
    crossOrigin: "true"
  },
  {
    rel: "preload",
    as: "font",
    href: font,
    type: "font/woff2",
    crossOrigin: "true"
  }
];
async function action({
  request
}) {
  const formData = await request.formData();
  const locale = formData.get("locale") ?? "en";
  console.log({
    location: "root.tsx action",
    formData
  });
  return data({
    locale
  }, {
    headers: {
      "Set-Cookie": await localeCookie.serialize(locale)
    }
  });
}
async function loader$2({
  request
}) {
  const locale = await linguiServer.getLocale(request);
  console.log({
    location: "root.tsx loader",
    locale
  });
  return data({
    locale
  }, {
    headers: {
      "Set-Cookie": await localeCookie.serialize(locale)
    }
  });
}
const mainClass = css`
  width: 80%;
  height: 100%;
  margin: auto auto;
`;
const linkClass = css`
	padding: 0 1em;
`;
const navClass = css`
  background-color: #f1f2f3;
	border-top: 2em solid #b50315;
	border-bottom: 4px solid rgb(130, 55, 62)
`;
function Layout({
  children
}) {
  const locale = useLocale();
  useEffect(() => {
    if (i18n.locale !== locale) {
      loadCatalog(locale);
    }
  }, [locale]);
  return /* @__PURE__ */ jsxs("html", {
    lang: locale ?? "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("nav", {
        className: navClass,
        children: [/* @__PURE__ */ jsx(Link, {
          className: linkClass,
          to: "/",
          children: /* @__PURE__ */ jsx(Trans, {
            id: "i0qMbr"
          })
        }), /* @__PURE__ */ jsx(Link, {
          className: linkClass,
          to: i18n._("/terms-and-conditions"),
          children: /* @__PURE__ */ jsx(Trans, {
            id: "mBCf+y"
          })
        })]
      }), /* @__PURE__ */ jsx("main", {
        className: mainClass,
        children
      }), /* @__PURE__ */ jsx(Footer, {}), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  action,
  default: root,
  links,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = ({
  data: data2
}) => {
  return [{
    title: (data2 == null ? void 0 : data2.title) ?? i18n._(
      /*i18n*/
      {
        id: "cYOele"
      }
    )
  }, {
    name: "description",
    content: i18n._(
      /*i18n*/
      {
        id: "VliEgV"
      }
    )
  }];
};
function loader$1() {
  return data({
    title: i18n._(
      /*i18n*/
      {
        id: "A78Zs0"
      }
    )
  });
}
const home = withComponentProps(function Index() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("h1", {
      children: /* @__PURE__ */ jsx(Trans, {
        id: "FHcLxM"
      })
    }), /* @__PURE__ */ jsxs("ul", {
      children: [/* @__PURE__ */ jsx("li", {
        children: /* @__PURE__ */ jsx("a", {
          target: "_blank",
          href: "https://remix.run/tutorials/blog",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx(Trans, {
            id: "SKzEor"
          })
        })
      }), /* @__PURE__ */ jsx("li", {
        children: /* @__PURE__ */ jsx("a", {
          target: "_blank",
          href: "https://remix.run/docs",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx(Trans, {
            id: "CDtsbp"
          })
        })
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const meta = ({
  data: data2
}) => {
  return [{
    title: (data2 == null ? void 0 : data2.title) ?? i18n._(
      /*i18n*/
      {
        id: "cYOele"
      }
    )
  }, {
    name: "description",
    content: i18n._(
      /*i18n*/
      {
        id: "VliEgV"
      }
    )
  }];
};
function loader() {
  return data({
    title: i18n._(
      /*i18n*/
      {
        id: "A78Zs0"
      }
    )
  });
}
const termsAndConditions = withComponentProps(function Index2() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("h1", {
      children: /* @__PURE__ */ jsx(Trans, {
        id: "mvP/25"
      })
    }), /* @__PURE__ */ jsx("article", {
      children: /* @__PURE__ */ jsx(Trans, {
        id: "tEOA12"
      })
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: termsAndConditions,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B8Gsvbh_.js", "imports": ["/assets/chunk-KNED5TY2-DlGhbW8p.js", "/assets/lingui-BpRdFDe6.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-DbJZxjnx.js", "imports": ["/assets/chunk-KNED5TY2-DlGhbW8p.js", "/assets/lingui-BpRdFDe6.js", "/assets/with-props-DkHcVUw6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DYHw5ovu.js", "imports": ["/assets/with-props-DkHcVUw6.js", "/assets/chunk-KNED5TY2-DlGhbW8p.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "toc-en": { "id": "toc-en", "parentId": "root", "path": "/terms-and-conditions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/termsAndConditions-NkWUJgNa.js", "imports": ["/assets/with-props-DkHcVUw6.js", "/assets/chunk-KNED5TY2-DlGhbW8p.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "toc-fr": { "id": "toc-fr", "parentId": "root", "path": "/avis", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/termsAndConditions-NkWUJgNa.js", "imports": ["/assets/with-props-DkHcVUw6.js", "/assets/chunk-KNED5TY2-DlGhbW8p.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-d3455928.js", "version": "d3455928", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "toc-en": {
    id: "toc-en",
    parentId: "root",
    path: "/terms-and-conditions",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "toc-fr": {
    id: "toc-fr",
    parentId: "root",
    path: "/avis",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
