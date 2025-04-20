import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/terms-and-conditions", "./routes/termsAndConditions.tsx", {
		id: "terms-en",
	}),
	route("/avis", "./routes/termsAndConditions.tsx", {
		id: "terms-fr",
	}),
	route("/drug-seizures", "./routes/drugSeizures.tsx", {
		id: "drug-seizures-en",
	}),
	route("/saisies-de-drogues", "./routes/drugSeizures.tsx", {
		id: "drug-seizures-fr",
	}),
] satisfies RouteConfig;
