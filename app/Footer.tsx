import { t, Trans } from "@lingui/macro";
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

const navClass = css`
  background-color: #f1f2f3;
	border-top: 2em solid #b50315;
	border-bottom: 4px solid rgb(130, 55, 62);
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
				{/* @ts-expect-error: Typescript doesn't seem to have correct type info for Trans. */}
				<Trans
					id="/terms-and-conditions"
					render={({ translation }) => {
						// TODO: This code works but typescript is big mad
						// about the value assigned to the NavLink to prop
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
