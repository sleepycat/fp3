import { i18n } from "@lingui/core";
import { LocaleSelector } from "~/modules/lingui/lingui";
import { t, Trans } from "@lingui/macro";
import { css } from "../styled-system/css";
import logo from "./images/rcmp-crest-black.svg?url";
import { Link } from "react-router";

export default function Header() {
	const headerClass = css`
  padding: 1em;
  display: flex;
 justify-content: space-between;
 `;

	const linkClass = css`
		padding: 0 1em;
	`;

	return (
		<header className={headerClass}>
			<section className={css`width: 15em;`}>
				<img
					alt={t`The logo of the RCMP`}
					src={logo}
					className={css`float: left; padding: 0 1em;`}
				/>
				<Trans>
					Royal Canadian
					<br />
					Mounted Police
				</Trans>
			</section>
			<LocaleSelector />
			<nav>
				<Link className={linkClass} to="/">
					<Trans>Home</Trans>
				</Link>
				<Link className={linkClass} to={i18n._("/terms-and-conditions")}>
					<Trans>terms</Trans>
				</Link>
			</nav>
		</header>
	);
}
