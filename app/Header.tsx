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

	const logoSectionClass = css`
  display: flex;
  align-items: end;
  line-height: 1em;
`;

	return (
		<header className={headerClass}>
			<section className={css`width: 15em;`}>
				<div className={logoSectionClass}>
					<img
						alt={t`The logo of the RCMP`}
						src={logo}
						className={css`float: left; padding: 0 1em;`}
						width="90px"
						height="66.86px"
					/>
					<Trans>
						Royal Canadian
						<br />
						Mounted Police
					</Trans>
				</div>
			</section>
			<LocaleSelector />
		</header>
	);
}
