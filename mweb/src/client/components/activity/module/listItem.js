import React, {Component} from 'react';
import compose from 'src/util/compose';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './listItem.css';
import { translate } from 'react-i18next';
import ga from 'react-ga';
// actions
import { layerActivityOpen } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activity_log.js';

class ListItem extends Component {
	constructor(props) {
		super(props);
	}
	handleShowActivity(data, viewActivityLog) {
		activityLog(data, viewActivityLog);
		this.props.layerActivityOpen({
			aid: data.aid,
			from: this.props.from,
		});
	}
	render() {
		const { data, loginUser, pageName, filter } = this.props;
		const PreImage = (typeof (data.extraInfo) === 'object') ? attachPreImage(data.extraInfo.attachmentList) : false;
		const viewActivityLog = { pid: loginUser.pid, page: pageName ? pageName : '', filter: filter ? filter : '' };
		return (
			<div
				styleName="list_item"
				onClick={ this.handleShowActivity.bind(this, data, viewActivityLog) }
			>
				<div styleName="search_top">
					<div styleName="content_ection">
						<h4 styleName="search_activity_title">{data.title}</h4>
						<div styleName="search_activity_information">
							{
								data.channelInfo && data.channelId && data.channelInfo.type === 10 ? data.channelInfo.name : data.userInfo.userName
							}
						</div>
					</div>
					{
						PreImage &&
						<div styleName="img_section">
							<img src={ PreImage } alt={data.title} />
						</div>
					}
				</div>
				<div styleName="search_bottom">
					<span styleName="search_browse">{data.viewCount}次瀏覽</span>
					{
						data.channelInfo && data.channelId && data.channelInfo.type !== 10 &&
						<span styleName="search_group">{data.channelInfo.name}</span>
					}
				</div>
			</div>
		);
	}
}

function attachPreImage(attachment) {
	if (attachment && attachment.length !== 0) {
		for (const index in attachment) {
			if (attachment[index].activityFileUrl !== null) return attachment[index].activityFileUrl;
		}
	}
	return false;
}

export default compose(
	connect(null, { layerActivityOpen }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(ListItem);
