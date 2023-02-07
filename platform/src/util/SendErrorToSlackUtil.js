import clientConfig from "../configs/client";
import $ from "jquery";

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export default function sendErrorToSlack(msg, channel) {
	if(canUseDOM && window.sendErrorToSlackConfig && ['dev','lab','staging'].indexOf(clientConfig.env) !== -1){
		msg.environment = clientConfig.env;
		
		const payload = {
			"channel": channel || window.sendErrorToSlackConfig.channel, 
			"username": window.sendErrorToSlackConfig.username, 
			"text": JSON.stringify(msg), 
			"icon_emoji": window.sendErrorToSlackConfig.icon_emoji
		};
		$.post(
			window.sendErrorToSlackConfig.url,
			'payload='+JSON.stringify(payload)
		);
	}
}