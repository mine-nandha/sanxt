import { renderToStaticMarkup } from "react-dom/server";
export function MailTemplate({
	esb,
	node,
	macAddress,
	account,
	streets,
	zip,
	customersCount,
}) {
	return (
		<div>
			Hi lads,
			<br />
			<br />
			Could you please check this?
			<br />
			<br />
			<table style={{ borderCollapse: "collapse", border: "1px solid black" }}>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						ESB Outage:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{esb}
					</td>
				</tr>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						Impacted Node Name:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{node}
					</td>
				</tr>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						CM example for quick interface search:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{macAddress}
					</td>
				</tr>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						Account no:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{account}
					</td>
				</tr>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						Street address on affected nodes:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{streets}
					</td>
				</tr>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						Zip:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{zip}
					</td>
				</tr>
				<tr>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						Amount of Impacted customers:
					</td>
					<td
						style={{
							padding: "4px",
							textAlign: "left",
							border: "1px solid black",
						}}
					>
						{customersCount}
					</td>
				</tr>
			</table>
			<br />
			<br />
		</div>
	);
}

export function getMailTemplateHtml(data) {
	const htmlString = renderToStaticMarkup(<MailTemplate {...data} />);
	return htmlString;
}
