import { t } from "@lingui/core/macro";
import { Trans as TransMacro } from "@lingui/react/macro";
import { Trans as TransComponent } from "@lingui/react";
import { NavLink } from "react-router";
import { db, save } from "../db";
import { css } from "../../styled-system/css";

export async function loader({ request }) {
	return db;
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
}) {
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
							{d.amount} <TransMacro>grams</TransMacro>
						</p>
						<p>
							<TransMacro>Date</TransMacro>: {d.date}
						</p>
						<hr />
					</li>
				)) ?? null}
			</ul>
			{/* @ts-expect-error: Typescript doesn't seem to have correct type info for Trans. */}
			<TransComponent
				id="new"
				render={({ translation }) => {
					// @ts-expect-error Type 'ReactNode' is not assignable to type 'To'
					return (
						<NavLink
							className={linkClass}
							to={translation}
						>{t`New seizure record`}</NavLink>
					);
				}}
			/>
		</>
	);
}
