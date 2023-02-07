import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

// selectors
import { getChannel } from 'src/client/selectors';
// components
import Image from 'src/client/components/image';
import PeopleList from 'src/client/components/peopleList';
import Layer from 'src/client/components/layer';
import { loadListDataCenter } from 'src/client/actions/general';
// import GuestRecord from 'src/client/components/profile/guestBlock/guestRecord';
// import InteractionForProfile from 'src/client/components/profile/interactionForProfile';

class BigCard extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			showTab: false
		};
	}
	handleClick() {
		// 開關
		this.setState({
			showTab: !this.state.showTab,
		});
	}
	loadMemberMore() {
		const {channelId, loadListDataCenter} = this.props;
		loadListDataCenter({
			domain: 'channel',
			key: 'member',
			channelId,
		});
	}
	render() {
		if (!this.props.channelInfo) return null;
		const {showTab} = this.state;
		const { channelId, member } = this.props;
		const { coverWebUrl, avatarWebUrl, name, subscribeCount, subscriberList } = this.props.channelInfo;

		return (
			<div styleName="bigCard">
				<div styleName="imgSection">
					<Image
						styleName="cover"
						src={ coverWebUrl }
						type="cover"
						domain="channel"
					/>
					<Image
						styleName="avatar"
						src={ avatarWebUrl }
						type="avatar"
						domain="channel"
					/>
				</div>
				<h2>{ name }</h2>
				<div styleName="guest_block">
					<span styleName="count" onClick={ this.handleClick.bind(this) }>{subscribeCount}</span> 人關注
				</div>
				<Layer
					backBtnText={name}
					open={ showTab }
					onRequestClose={ this.handleClick.bind(this) }
				>
					{
						member &&
						<div styleName="people_list">
							<PeopleList
								body={false}
								loading={ member.loading }
								error={ member.error }
								end={ member.end }
								dataList={member.dataList}
								hasButton={false}
								loadingAct={ this.loadMemberMore.bind(this) }
							/>
						</div>
					}
				</Layer>
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
		member: getChannel({state, channelId, key: 'member'})
	};
}

export default compose(
	connect(selector, {loadListDataCenter}),
	[CSSModules, '_', css, { allowMultiple: true }],
)(BigCard);
