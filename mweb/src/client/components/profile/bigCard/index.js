import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

// selectors
import { getGuestCount, getProfiles } from 'src/client/selectors';
// components
import Image from 'src/client/components/image';
import GuestRecord from 'src/client/components/profile/guestBlock/guestRecord';
import InteractionForProfile from 'src/client/components/profile/interactionForProfile';

class BigCard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (!this.props.userInfo) return null;
		const { targetPid, guestRecordCount, viewAs } = this.props;
		const { coverWebUrl, avatarWebUrl, userName, jobTitle, companyName, major, schoolName, connectionStatus } = this.props.userInfo;
		const jobOrMajor = jobTitle !== null ? jobTitle : major;
		const companyOrSchool = companyName !== null ? companyName : schoolName;

		return (
			<div styleName="bigCard">
				<div styleName="imgSection">
					<Image
						styleName="cover"
						src={ coverWebUrl }
						type="cover"
						domain="profile"
					/>
					<Image
						styleName="avatar"
						src={ avatarWebUrl }
						type="avatar"
						domain="profile"
					/>
				</div>
				<h2>{ userName }</h2>
				<p>{ jobOrMajor }</p>
				<p>{ companyOrSchool }</p>
				<div styleName="guest_block">
					{viewAs === 'self' ?
						<GuestRecord
							total={ guestRecordCount }
							targetPid={ targetPid }
						/> :
						<InteractionForProfile
							targetPid={ targetPid }
							connectionStatus={ connectionStatus }
						/>
					}
				</div>
			</div>
		);
	}
}

function selector(state, props) {
	const { targetPid } = props;
	return {
		guestRecordCount: getGuestCount(state, targetPid),
		userInfo: getProfiles({state, targetPid, key: 'userInfo'}),
	};
}

export default compose(
	connect(selector, {}),
	[CSSModules, '_', css, { allowMultiple: true }],
)(BigCard);
