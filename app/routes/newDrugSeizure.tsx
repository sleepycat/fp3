import { useState } from "react";
import { parseAbsoluteToLocal, parseDate } from "@internationalized/date";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { redirect } from "react-router";
import { css } from "../../styled-system/css";
import { sql } from "../db";
import type { LoaderFunctionArgs } from "react-router";
import { useActionData, useSubmit } from "react-router";
import { today } from "@internationalized/date";
import CalendarIcon from "../CalendarIcon";
import {
	NumberField,
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	DateInput,
	DatePicker,
	DateSegment,
	Dialog,
	Group,
	Heading,
	Label,
	Popover,
	FieldError,
	Form,
	Input,
	TextField,
} from "react-aria-components";

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
	// https://reactrouter.com/how-to/form-validation
	const results = await sql`
    INSERT INTO seizures (substance, amount, reported_on, seized_on)
      VALUES (${substance}, ${amount}, ${reported_on}, ${seized_on}) RETURNING *;
	`;
	return redirect(i18n._("/drug-seizures"));
}

export default function DrugSeizureForm() {
	const submit = useSubmit();
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit(e.currentTarget);
	};

	const actionData = useActionData<typeof action>();

	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const [date, setDate] = useState(
		parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
	);
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
						`}
					/>
					<FieldError />
				</TextField>

				<DatePicker name="seized_on">
					<Label>
						<Trans>Seizure Date</Trans>
					</Label>
					<Group
						className={css`
						width: 14em;
						  border: 0.125rem solid token(colors.gray);
						  border-radius: token(radii.sm);
							width: 14em;
							display: flex;
							justify-content: space-between;

					`}
					>
						<DateInput
							className={css`
							display: inline-block;
						  padding: 0.5rem;
					`}
						>
							{(segment) => <DateSegment segment={segment} />}
						</DateInput>
						<Button className={css`margin: 0em 1em;`}>
							<CalendarIcon />
						</Button>
					</Group>
					<Popover>
						<Dialog>
							<Calendar
								className={css`
									background: token(colors.white);
									text-align: center;
								`}
							>
								<header
									className={css`
										  flex: 1;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      gap: 6px;
                      margin: 0 8px 12px 8px;
									`}
								>
									<Button slot="previous">◀</Button>
									<Heading />
									<Button slot="next">▶</Button>
								</header>
								<CalendarGrid
									className={css`
									background: token(colors.white);
								`}
								>
									{(date) => (
										<CalendarCell
											className={css`
												  cursor: default;
                          width: 2em;
                          height: 2em;
                          width: 14em;
                          margin: 2px;
						              border-radius: token(radii.sm);
                          position: relative;
                          outline: none;
                          color: token(colors.black);
                          border: 2px solid token(colors.white);
                          line-height: 1.8em;

                          &:hover {
  	                        background: #eee;
                          }

                          &[data-pressed] {
  	                        background: token(colors.rcmpred);
                          }

                          &[data-selected]{
  	                        background: token(colors.rcmpred);
                            color: token(colors.white);
                          }

                          &[data-focused]{
                            box-sizing: border-box;
                          	border: 2px solid token(colors.rcmpred);
                          }

                          &[data-disabled]{
                          	background: token(colors.lightgray);
                          }
											`}
											date={date}
										/>
									)}
								</CalendarGrid>
							</Calendar>
						</Dialog>
					</Popover>
				</DatePicker>

				<DatePicker name="reported_on">
					<Label>
						<Trans>Reporting Date</Trans>
					</Label>
					<Group
						className={css`
						width: 14em;
						  border: 0.125rem solid token(colors.gray);
						  border-radius: token(radii.sm);
							width: 14em;
							display: flex;
							justify-content: space-between;
					`}
					>
						<DateInput
							className={css`
							display: inline-block;
						  padding: 0.5rem;
					`}
						>
							{(segment) => <DateSegment segment={segment} />}
						</DateInput>
						<Button className={css`margin: 0em 1em;`}>
							<CalendarIcon />
						</Button>
					</Group>
					<Popover>
						<Dialog className={css`display: flex;`}>
							<Calendar
								className={css`
									background: token(colors.white);
									text-align: center;
								`}
							>
								<header
									className={css`
										  flex: 1;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      gap: 6px;
                      margin: 0 8px 12px 8px;
									`}
								>
									<Button slot="previous">◀</Button>
									<Heading />
									<Button slot="next">▶</Button>
								</header>
								<CalendarGrid
									className={css`
									background: token(colors.white);
								`}
								>
									{(date) => (
										<CalendarCell
											className={css`
												  cursor: default;
                          width: 2em;
                          height: 2em;
                          width: 14em;
                          margin: 2px;
						              border-radius: token(radii.sm);
                          position: relative;
                          outline: none;
                          color: token(colors.black);
                          border: 2px solid token(colors.white);
                          line-height: 1.8em;

                          &:hover {
  	                        background: #eee;
                          }

                          &[data-pressed] {
  	                        background: token(colors.rcmpred);
                          }

                          &[data-selected]{
  	                        background: token(colors.rcmpred);
                            color: token(colors.white);
                          }

                          &[data-focused]{
                            box-sizing: border-box;
                          	border: 2px solid token(colors.rcmpred);
                          }

                          &[data-disabled]{
                          	background: token(colors.lightgray);
                          }
											`}
											date={date}
										/>
									)}
								</CalendarGrid>
							</Calendar>
						</Dialog>
					</Popover>
				</DatePicker>

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

						`}
					>
						<Input
							className={css`
							width: 10em;
							`}
						/>
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
