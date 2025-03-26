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
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>
				<Trans>Terms and Conditions</Trans>
			</h1>
			<article>
				<Trans>Legal jargon</Trans>
			</article>
		</div>
	);
}
