import { t } from "@lingui/core/macro";
import { Trans as TransMacro } from "@lingui/react/macro";
import { Trans as TransComponent } from "@lingui/react";
import { NavLink } from "react-router";
import { css } from "../../styled-system/css";
import type { Route } from "./+types/drugSeizures";
import { sql } from "../db";

export async function loader() {
	const results = await sql`
		SELECT * FROM seizures;
	`;
	return results;
}

const linkClass = css`
	color: token(colors.navy);
  text-decoration: underline;	
`;

const listClass = css`
	padding-bottom: 1em;
`;

export default function DrugSeizureSummary({
	loaderData,
	actionData,
	params,
	matches,
}: Route.ComponentProps) {
	// TODO: make this some sort of data viz
	return (
		<>
			<ul className={listClass}>
				{loaderData.map((d) => (
					<li key={d.id}>
						<h4>
							<TransMacro>Substance</TransMacro>: {d.substance}
						</h4>
						<p>
							<TransMacro>Amount</TransMacro>: {d.amount}{" "}
							<TransMacro>grams</TransMacro>
						</p>
						<p>
							<TransMacro>Seizure Date</TransMacro>: {d.seized_on}
						</p>
						<p>
							<TransMacro>Reporting Date</TransMacro>: {d.reported_on}
						</p>
						<hr />
					</li>
				)) ?? null}
			</ul>
			<TransComponent
				id="new"
				render={({ translation }) => {
					return (
						<NavLink
							className={linkClass}
							// @ts-expect-error Type 'ReactNode' is not assignable to type 'To'
							to={translation}
						>{t`New seizure record`}</NavLink>
					);
				}}
			/>
		</>
	);
}
