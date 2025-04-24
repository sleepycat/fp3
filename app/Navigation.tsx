import { t } from "@lingui/core/macro";
// using the Trans component here not the Trans macro
import { Trans } from "@lingui/react";
import { NavLink as BaseNav } from "react-router";
import { css } from "../styled-system/css";
import { styled } from "../styled-system/jsx";

const NavLink = styled(BaseNav)`
	padding: 0 1em;
  &.active {
	  font-weight: bold;
	}
`;

const navClass = css`
  background-color: token(colors.lightgrey);
	border-top: 2em solid token(colors.rcmpred);
	border-bottom: 4px solid token(colors.burgundy);
`;
const contentClass = css`
  width: 75%;
  margin: auto;
`;

export default function Navigation() {
	return (
		<nav className={navClass}>
			<section className={contentClass}>
				<Trans
					id="/"
					render={({ translation }) => {
						// TODO: This code works but typescript is big mad
						// about the value assigned to the NavLink to prop
						// @ts-expect-error Type 'ReactNode' is not assignable to type 'To'
						return <NavLink to={translation}>{t`Home`}</NavLink>;
					}}
				/>
				{/* @ts-expect-error: Typescript doesn't seem to have correct type info for Trans. */}
				<Trans
					id="/drug-seizures"
					render={({ translation }) => {
						// TODO: This code works but typescript is big mad
						// about the value assigned to the NavLink to prop
						// @ts-expect-error Type 'ReactNode' is not assignable to type 'To'
						return <NavLink to={translation}>{t`Drug Seizures`}</NavLink>;
					}}
				/>
			</section>
		</nav>
	);
}
