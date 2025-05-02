import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { Form as RRForm, redirect } from "react-router";
import { css } from "../../styled-system/css";
import { sql } from "../db";
import type { LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/drugSeizures";
import { Form } from "radix-ui";

export async function loader() {
	// TODO: think about pagination
	return sql`
		SELECT * FROM seizures;
	`;
}

export async function action({ request }: LoaderFunctionArgs) {
	const formData = await request.formData();

	const { substance, amount, reported_on, seized_on } =
		Object.fromEntries(formData);

	// TODO: add some error handling here.
	const results = await sql`
    INSERT INTO seizures (substance, amount, reported_on, seized_on)
      VALUES (${substance}, ${amount}, ${reported_on}, ${seized_on}) RETURNING *;
	`;
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
	
  `;

	const inputClass = css`
		width: 100%;
	  display: inline-flex;
	  align-items: center;
	  justify-content: center;
	  border-radius: 4px;
	  font-size: 15px;
	  color: token(colors.black);
	  padding: 0.5em 1em;
	  background-color: token(colors.white);
	  box-shadow: 0 0 0 1px token(colors.gray);

	  &:focus {
	    box-shadow: 0 0 0 2px black;
	  }
  `;

	const labelClass = css`
		font-size: 1em;
	font-weight: 500;
	line-height: 35px;
	color: token(colors.black);
		`;

	const buttonClass = css`
	  margin-top: 2em;
	  display: inline-flex;
	  align-items: center;
	  justify-content: center;
	  border-radius: 4px;
	  padding: 0 15px;
	  font-size: 15px;
	  line-height: 1;
	  font-weight: 500;
	  height: 35px;
	  width: 100%;
	  background-color: token(colors.gray);
	  color: token(colors.white);
	  box-shadow: 0 2px 5px token(colors.gray);
	`;

	const FormField = css`
		display: grid;
	  margin-bottom: 10px;
	`;

	const FormMessage = css`
	font-size: 13px;
	color: token(colors.black);
	opacity: 0.8;
  `;

	return (
		<>
			<h2>
				<Trans>Drug Seizures Form</Trans>
			</h2>
			<Form.Root asChild className={css`width: 100%;`}>
				<RRForm className={formClass} method="post">
					<Form.Field name="substance" className={FormField}>
						<Form.Label className={labelClass}>
							<Trans>Substance</Trans>
						</Form.Label>
						<Form.Message className={FormMessage} match="valueMissing">
							<Trans>Enter the (suspected) type of substance</Trans>
						</Form.Message>
						<Form.Message className="FormMessage" match="typeMismatch">
							<Trans>
								Please enter text with the assumed type of the substance
							</Trans>
						</Form.Message>
						<Form.Control asChild className={inputClass}>
							<input id="substance" name="substance" type="text" />
						</Form.Control>
					</Form.Field>

					<Form.Field name="amount" className={FormField}>
						<Form.Label className={labelClass}>
							<Trans>Amount (grams)</Trans>
						</Form.Label>
						<Form.Message className={FormMessage} match="valueMissing">
							<Trans>Enter a numerical amount in grams</Trans>
						</Form.Message>
						<Form.Message className="FormMessage" match="typeMismatch">
							<Trans>Please enter an number</Trans>
						</Form.Message>
						<Form.Control asChild className={inputClass}>
							<input
								className={inputClass}
								id="amount"
								name="amount"
								type="number"
							/>
						</Form.Control>
					</Form.Field>

					<Form.Field name="seized_on" className={FormField}>
						<Form.Label className={labelClass}>
							<Trans>Seizure Date</Trans>
						</Form.Label>
						<Form.Message className={FormMessage} match="valueMissing">
							<Trans>
								Enter the date the seizure of the substance took place
							</Trans>
						</Form.Message>
						<Form.Message className="FormMessage" match="typeMismatch">
							<Trans>Must be a date</Trans>
						</Form.Message>
						<Form.Control asChild className={inputClass}>
							<input
								className={inputClass}
								id="seizureDate"
								name="seized_on"
								type="date"
								defaultValue={today()} // default the defaultValue to today
							/>
						</Form.Control>
					</Form.Field>

					<Form.Field name="reported_on" className={FormField}>
						<Form.Label className={labelClass}>
							<Trans>Reporting Date</Trans>
						</Form.Label>
						<Form.Message className={FormMessage} match="valueMissing">
							<Trans>Enter the date the seizure was reported.</Trans>
						</Form.Message>
						<Form.Message className="FormMessage" match="typeMismatch">
							<Trans>Must be a date</Trans>
						</Form.Message>
						<Form.Control asChild className={inputClass}>
							<input
								className={inputClass}
								id="reportingDate"
								name="reported_on"
								type="date"
								defaultValue={today()} // default the defaultValue to today
							/>
						</Form.Control>
					</Form.Field>

					<Form.Submit asChild>
						<button type="submit" className={buttonClass}>
							<Trans>Submit Seizure</Trans>
						</button>
					</Form.Submit>
				</RRForm>
			</Form.Root>
		</>
	);
}
