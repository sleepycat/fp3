import {
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	DateInput,
	DatePicker as AriaDatePicker,
	DateSegment,
	Dialog,
	FieldError,
	Group,
	Heading,
	Label,
	Popover,
} from "react-aria-components";
import CalendarIcon from "./CalendarIcon";
import { css } from "../styled-system/css";

const datePickerHeaderClass = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin: 0 8px 12px 8px;
  `;

const calendarCellClass = css`
    cursor: default;
    width: 2em;
    height: 2em;
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
	`;

const datePickerGroupClass = css`
    width: 14em;
    border: 0.125rem solid token(colors.gray);
    border-radius: token(radii.sm);
    width: 14em;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;

    &[data-invalid] {
      border: 2px solid token(colors.rcmpred);
    }
	`;

const fieldErrorClass = css`
  position: relative;
  bottom: -3em;
  right: 8em;
  font-size: small;
  color: token(colors.rcmpred);
`;

const calendarClass = css`
  background: token(colors.white);
  text-align: center;
`;

const popoverClass = css`
    border-radius: token(radii.sm);
    border: 0.125rem solid token(colors.gray);
`;
// TODO: learn more typescript.
// @ts-expect-error: binding element implicitly has any type
export default function DatePicker({ name, label }) {
	return (
		<AriaDatePicker name={name}>
			<Label>{label}</Label>
			<Group className={datePickerGroupClass}>
				<DateInput
					className={css`
							display: inline-block;
						  padding: 0.5rem;
					`}
				>
					{(segment) => <DateSegment segment={segment} />}
				</DateInput>
				<FieldError className={fieldErrorClass} />
				<Button className={css`margin: 0em 1em;`}>
					<CalendarIcon />
				</Button>
			</Group>
			<Popover className={popoverClass}>
				<Dialog>
					<Calendar className={calendarClass}>
						<header className={datePickerHeaderClass}>
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
								<CalendarCell className={calendarCellClass} date={date} />
							)}
						</CalendarGrid>
					</Calendar>
				</Dialog>
			</Popover>
		</AriaDatePicker>
	);
}
