import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import Image from 'src/client/component_common/image';
import css from './index.css';
// import { translate } from 'react-i18next';

import ActivityEditor from 'src/client/component_activities/module/Editor';

class PostActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editMode: editmodeInitStatue(props)
		};
	}
	handleEditActivity() {
		this.setState({	editMode: true });
	}
	handleCloseActivityEditor() {
		this.setState({	editMode: false	});
	}
	render() {
		const { user: { avatarWebUrl }, placeholder, channelId, channelInfo } = this.props;
		const hasChannelInfo = !!channelInfo;
		return (
			<div styleName="publication">
				<div styleName="wrap" data-gtm-activity="發文 Trigger" onClick={ this.handleEditActivity.bind(this) }>
					<span className="h3" styleName="left">
						{
							!hasChannelInfo &&
							<Image
								type={ 'avatar' }
								src={ avatarWebUrl }
							/>
						}
						{
							hasChannelInfo && channelInfo.type !== 10 &&
							<Image
								type={ 'avatar' }
								domain={ 'group' }
								src={ avatarWebUrl }
							/>
						}
						{
							(hasChannelInfo && channelInfo.type === 10) &&
							<Image
								type={ 'avatar' }
								domain={ 'channel' }
								src={ channelInfo.avatarWebUrl }
							/>
						}
						{placeholder}
					</span>
					<i className="edit icon" />
				</div>
				{
					this.state.editMode &&
					<ActivityEditor
						close={ this.handleCloseActivityEditor.bind(this) }
						itemData={ null }
						galleryMode={ false }
						channelId={ channelId }
						channelInfo={ channelInfo }
					/>
				}
			</div>
		);
	}
}

PostActivity.defaultProps = {
	placeholder: '展示你的專業吧！'
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};

const editmodeInitStatue = (props) => {
	if (props.hasOwnProperty('router') && props.router.location.query.create) {
		return true;
	}
	return false;
};

export default compose(
	connect(mapStateToProps),
	// translate([]),
	[CSSModules, '_', css]
)(PostActivity);
