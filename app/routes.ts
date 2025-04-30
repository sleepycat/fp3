import type { RouteConfig } from "@react-router/dev/routes";
import { index, route, prefix } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/terms-and-conditions", "./routes/termsAndConditions.tsx", {
		id: "terms-en",
	}),
	route("/avis", "./routes/termsAndConditions.tsx", {
		id: "terms-fr",
	}),

	/*
Resource oriented routes?
GET	/drug-seizures index:drugSeizures.tsx	display a list/data viz of all seizures
GET	/drug-seizures/new	newDrugSeizure.tsx	return an form for creating a new seizure record
POST	/drug-seizures	create action to create a new seizure record
GET	/drug-seizures/:id	showSeizure.tsx display a specific record
GET	/drug-seizures/:id/edit	edit	return an HTML form for editing a record
PATCH/PUT	/drug-seizures/:id	#update	update a specific record
DELETE	/drug-seizures/:id	#destroy	delete a specific record
*/

	...prefix("drug-seizures", [
		index("./routes/drugSeizures.tsx", {
			id: "drug-seizures-en",
		}),
		route("new", "./routes/newDrugSeizure.tsx", {
			id: "new-seizure-en",
		}),
	]),
	...prefix("saisies-de-drogues", [
		index("./routes/drugSeizures.tsx", {
			id: "drug-seizures-fr",
		}),
		route("nouveau", "./routes/newDrugSeizure.tsx", {
			id: "new-seizure-fr",
		}),
	]),
] satisfies RouteConfig;
