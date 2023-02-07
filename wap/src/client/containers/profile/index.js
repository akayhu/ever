import { connect } from 'react-redux';
import React, { Component } from 'react';
import compose from 'src/util/compose';
// import css from './index.css';
import { loadProfile, checkIdentity, viewAs, viewProfile, initProfilePage, setProfilePid } from 'src/client/actions/profile';
import { getConnectionStatus } from 'src/client/actions/connection';
import { loadDataCenter, setPrivacy, isAllowReadProfile } from 'src/client/actions/privacy';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';

import Info from 'src/client/component_profile/info';
import Cover from 'src/client/component_profile/cover';
import { components as CPlatformComponents } from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Profile extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			isShow: true
		};
	}
	componentWillMount() {
		const { targetPid, initProfilePage, setProfilePid } = this.props;
		setProfilePid(targetPid);
		initProfilePage(targetPid);
		if (this.props.profile && this.props.profile.block) {
			this.props.changeSSRStatus(404);
			this.props.router.push('/error/404/block');
		}
	}
	componentWillReceiveProps(nextProps) {
		const { targetPid, initProfilePage, setProfilePid } = this.props;
		if (targetPid !== nextProps.targetPid) {
			setProfilePid(nextProps.targetPid);
			initProfilePage(nextProps.targetPid);
		}
	}
	render() {
		if (this.props.profile && this.props.profile.block) {
			this.props.router.replace('/error/404/block');
		}
		return (
			<ViewWrapper { ...this.props } >
				{
					this.state.isShow &&
					<div className="container_wrap">
						{	this.props.user.pid !== -3 &&
							<Info
								// getParamMap={ this.props.getParamMap }
								history={ this.props.history }
								params={ this.props.params }
								user={ this.props.user }
								profile={ this.props.profile }
								viewas={ this.props.viewas }
								privacy={ this.props.privacy }
								config={ this.props.config }
								interactionLock={ this.props.interactionLock }
							/>
						}
						{	this.props.profile &&
							<Cover
								params={ this.props.params }
								location={ this.props.location }
								user={ this.props.user }
								profile={ this.props.profile }
								viewas={ this.props.viewas }
							/>
						}
						{ this.props.children }
					</div>
				}
				{
					!this.state.isShow &&
					<div className="ui loading" style={ {top: '100px'} } />
				}
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state, props) {
	state.history = { ...state.history, ...props.history };
	const targetPid = parseInt(props.params.pid);
	const pid = parseInt(state.user.pid);

	return {
		pid,
		targetPid,
		profile: pid === targetPid ? state.profile.user_info : state.profile.profile_pool[targetPid],
		config: state.profile.config,
		viewas: state.profile.viewas,
		user: state.user,
		history: state.history,
		privacy: state.privacy.pid === targetPid ? state.privacy : {},
		interactionLock: state.profile.interactionLock
	};
}

const actions = {
	loadProfile,
	loadDataCenter,
	setPrivacy,
	checkIdentity,
	viewAs,
	getConnectionStatus,
	viewProfile,
	isAllowReadProfile,
	initProfilePage,
	setProfilePid,
	changeSSRStatus
};

export default compose(
	connect(mapStateToProps, actions),
)(Profile);
