import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './stream.css';
import DOMPurify from 'dompurify';
import compose from 'src/util/compose';
import { connect } from 'react-redux';
import { layerActivityOpen } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activity_log.js';
import Title from '../unit/title';
import Header from '../unit/header';
import Counter from '../unit/counter';
import { CoolBtn, CollectBtn } from 'src/client/components/button';

class ActivityStream extends Component {
	constructor(props) {
		super(props);
	}
	handleShowActivity(itemData, viewActivityLog) {
		activityLog(itemData, viewActivityLog);
		this.props.layerActivityOpen({
			aid: itemData.aid,
			from: this.props.from,
		});
	}
	render() {
		const { itemData, loginUser, pageName, filter } = this.props;
		const PreImage = (typeof (itemData.extraInfo) === 'object') ? attachPreImage(itemData.extraInfo.attachmentList) : false;
		const html = DOMPurify.sanitize(itemData.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
		const viewActivityLog = { pid: loginUser.pid, page: pageName ? pageName : '', filter: filter ? filter : '' };
		return (
			<div styleName="streamItem">
				<div styleName="header">
					<Header
						userInfo={ itemData.userInfo }
						channelId={ itemData.channelId }
						channelInfo={ itemData.channelInfo }
						createDateStr={ itemData.createDateStr }
						privacySetting={ setPrivacyIcon(itemData.privacySetting) }
					/>
				</div>
				<div styleName="main" onClick={ this.handleShowActivity.bind(this, itemData, viewActivityLog) }>
					<Title title={ itemData.title } area="river" aid={ itemData.aid } />
					{
						html &&
						<div
							styleName="pre_content"
							dangerouslySetInnerHTML={ { __html: html } }
						/>
					}
					{
						PreImage &&
						<div styleName="pre_image_container">
							<img src={ PreImage } styleName="pre_image" />
						</div>
					}
					<Counter itemData={ itemData } mode="stream" />
				</div>
				<div styleName="bottom">
					<CoolBtn
						propsSource={ itemData }
						count={ itemData.likeCount }
						pid={ loginUser.pid }
						pageName={ pageName }
						filter={ filter }
					/>
					<CollectBtn
						propsSource={ itemData }
						count={ itemData.collectCount }
						pid={ loginUser.pid }
						pageName={ pageName }
						filter={ filter }
					/>
				</div>
			</div>
		);
	}
}

function setPrivacyIcon(setting) {
	switch (setting) {
		case 0:
			return 'world icon';
		case 1:
			return 'friends icon';
		case 2:
			return 'lock icon';
		default:
			return 'world icon';
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

ActivityStream.defaultProps = {
	itemData: {},
};

ActivityStream.propTypes = {
	itemData: PropTypes.object.isRequired,
};

export default compose(
	connect(null, { layerActivityOpen }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(ActivityStream);
