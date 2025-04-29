import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { Form, redirect } from "react-router";
import { css } from "../../styled-system/css";
import { db } from "../db";
import type { LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/drugSeizures";

export async function loader() {
	return db;
}

export async function action({ request }: LoaderFunctionArgs) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	db.push(data);
	// redirect to the url that matches the current langauge
	return redirect(i18n._("/drug-seizures"));
}

function today() {
	return new Date().toISOString().substring(0, 10);
}

export default function DrugSeizureForm({
	loaderData,
	actionData,
	params,
	matches,
}: Route.ComponentProps) {
	const formClass = css`
    display: grid;
    grid-template-rows: auto auto;
  `;

	const inputClass = css`
    border: 1px solid;
  `;

	const labelClass = css`
		text-align: right;
		padding-right: 8px;
		`;

	return (
		<>
			<h2>
				<Trans>Drug Seizures Form</Trans>
			</h2>
			<Form className={formClass} method="post">
				<label htmlFor="substance" className={labelClass}>
					<Trans>Substance</Trans>
				</label>
				<input
					className={inputClass}
					id="substance"
					name="substance"
					type="text"
				/>

				<label htmlFor="amount" className={labelClass}>
					<Trans>Amount (grams)</Trans>
				</label>
				<input className={inputClass} id="amount" name="amount" type="number" />

				<label htmlFor="date" className={labelClass}>
					<Trans>Seizure Date</Trans>
				</label>
				<input
					className={inputClass}
					id="seizureDate"
					name="seized_on"
					type="date"
					defaultValue={today()} // default the defaultValue to today
				/>

				<label htmlFor="date" className={labelClass}>
					<Trans>Reporting Date</Trans>
				</label>
				<input
					className={inputClass}
					id="reportingDate"
					name="reported_on"
					type="date"
					defaultValue={today()} // default the defaultValue to today
				/>

				<button type="submit">
					<Trans>Submit Seizure</Trans>
				</button>
			</Form>
		</>
	);
}
