import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
// import { Flag } from 'flag';
import {
	requestFetchSimilarProfileList,
	requestFetchFeaturedProfileList,
} from 'actions/profile';
import { addCollection, cancelCollection } from 'actions/collection';
import avatarDef from 'components/defaultSmallImage/avatarDef.png';
import {
	Image,
	GrayBorderButtonFlat,
	Loading,
	SubmitButtonCancelCollection,
	SubmitButtonCollection,
} from 'share/styledComponents';
import { Tooltip, Icon } from 'antd';
import plusVIPList from 'config/plusVIP';
import plusVIPImg from 'components/defaultSmallImage/selection.svg';
import styled from 'styled-components';
import './style.scss';

const CancelButton = styled(GrayBorderButtonFlat)`
	padding: 3px 48px;
`;

/**
 * 個人資訊面板 (手機版)
 */
class MobilePersonalInformation extends Component {
	static propTypes = {
		/** 小名片資訊 */
		data: PropTypes.shape({
			basic: PropTypes.object,
			pid: PropTypes.number,
			collected: PropTypes.bool,
			visitCount: PropTypes.number,
			collectedCount: PropTypes.number,
		}).isRequired,
		/** 重新刷新資訊用的 graphql 物件 */
		graphql: PropTypes.shape({
			refetch: PropTypes.func,
			updateQuery: PropTypes.func,
		}).isRequired,

		/** 精選人才列表 */
		featuredList: PropTypes.object,
		/** 取得精選人才列表 API */
		requestFetchFeaturedProfileList: PropTypes.func.isRequired,
		/** 取得精選人才列表 API 狀態 */
		featuredStatus: PropTypes.string,
		/** 相似的人列表 */
		similarList: PropTypes.object,
		/** 取得相似的人列表 API */
		requestFetchSimilarProfileList: PropTypes.func.isRequired,
		/** 取得相似的人列表 API 狀態 */
		similarStatus: PropTypes.string,
		/** 使用者資訊 */
		user: PropTypes.object.isRequired,
		/** 觸發新增收藏 saga */
		addCollection: PropTypes.func.isRequired,
		/** 觸發取消收藏 saga */
		cancelCollection: PropTypes.func.isRequired,
		/** 顯示系統訊息 */
		// pushSystemMessage: PropTypes.func.isRequired,
		/** 手機版選單最小高度 */
		height: PropTypes.number.isRequired,
	};

	static defaultProps = {
		height: 385,
	};

	constructor(props) {
		super(props);
		this.state = {
			isCollected: props.visitCountData.collected,
			collectionLoading: false,
			plusTagMore: false,
		};
	}

	componentDidMount = () => {
		const {
			featuredList,
			requestFetchFeaturedProfileList,
			requestFetchSimilarProfileList,
			visitCountData,
		} = this.props;
		const { pid } = visitCountData;

		requestFetchSimilarProfileList({ pid });
		if (!featuredList.toJS().length) requestFetchFeaturedProfileList();
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.visitCountData.collected !== prevState.isCollected) {
			return {
				...prevState,
				isCollected: nextProps.visitCountData.collected,
				collectionLoading: false,
			};
		}
		return null;
	}

	toggleCollection = (isAdd = true) => {
		const {
			user,
			graphql,
			addCollection,
			cancelCollection,
			visitCountData,
		} = this.props;
		const targetPid = visitCountData.pid;
		const processId = isAdd
			? `${user.toJS().pid}-add-${targetPid}`
			: `${user.toJS().pid}-cancel-${targetPid}`;

		const refreshCollectStatus = () => {
			const { refetch, updateQuery } = graphql;
			refetch().then(({ data }) =>
				updateQuery(prevResult => ({ ...prevResult, ...data.Namecard }))
			);
		};

		isAdd
			? addCollection(targetPid, processId, refreshCollectStatus)
			: cancelCollection(targetPid, processId, refreshCollectStatus);

		if (user.toJS().login) this.setState({ collectionLoading: true });
	};

	renderAttention = () => {
		const { data, user } = this.props;
		const { collectionLoading } = this.state;
		const targetPid = data.pid;

		// targetPid 就是自己，忽略不顯示收藏等功能
		if (user.toJS().pid === targetPid) return null;

		if (collectionLoading) return <Loading />;

		return (
			<Fragment>
				{this.state.isCollected ? (
					<SubmitButtonCancelCollection
						onClick={this.toggleCollection.bind(this, false)}
					>
						<i className="icon-bookmark" /> 取消收藏
					</SubmitButtonCancelCollection>
				) : (
					<SubmitButtonCollection
						onClick={this.toggleCollection.bind(this, true)}
					>
						<i className="icon-bookmark" /> 收藏
					</SubmitButtonCollection>
				)}
				<Tooltip placement="bottom" title="此功能尚未實作" trigger="click">
					<CancelButton>關注</CancelButton>
				</Tooltip>
			</Fragment>
		);
	};

	plusTagMore = () => {
		this.setState({
			plusTagMore: true,
		});
	};

	renderProfileList = () => {
		const {
			similarList,
			featuredList,
			similarStatus,
			featuredStatus,
		} = this.props;
		// 顯示相似的人 > 精選的人 > 全空
		let renderList =
			similarList.toJS().length > 0 ? similarList.toJS() : featuredList.toJS();

		// loading
		if (similarStatus === 'loading' || featuredStatus === 'loading')
			return <Loading />;

		// initial, error
		if (similarStatus !== 'idle' || featuredStatus !== 'idle') return null;

		// idle, 全空情況
		if (!renderList || !renderList.length) return null;

		// idle, 有資料
		return (
			<Fragment>
				<span className="title">你可能也想看看</span>
				<div>
					<ul>
						{renderList.map((profile, index) => (
							<li key={index}>
								<a
									href={`/profile/${profile.pid}`}
									target="_blank"
									title={`${profile.userName}`}
									key={index}
									rel="noopener noreferrer"
								>
									<div className="mobile-personal-information-similar-small-business-card">
										<Image
											src={
												(profile.avatarFileUrls &&
													profile.avatarFileUrls.w600) ||
												avatarDef
											}
											alt={profile.userName}
											width={50}
											height={50}
										/>
										<div className="mobile-personal-information-similar-small-business-card-content">
											<div className="mobile-personal-information-similar-userName">
												{profile.userName}
											</div>
											<div className="mobile-personal-information-similar-jobTitle">
												{profile.title}
											</div>
										</div>
									</div>
								</a>
							</li>
						))}
					</ul>
				</div>
			</Fragment>
		);
	};

	render() {
		const { data, height, visitCountData } = this.props;
		const targetUserInfo = data.basic;
		const targetPid = data.pid;

		if (!data) {
			return (
				<div
					className="mobile-personal-information-main"
					style={{ minHeight: height }}
				>
					<div className="mobile-personal-information-center">
						<Loading />
					</div>
				</div>
			);
		}

		return (
			<div className="mobile-personal-information-main">
				<div className="mobile-personal-information-small-business-card">
					<Image
						src={
							(targetUserInfo.avatarFileUrls &&
								(targetUserInfo.avatarFileUrls.avatarWeb ||
									targetUserInfo.avatarFileUrls.w600)) ||
							avatarDef
						}
						alt={targetUserInfo.userName}
						width={70}
						height={70}
					/>
					<div className="mobile-personal-information-small-business-card-content">
						<div className="mobile-personal-information-name">
							{targetUserInfo.userName}
						</div>
						<div className="mobile-personal-information-jobTitle">
							{targetUserInfo.title}
						</div>
						<div className="mobile-personal-information-contact">
							<span>
								<i className="icon-eye" /> {visitCountData.visitCount || 0}
							</span>{' '}
							{/* 檔案檢視數 */}
							{/* <span><i className="icon-user" /> 240</span> 關注數 */}
							<span>
								<i className="icon-bookmark" />{' '}
								{visitCountData.collectedCount || 0}
							</span>{' '}
							{/* 收藏數 */}
						</div>
					</div>
				</div>
				<div className="mobile-personal-information-attention">
					{this.renderAttention()}
				</div>
				{/* <Flag name="plusVIP"> */}
				{plusVIPList.includes(targetPid) && (
					<Fragment>
						<hr />
						<div className="mobile-personal-information-plus">
							<img src={plusVIPImg} alt="年度職人" />
							<div className="mobile-personal-information-plus__info">
								<p className="mobile-personal-information-plus__title">
									年度職人
								</p>
								<p className="mobile-personal-information-plus__analytics">
									32 篇職人觀點 | 275 個社群肯定
								</p>{' '}
								{/* TODO: 待職人網上線後，需要打 API 得到這兩個欄位資料 */}
							</div>
							<a
								href="https://plus.104.com.tw/authors/1780333/" // TODO: 待職人網上線後，換成該檔案的 pid
								target="_blank"
								rel="noopener noreferrer"
								className="mobile-personal-information-plus__action"
							>
								前往職人觀點
								<Icon type="right" />
							</a>
						</div>
						<div className="mobile-personal-information-plus__tagDiv">
							<span className="mobile-personal-information-plus__tag">
								數據追蹤
							</span>
							<span className="mobile-personal-information-plus__tag">
								數據分析
							</span>
							<span className="mobile-personal-information-plus__tag">
								網頁技術
							</span>
							<span className="mobile-personal-information-plus__tag">
								創新能力
							</span>
							<span className="mobile-personal-information-plus__tag">
								軟體開發
							</span>
							{!this.state.plusTagMore && (
								<span
									className="mobile-personal-information-plus__more"
									onClick={this.plusTagMore}
								>
									更多...
								</span>
							)}
							{this.state.plusTagMore && (
								<Fragment>
									<span className="mobile-personal-information-plus__tag">
										GTM
									</span>
									<span className="mobile-personal-information-plus__tag">
										SEO
									</span>
									<span className="mobile-personal-information-plus__tag">
										追求卓越
									</span>
									<span className="mobile-personal-information-plus__tag">
										多媒體設計
									</span>
									<span className="mobile-personal-information-plus__tag">
										網路技術
									</span>
									<span className="mobile-personal-information-plus__tag">
										認真負責
									</span>
									<span className="mobile-personal-information-plus__tag">
										溝通能力
									</span>
									<span className="mobile-personal-information-plus__tag">
										html
									</span>
									<span className="mobile-personal-information-plus__tag">
										程式設計
									</span>
									<span className="mobile-personal-information-plus__tag">
										jquery
									</span>
									<span className="mobile-personal-information-plus__tag">
										通訊傳輸
									</span>
									<span className="mobile-personal-information-plus__tag">
										網路安全
									</span>
								</Fragment>
							)}
						</div>
					</Fragment>
				)}
				{/* </Flag> */}
				<hr />
				<div className="mobile-personal-information-similar">
					{this.renderProfileList()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.get('user'),
	similarList: state.getIn(['profile', 'similar']),
	featuredList: state.getIn(['profile', 'featured']),
	similarStatus: state.getIn(['ui', 'profile', 'similar', 'status']),
	featuredStatus: state.getIn(['ui', 'profile', 'featured', 'status']),
	process: state.getIn(['process']),
});

export default compose(
	connect(
		mapStateToProps,
		{
			requestFetchSimilarProfileList,
			requestFetchFeaturedProfileList,
			addCollection,
			cancelCollection,
		}
	)
)(MobilePersonalInformation);
