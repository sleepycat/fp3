import { t } from "@lingui/core/macro";
// using the Trans component here not the Trans macro
import { Trans } from "@lingui/react";
import Wordmark from "./Wordmark";
import { css } from "../styled-system/css";
import { NavLink as BaseNav } from "react-router";
import { styled } from "../styled-system/jsx";

const NavLink = styled(BaseNav)`
	padding: 0 1em;
  &.active {
	  font-weight: bold;
	}
`;

export default function Footer() {
	const footerClass = css`
    padding: 2em;
    background-color: #f1f2f3;
    border-top: 1px solid rgb(51, 51, 51);
  `;
	const contentClass = css`
	  margin: auto;
	  width: 75%;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
  `;

	const canadaRed = css`fill: #EA2D37;`;
	return (
		<footer className={footerClass}>
			<section className={contentClass}>
				<Trans
					id="/terms-and-conditions"
					render={({ translation }) => {
						// @ts-expect-error Type 'ReactNode' is not assignable to type 'To'
						return <NavLink to={translation}>{t`Terms`}</NavLink>;
					}}
				/>
				<Wordmark.SVG
					aria-label={t`Symbol of the Government of Canada`}
					role="img"
					width="10em"
				>
					<Wordmark.Flag className={canadaRed} />
					<Wordmark.Text />
				</Wordmark.SVG>
			</section>
		</footer>
	);
}
