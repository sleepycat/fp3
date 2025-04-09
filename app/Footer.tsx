import { t, Trans } from "@lingui/macro";
import Wordmark from "./Wordmark";
import { css } from "../styled-system/css";

export default function Footer() {
	const footerClass = css`
  padding: 2em;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  background-color: #f1f2f3;
  border-top: 1px solid rgb(51, 51, 51);
`;

	const canadaRed = css`fill: #EA2D37;`;
	return (
		<footer className={footerClass}>
			<Trans>links</Trans>
			<Wordmark.SVG
				aria-label={t`Symbol of the Government of Canada`}
				role="img"
				width="10em"
			>
				<Wordmark.Flag className={canadaRed} />
				<Wordmark.Text />
			</Wordmark.SVG>
		</footer>
	);
}
