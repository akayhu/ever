import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { queryColleagueList, colleagueWishStatus, addColleagueWish, removeColleagueWish } from 'src/client/actions/social';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import LightboxListItem from 'src/client/component_profile/lightboxlist/lightboxList';
import { NameCard } from 'src/client/component_common/card';
import { LightBox } from 'c_wap_module';
import compose from 'src/util/compose';

// 共事意願
class Praise extends React.Component {
	constructor() {
		super();
		this.state = {
			lightbox: false,
			confirmPublic: false,
			sendReqLoading: false,
		};
		this.lightboxTrigger = this.handleLightbox.bind(this);
		this.buttonTrigger = () => this.handleColleagueWish();
	}
	componentDidMount() {
		this.queryColleagueList();
		this.props.colleagueWishStatus({ targetPid: this.props.params.pid });
	}
	queryColleagueList() {
		this.props.queryColleagueList({
			targetPid: this.props.params.pid,
			timeInMillis: 0,
			limit: 99,
			sortByPid: 0,
		});
	}
	handleColleagueWish() {
		const { colleagueWishStatus } = this.props.colleague;
		if (colleagueWishStatus) {
			this.props.removeColleagueWish({ targetPid: this.props.params.pid });
		} else {
			this.setState({ confirmPublic: true });
		}
	}
	addColleagueWish(isPublic) {
		this.setState({sendReqLoading: true});
		if (!this.state.sendReqLoading) {
			this.props.addColleagueWish({
				targetPid: this.props.params.pid,
				isPublic
			}).then(() => {
				this.setState({ confirmPublic: false, sendReqLoading: false });
			});
		}
	}
	handleConfirmPublicLightbox(confirmPublic) {
		this.state({confirmPublic});
	}
	handleLightbox() {
		this.setState({	lightbox: (this.state.lightbox === false) });
	}
	render() {
		
		const lightboxOption = {
			closeIcon: true,  // 有無close ICON,
			contentHeight: '405px', // 決定content區塊有無最小高度，有設定的話會出現scroll bar
			title: `這群同事表達與 ${this.props.userName} 共事愉快`
		};

		const showAddTrigger = this.props.connectionStatus && this.props.connectionStatus.relationType/1 === 1;
		const { colleagueWishStatus } = this.props.colleague;
		const listSize = this.props.colleague.listSize || 0;
		return (
			<div>
				{
					(listSize !== 0 || showAddTrigger) &&
					<div>
						<SocialComponentTitle	maintitle="共事意願" />
						<div styleName="praise_main">
							<div className="body_text" styleName="praise_main_top_title">
								有
								<a
									href="javascript: void(0);"
									onClick={ this.lightboxTrigger }
									data-gtm-profile-social="共事 - 總數"
								>{listSize}</a>
								位同事表達與{ this.props.userName }共事愉快
							</div>
							<div styleName="praise_main_top">
								{
									this.props.colleague.colleagueList &&
									arrayPreprocess(this.props.colleague.colleagueList,	this.props.user.pid, showAddTrigger).map((item) => {
										const url = `/profile/${item.pid}`;
										
										return (
											<NameCard
												filter={ item.pid }
												targetPid={ item.pid }
												key={ `${item.pid}_${item.createTimestamp}` }
												href={ url }
												imgSrc={ item.avatarWebUrl }
												name={ item.userName }
												company={ item.companyName }
												title={ item.jobTitle }
												gtm={ { 'data-gtm-profile-social': '共事 - avatar' } }
											/>
										);
									})
								}
								{
									showAddTrigger &&
									<div
										styleName="addwishbtn"
										title={ (colleagueWishStatus) ? '移除共事意願' : '增加共事意願' }
										onClick={ this.buttonTrigger }
									>
										<div styleName="mask">
											<i className={ (colleagueWishStatus) ? 'minus icon' : 'plus icon' } styleName="maskIcon" />
										</div>
										<img
											styleName="addwishImg"
											src={ this.props.user.avatarWebUrl }
										/>
									</div>
								}
							</div>
						</div>
					</div>
				}
				{
					this.state.confirmPublic &&
					<LightBox option={ { contentHeight: 'auto' } } onClose={ this.handleConfirmPublicLightbox.bind(this, false) }>
						<h2>是否公開個人身分讓，其他人看到？</h2>
						<div styleName="button_row">
							<button className="ui primary button" onClick={ this.addColleagueWish.bind(this, true) } >公開</button>
							<button className="ui button" onClick={ this.addColleagueWish.bind(this, false) } >不公開</button>
						</div>
					</LightBox>
				}
				{
					this.state.lightbox &&
					<LightBox option={ lightboxOption } onClose={ this.lightboxTrigger }>
						<div styleName="lbContainer">
							{
								this.props.colleague.colleagueList.map((item) => {
									return (
										<LightboxListItem key={ `${item.pid}_${item.createTimestamp}` } personData={ item } />
									);
								})
							}
						</div>
					</LightBox>
				}
			</div>
		);
	}
}

const arrayPreprocess = (listArray, pid, showAddTrigger) => {
	const newListArray = listArray.map((item) => { return item });
	if (!showAddTrigger) {
		return newListArray.slice(0, 5); // 自己看自己 or 不是同事 回傳 5個 personData;
	}
	// 是同事的走這邊
	listArray.filter((item, index) => {
		if (item.pid === pid) return newListArray.splice(index, 1).slice(0, 4);
	});

	return newListArray.slice(0, 4);
};

export default compose(
	connect(null, { queryColleagueList, colleagueWishStatus, addColleagueWish, removeColleagueWish }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Praise);
