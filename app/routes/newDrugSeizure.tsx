import { useState } from "react";
import { z } from "zod";
import type React from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { redirect } from "react-router";
import { css } from "../../styled-system/css";
import { sql } from "../db";
import type { LoaderFunctionArgs } from "react-router";
import { useActionData, useSubmit, data } from "react-router";
import DatePicker from "../DatePicker";
import {
	NumberField,
	Button,
	Group,
	Label,
	FieldError,
	Form,
	Input,
	TextField,
} from "react-aria-components";

type Errors = Record<string, string>;

export async function loader() {
	// TODO: think about pagination
	return sql`
		SELECT * FROM seizures;
	`;
}

export async function action({ request }: LoaderFunctionArgs) {
	// defining this inside the loader since the calls to i18n will only succeed
	// after an incoming request has triggered a call to i18n.activate
	const schema = z.object({
		substance: z.string({
			required_error: i18n._("A substance type required"),
		}),
		amount: z
			.string({
				required_error: i18n._("A non-zero amount is required"),
				invalid_type_error: i18n._(
					"Amount must be a non-zero positive integer",
				),
			})
			.regex(/^\d+$/)
			.transform(Number),
		reported_on: z
			.string({
				required_error: i18n._("A reporting date is required"),
				invalid_type_error: i18n._(
					"Reporting date must be in YYYY-MM-DD format",
				),
			})
			.date(),
		seized_on: z
			.string({
				required_error: i18n._("A seizure date is required"),
				invalid_type_error: i18n._("Seizure date must be in YYYY-MM-DD format"),
			})
			.date(),
	});

	const form = await request.formData();

	const formData = Object.fromEntries(form);
	// @ts-expect-error
	const { success, error }: Errors = schema.safeParse(formData);

	if (!success) {
		// @ts-expect-error
		const errs = error.errors.reduce(
			(acc, err) => ({ ...acc, [err.path]: err.message }),
			{},
		);

		return data({ errors: errs }, { status: 400 });
	}

	// everything is OK! Time to insert.
	// Split out the variables
	const { substance, amount, reported_on, seized_on } = formData;
	// Time to insert:
	try {
		// In other languages this would be a sql injection,
		//  but it's not because of how Tagged Template Literals work.
		const results = await sql`
    INSERT INTO seizures (substance, amount, reported_on, seized_on)
      VALUES (${substance}, ${amount}, ${reported_on}, ${seized_on}) RETURNING *;
	`;
	} catch (e: unknown) {
		let message: string;
		if (e instanceof Error) {
			message = e.message;
			console.log({ catch: true, message });
		}
	}
	return redirect(i18n._("/drug-seizures"));
}

export default function DrugSeizureForm() {
	const submit = useSubmit();
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit(e.currentTarget);
	};

	const actionData = useActionData<typeof action>();

	const fieldErrorClass = css`
  position: relative;
  bottom: -3em;
  right: 8.4em;
  font-size: small;
  color: token(colors.rcmpred);
`;

	return (
		<>
			<h2
				className={css`
					margin: 1em 0em;
				`}
			>
				<Trans>Drug Seizures Form</Trans>
			</h2>

			<Form
				method="post"
				validationErrors={actionData?.errors}
				onSubmit={onSubmit}
			>
				<TextField
					name="substance"
					isRequired
					className={css`
					  display: inline-grid;
					`}
				>
					<Label className={css`margin-right: 2em;`}>
						<Trans>Substance</Trans>
					</Label>
					<Input
						name="substance"
						className={css`
						  padding: 0.5rem;
						  width: 14em;
						  border: 0.125rem solid token(colors.gray);
						  border-radius: token(radii.sm);

              &[data-invalid] {
                border: 2px solid token(colors.rcmpred);
              }
						`}
					/>
					<FieldError
						className={css`
							font-size: 0.8em;
                color: token(colors.rcmpred);
						`}
					/>
				</TextField>

				<DatePicker name="seized_on" label={t`Seizure Date`} />

				<DatePicker name="reported_on" label={t`Reporting Date`} />

				<NumberField name="amount" defaultValue={0} minValue={0}>
					<Label>
						<Trans>Amount in grams</Trans>
					</Label>
					<Group
						className={css`
						width: 14em;
						  border: 0.125rem solid token(colors.gray);
						  border-radius: token(radii.sm);
							width: 14em;
							display: flex;
							padding: 0em 1em;
							height: 2em;
							align-items: anchor-center;
              margin-bottom: 1em;
						`}
					>
						<Input
							className={css`
							width: 10em;

              &[data-invalid] {
                border: 2px solid token(colors.rcmpred);
              }
							`}
						/>
						<FieldError className={fieldErrorClass} />
						<Button
							className={css`
							margin: 0.5em;
							`}
							slot="decrement"
						>
							-
						</Button>
						<Button className={css`margin: 0.5em;`} slot="increment">
							+
						</Button>
					</Group>
				</NumberField>
				<Button
					className={css`
						margin: 2em 0em;
						width: 14em;
						padding: 0.5em 1em;
						border-radius: token(radii.sm);
						color: token(colors.white);
          	background: token(colors.gray);
					`}
					type="submit"
				>
					Submit
				</Button>
			</Form>
		</>
	);
}
