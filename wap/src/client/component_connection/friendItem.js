import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// selectors
import { getDataList, getIsLoading } from 'src/client/reducers/connection';
// components
import { LightBox } from 'c_wap_module';
import { NameCard, ChannelCard } from 'src/client/component_common/card';
import { NoCountTemplate } from 'src/client/component_common/contactTemplate';

import Friends from './interaction/friends';
import Invitations from './interaction/invitations';
import Unconfirmed from './interaction/unconfirmed';
import Following from './interaction/following';
import MyFollowersAndMayKnow from './interaction/myFollowersAndMayKnow';
import Excellent from './interaction/excellent';
import NonSelf from './interaction/nonSelf';

import LazyLoading from 'src/client/component_common/lazyLoad/list';
// actions
import { loadDataByCategory, accept, reject } from 'src/client/actions/connection';

class FriendItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lightbox: false
		};

		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
		this.openLightBox = this.openLightBox.bind(this);
		this.loadMutualData = this.loadMutualData.bind(this);
	}

	openLightBox(e) {
		e.preventDefault();
		this.loadMutualData();
		this.setState({ lightbox: true });
	}
	loadMutualData() {
		const { loadDataByCategory, targetPid, mode} = this.props;

		if (mode === 'excellentPeopleList') {
			loadDataByCategory('othersfollowers', {targetPid});
		} else {
			loadDataByCategory('mutualFriends', {targetPid});
		}
	}
	handleLightBoxCancel() {
		this.setState({ lightbox: false });
	}
	render() {
		const { isLogin, name, company, title, mutualFriendCount, lightboxItems, id, pid, targetPid,
			avatarWebUrl, subscribeCount, mode, loading, hiddenStatus, type } = this.props;
		const lightboxOption = {
			closeIcon: true,
			title: mode !== 'excellentPeopleList' ? '共同朋友' : '關注的人'
		};
		const linkurl = id ? `/channel/${id}` : `/profile/${targetPid}`;
		return (
			<dd >
				<div styleName="contacts_content_left">
					<div styleName="contacts_content_pic">
						{
							type === 'media' &&
								<ChannelCard
									id={ id }
									href={ linkurl }
									imgSrc={ avatarWebUrl }
									name={ name }
								/>
						}
						{
							type !== 'media' &&
								<NameCard
									filter={ targetPid }
									targetPid={ targetPid }
									href={ linkurl }
									imgSrc={ avatarWebUrl }
									name={ name }
									hiddenStatus
								/>
						}
					</div>
					{
						hiddenStatus === true &&
						<div className="body_text" styleName="contacts_content_text">
							<a className="list" styleName="title">{name}</a>
						</div>
					}
					{
						hiddenStatus !== true &&
						<div className="body_text" styleName="contacts_content_text">
							<a href={ linkurl } className="list" styleName="title">{name}</a>
							{/* <Link to={ linkurl } className="list" styleName="title">{name}</Link> */}
							<br />
							{
								company && title &&
								<div styleName="contacts_content_job">
									<span>
										{company}　{title}
									</span>
								</div>
							}
							{
								mode !== 'excellentPeopleList'
								? (mutualFriendCount > 0) && <Link to="#" onClick={ this.openLightBox }>{mutualFriendCount}個共同朋友</Link>
								: (subscribeCount > 0) && <Link to="#" onClick={ this.openLightBox }>{subscribeCount}個關注者</Link>
							}
						</div>
					}
				</div>
				{ isLogin && hiddenStatus !== true &&
					<div styleName="contacts_content_right">
						{ (mode === 'friend' || !isNaN(parseInt(mode))) && <Friends { ...this.props } mode={ mode } /> }
						{ mode === 'invitations' && <Invitations { ...this.props } mode={ mode } /> }
						{ mode === 'unconfirmed' && <Unconfirmed { ...this.props } mode={ mode } /> }
						{ mode === 'following' && <Following { ...this.props } mode={ mode } /> }
						{ mode === 'myfollowers' && <MyFollowersAndMayKnow { ...this.props } mode={ mode } /> }
						{ mode === 'mayKnowPeopleList' && <MyFollowersAndMayKnow { ...this.props } mode={ mode } /> }
						{ mode === 'excellentPeopleList' && <Excellent { ...this.props } mode={ mode } /> }
						{ mode === 'nonSelf' && <NonSelf { ...this.props } mode={ mode } /> }
					</div>
				}
				{
					this.state.lightbox &&
					<LightBox option={ lightboxOption } onClose={ this.handleLightBoxCancel }>
						<LazyLoading loadingAct={ this.loadMutualData }>
							<div styleName="lbContainer">
								{
									lightboxItems &&
									lightboxItems.map((item, key) => <NoCountTemplate key={ key } { ...item } />)
								}
								{
									loading &&
									<div style={ {width: '100%', height: '25px', marginBottom: '15px'} }>
										<div className="ui loading" />
									</div>
								}
							</div>
						</LazyLoading>
					</LightBox>
        }
			</dd>
		);
	}
}

FriendItem.propTypes = {
  // pid: PropTypes.number,
  // userPid: PropTypes.number,
	name: PropTypes.string,
	company: PropTypes.string,
	title: PropTypes.string,
	mutualFriendCount: PropTypes.number,
  // mutualFriends: PropTypes.array,
};

function dataSelector(state, targetPid, mode) {
	if (mode === 'excellentPeopleList') {
		return getDataList(state, 'othersfollowers', {targetPid});
	}
	return getDataList(state, 'mutualFriends', {targetPid});
}

function loadingSelector(state, targetPid, mode) {
	if (mode === 'excellentPeopleList') {
		return getIsLoading(state, 'othersfollowers', {targetPid});
	}
	return getIsLoading(state, 'mutualFriends', {targetPid});
}

const mapStateToProps = (state, {targetPid, mode}) => {
	const nowState = state.connection;
	return {
		accuseItem: state.accuse.accuseItem.user,
		lightboxItems: dataSelector(nowState, targetPid, mode),
		loading: loadingSelector(nowState, targetPid, mode),
	};
};
const actions = {
	loadDataByCategory,
	accept,
	reject
};

export default compose(
	connect(mapStateToProps, actions),
	[CSSModules, '_', css]
)(FriendItem);
