import { Trans } from "@lingui/react/macro";
import { Link } from "react-router";
import { db, save } from "../db";

export async function loader({ request }) {
	return db;
}

export default function DrugSeizureSummary({
	loaderData,
	actionData,
	params,
	matches,
}) {
	// TODO: make this some sort of data viz
	return (
		<>
			<ul>
				{loaderData.map((d) => (
					<li key={d.id}>
						<h4>
							<Trans>Substance</Trans>: {d.substance}
						</h4>
						<p>
							{d.amount} <Trans>grams</Trans>
						</p>
						<p>
							<Trans>Date</Trans>: {d.date}
						</p>
						<hr />
					</li>
				)) ?? null}
			</ul>
			<Link to="new">add new seizure record</Link>
		</>
	);
}
