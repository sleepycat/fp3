import { t, Trans } from "@lingui/macro";
import { data, type MetaFunction } from "react-router";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data?.title ?? t`An Unexpected Error Occured` },
		{ name: "description", content: t`Royal Canadian Mounted Police` },
	];
};

export function loader() {
	return data({
		title: t`Public Portal`,
	});
}

export default function Index() {
	return (
		<>
			<h1>
				<Trans>Federal Policing Public Portal</Trans>
			</h1>
			<ul>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
					>
						<Trans>15m Quickstart Blog Tutorial</Trans>
					</a>
				</li>
				<li>
					<a target="_blank" href="https://remix.run/docs" rel="noreferrer">
						<Trans>Remix Docs</Trans>
					</a>
				</li>
			</ul>
		</>
	);
}
