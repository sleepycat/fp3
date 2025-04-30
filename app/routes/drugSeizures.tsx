import { t } from "@lingui/core/macro";
import { Trans as TransMacro } from "@lingui/react/macro";
import { Trans as TransComponent } from "@lingui/react";
import { NavLink } from "react-router";
import { css } from "../../styled-system/css";
import type { Route } from "./+types/drugSeizures";
import { sql } from "../db";

// Loaders are extracted by the compiler and included only in the generated
// server bundle.
export async function loader() {
	// TODO: add some error handling here.
	const results = await sql`
		SELECT strftime('%Y',seized_on) AS year, 
       strftime('%m', seized_on) AS month, 
       substance, 
       sum(amount) AS amount
     FROM seizures
     GROUP BY
       strftime('%Y', seized_on), 
       strftime('%m', seized_on), 
       substance;
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
							<TransMacro>Total Amount</TransMacro>: {d.amount}{" "}
							<TransMacro>grams</TransMacro>
						</p>
						<p>
							<TransMacro>Year</TransMacro>: {d.year}
						</p>
						<p>
							<TransMacro>Month</TransMacro>: {d.month}
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
