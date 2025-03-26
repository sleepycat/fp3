import type { RouteConfig } from "@react-router/dev/routes";
import { i18n } from "@lingui/core";
import { index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/terms-and-conditions", "./routes/termsAndConditions.tsx", {
		id: "toc-en",
	}),
	route("/avis", "./routes/termsAndConditions.tsx", { id: "toc-fr" }),
] satisfies RouteConfig;
