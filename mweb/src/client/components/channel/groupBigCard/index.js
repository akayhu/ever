import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

// selectors
import { getChannel } from 'src/client/selectors';
// import { getGuestCount, getProfiles } from 'src/client/selectors';
// components
import Image from 'src/client/components/image';
// import GuestRecord from 'src/client/components/profile/guestBlock/guestRecord';
// import InteractionForProfile from 'src/client/components/profile/interactionForProfile';

class BigCard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (!this.props.channelInfo) return null;
		const { channelId } = this.props;
		const { coverWebUrl, name } = this.props.channelInfo;

		return (
			<div styleName="bigCard">
				<div styleName="imgSection">
					<Image
						styleName="cover"
						src={ coverWebUrl }
						type="cover"
						domain="group"
					/>
				</div>
				<h2>{ name }</h2>
				{/*
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
				</div>*/}
			</div>
		);
	}
}

function selector(state, props) {
	const { channelId } = props;
	
	return {
		pid: state.user.pid,
		channelId,
		channelInfo: getChannel({state, channelId, key: 'channelInfo'}),
	};
}

export default compose(
	connect(selector, {}),
	[CSSModules, '_', css, { allowMultiple: true }],
)(BigCard);
