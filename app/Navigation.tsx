import { t, Trans } from "@lingui/macro";
import { i18n } from "@lingui/core";
import { NavLink as BaseNav } from "react-router";
import { styled } from "../styled-system/jsx";
import { css } from "../styled-system/css";

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

export default function Navigation() {
	return (
		<nav className={navClass}>
			<NavLink to="/">
				<Trans>Home</Trans>
			</NavLink>
			<NavLink to={i18n._("/terms-and-conditions")}>
				<Trans>terms</Trans>
			</NavLink>
		</nav>
	);
}
