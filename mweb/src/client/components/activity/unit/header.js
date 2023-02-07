import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './header.css';
import compose from 'src/util/compose';
import timeAgo from 'c_platform/lib/util/timeago';
// components
import ChannelItem from 'src/client/components/channelItem';
import PeopleItem from 'src/client/components/peopleItem';
import PrivacySetting from '../unit/privacySetting';

class ActivityHeader extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { userInfo, channelInfo } = this.props;
		const userObj = {
			pid: userInfo.pid,
			userName: userInfo.userName,
			avatarWebUrl: userInfo.userFileUrl,
			companyName: userInfo.userCompany,
			jobTitle: userInfo.userJobTitle,
		};
		const otherObj = channelInfo ? {
			name: channelInfo.name,
			link: `/m/group/${channelInfo.id}`,
		} : undefined;
		const { createDateStr, privacySetting } = this.props;
		return (
			<div>
				{ 
					channelInfo && channelInfo.type === 10
						? // 是頻道時
							<ChannelItem
								channelInfo={ channelInfo }
							/>
						: // 是社團或人時
							<PeopleItem
								// channelInfo={ channelInfo }
								userObj={ userObj }
								otherObj={ otherObj }
								wrapStyle={ {padding: 0} }
							/>
				}
				<div styleName="title_block">
					{/* <i className="icon dropdown_arrow" styleName="dropdown_arrow" />*/}
					<span>{ timeAgo(createDateStr) }</span>
					<PrivacySetting privacySetting={ privacySetting } />
				</div>
			</div>
		);
	}
}

ActivityHeader.defaultProps = {
	userInfo: {
		userName: '',
		userCompany: '',
		userJobTitle: '',
		userFileUrl: '',
	},
};

ActivityHeader.propTypes = {
	userInfo: PropTypes.object.isRequired,
};
export default compose(
	[CSSModules, '_', css, { allowMultiple: true }],
)(ActivityHeader);
