import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// actions
import {
	queryAppraiseListOfOwner,
	queryAppraiseList,
	queryAppraisePendingList,
	queryAppraiseListNotSort,
	clearAppraise
} from 'src/client/actions/social';
// selectors
import {
	getShowItems,
	getLightboxItems,
	getAppraiseSize,
	getAppraiseLastTime,
	getVisitorInList
} from 'src/client/reducers/social/selectors';
// components
import AddAppraise from './addAppraise';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import { LightBox } from 'c_wap_module';
import LightboxAppraiseItem from './lightboxAppraiseItem';
import ShowAppraiseItem from './showAppraiseItem';

// 我的讚美
class Appraise extends Component {
	constructor(props) {
		super(props);
		this.state = {
			privacySettingSwitch: false,
			lightbox: false,
			lightboxMode: 'confirmed',
			showAddAppraise: false
		};

		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
		this.loadMore = this.loadMore.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { visitorInList } = nextProps;
		// this.setState({showAddAppraise: viewas !== 'self' && !visitorInList && selfpid !== -3 });
		this.state.showAddAppraise = this.props.viewas !== 'self' && !visitorInList && this.props.user.pid !== -3;
		if (this.props.viewas !== nextProps.viewas) {
			// 切換檢視角度用
			setTimeout(() => {
				this.props.clearAppraise(this.queryAppraiseData.bind(this, this.props.viewas));
			}, 0);
		}
	}
	componentDidMount() {
		this.queryAppraiseData(this.props.viewas);
	}
	componentDidUpdate(prevProps, prevState) {
		
		/**
		 * 這段結構的reducer 設計有明顯的問題，因此先把loadmore拔掉
		 */
		
		// 拉到底載入
		
		// if (this.state.lightbox && !prevState.lightbox) {
		// 	const lbContainer = this.refs.lbContainer;
		// 	lbContainer.onscroll = () => {
		// 		let current = Math.ceil(lbContainer.scrollTop + lbContainer.clientHeight);
	    //   if(current === lbContainer.scrollHeight) {
	    //     this.loadMore();
	    //   }
		// 	}
		// }
	}
	loadMore() {
		const { lastTimeInMillis } = this.props;
		if (lastTimeInMillis) {
			this.queryAppraiseData(this.props.viewas, lastTimeInMillis);
		}
	}

	queryAppraiseData(viewas, lastTimeInMillis = 0) {
		// 判斷要載入的讚美列表
		if (viewas === 'self') {
			const params = {
				targetPid: this.props.user.pid,
				timeInMillis: lastTimeInMillis,
				limit: 99
			};
			this.props.queryAppraiseListOfOwner(params);
			this.props.queryAppraisePendingList(params);
		} else {
			const params = {
				targetPid: this.props.params.pid,
				timeInMillis: lastTimeInMillis,
				limit: 99,
				sortByPid: 1
			};
			this.props.queryAppraiseList(params);
			params.sortByPid = 0;
			this.props.queryAppraiseListNotSort(params);
		}
	}
	onTabClick(mode) {
		if (mode === this.state.lightboxMode) return false; //點同一個tab不觸發

		const previousState = this.state.lightboxMode;
		const previousTab = this.refs[previousState];
		const activeTab = this.refs[mode];

		activeTab.classList.add('active');
		previousTab.classList.remove('active');

		this.setState({
			lightboxMode: mode
		});
	}

	handleLightboxOpen(active, inactive, e) {
		e.preventDefault();
		const { appraiseListSize, pendingListSize } = this.props;
		if (appraiseListSize === 0 && pendingListSize === 0 ) return false;
		this.setState({
			lightbox: true,
			lightboxMode: active,
		}, ()=>{
			this.refs[active].classList.add('active');
			this.refs[inactive].classList.remove('active');
		});
	}

	handleLightBoxCancel() {
		this.setState({
			lightbox: false,
			lightboxMode: 'confirmed'
		});
	}

	render() {
		const { appraiseListSize, visitorInList, pendingListSize } = this.props;
		const listSize = appraiseListSize || 0;

		return (this.props.viewas === 'self' && listSize === 0)
			? null
			:	<div>
					<SocialComponentTitle
						maintitle="我的讚美"
						privacySettingSwitch={ this.state.privacySettingSwitch }
					/>
					<div styleName='respect_main'>
						<dl>
							<dt className='body_text'>
								有
								<a
									onClick={ this.handleLightboxOpen.bind(this, 'confirmed', 'unconfirmed') }
									href='#'
									data-gtm-profile-social="讚美 - 總數"
								>
								{ listSize }
								</a>
								個人對{ this.props.viewas === 'self' ? '你' : this.props.userName }表達讚美
								{
									pendingListSize > 0 &&
									<span>
										，
										<a
											onClick={ this.handleLightboxOpen.bind(this, 'unconfirmed', 'confirmed') }
											href='#'
											data-gtm-profile-social="讚美 - 待確認數">{ pendingListSize }
										</a>
										筆待確認
									</span>
								}
							</dt>

							{
								this.state.showAddAppraise &&
								<AddAppraise
									user={ this.props.user }
									targetPid={ this.props.params.pid }
									notLogin={ !this.props.user.isLogin }
									avatarWebUrl={ this.props.user.avatarWebUrl }
									interactionLock={ this.props.interactionLock }
								/>
							}
							{
								this.props.showItems.map((item, index) =>
									<ShowAppraiseItem
										key={ index }
										selfpid={ this.props.user.pid }
										viewas={ this.props.viewas }
										{ ...item }
									/>
								)
							}
						</dl>
					</div>
					{this.state.lightbox &&
						<LightBox option={{closeIcon: true}} onClose={this.handleLightBoxCancel} >
							<div ref="tabContainer" style={{width: '700px'}}>
								<ul className="tabs">
									<li ref="confirmed" className="active" onClick={this.onTabClick.bind(this, 'confirmed')}>
										{ this.props.viewas === 'self' ? '我' : this.props.userName }的讚美
									</li>
									{ this.props.viewas === 'self' &&
										<li ref="unconfirmed" onClick={this.onTabClick.bind(this, 'unconfirmed')}>
											待確認
										</li>
									}
								</ul>
								<div ref="lbContainer" styleName="lbContainer">
									{this.props.lightboxItems.filter(item => {
											return this.state.lightboxMode === "confirmed"
												? item.privateSetting !== -1
												: item.privateSetting === -1;
										}).map((item, index) =>{
											return <LightboxAppraiseItem
												key={index}
												selfpid={ this.props.user.pid }
												viewas={ this.props.viewas }
												{...item}
											/>
										}

										)
									}
								</div>
							</div>
						</LightBox>
					}
				</div>

	}
}

Appraise.propTypes = {
	appraiseListSize: PropTypes.number,
	lightboxItems: PropTypes.array,
	lastTimeInMillis: PropTypes.number,
	params: PropTypes.object,
	pendingListSize: PropTypes.number,
	queryAppraiseListOfOwner: PropTypes.func.isRequired,
	queryAppraiseList: PropTypes.func.isRequired,
	queryAppraiseListNotSort: PropTypes.func.isRequired,
	queryAppraisePendingList: PropTypes.func.isRequired,
	showItems: PropTypes.array,
	visitorInList: PropTypes.bool,
};

function mapStateToProps(state) {
	return {
		appraiseListSize: getAppraiseSize(state),
		lastTimeInMillis: getAppraiseLastTime(state),
		lightboxItems: getLightboxItems(state),
		pendingListSize: state.social.pending.listSize,
		showItems: getShowItems(state),
		visitorInList: getVisitorInList(state)
	};
}


const actions = {
	queryAppraiseListOfOwner,
	queryAppraiseList,
	queryAppraisePendingList,
	queryAppraiseListNotSort,
	clearAppraise
};

export default compose(
	connect(mapStateToProps, actions),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Appraise);
