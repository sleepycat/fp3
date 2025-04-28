import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
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
				<Trans>Terms and Conditions</Trans>
			</h1>
			<article>
				<Trans>Legal jargon</Trans>
			</article>
		</>
	);
}
