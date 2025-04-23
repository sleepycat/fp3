import { Trans } from "@lingui/react/macro";
import { Form, redirect } from "react-router";
import { css } from "../../styled-system/css";
import { db, save } from "../db";

export async function loader({ request }) {
	return db;
}

export async function action({ request }) {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	db.push(data);
	// XXX: this will need change based on the locale
	return redirect("/drug-seizures");
}

export default function DrugSeizureForm({
	loaderData,
	actionData,
	params,
	matches,
}) {
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
			<h2>Drug Seizures Form</h2>
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
				<input className={inputClass} id="date" name="date" type="date" />

				<button type="submit">Submit Seizure</button>
			</Form>
		</>
	);
}
