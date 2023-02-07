import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import update from 'react-addons-update';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Carousel from './carousel';
import PickerList from 'src/client/component_common/pickerList';
import PersonalInfoComponentTitle from 'src/client/component_profile/title/personalInfo';
import { loadProfile } from 'src/client/actions/profile';
import { LightBox } from 'c_wap_module';
import ActivityEditor from 'src/client/component_activities/module/Editor';
import {
	getPersonalWall,
	loadProfileGallery,
	loadProfileGallerySort,
	updateGallerySort,
} from 'src/client/actions/activity';
import clientConfig from 'src/configs/client';
import compose from 'src/util/compose';

// selector
import { getActivitiesByType } from 'src/client/reducers/selectors';


// this.props.loadProfile({pid: this.props.user.pid});
// this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.params.pid});
// import $ from "jquery";

class Gallery extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			carouselIndex: 0,
			lightboxShow: false,
			// moreLoading: false,
			// allLoading: false,
			// gallery: {},
			gallerySortData: [],
			openCreateGallery: false
		};
		this.havaReload = false;
		// this.openEditor = this.openEditor.bind(this);
		this.getCarouselIndex = this.getCarouselIndex.bind(this);
		this.setCarouselIndex = this.setCarouselIndex.bind(this);
		this.setGallerySortList = this.setGallerySortList.bind(this);
		this.saveGallerySortList = this.saveGallerySortList.bind(this);
		this.more = this.more.bind(this);
	}
	componentDidMount() {

		// $.post(
		// 	'https://hooks.slack.com/services/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',
		// 	'payload={"channel": "#bigc-dev", "username": "webhookbot", "text": "'+JSON.stringify({"test":{"msg":"This is posted to #doc_api and comes from a bot named webhookbot."}})+'", "icon_emoji": ":ghost:"}'
		// );


		// this.refs.gallery_edit_main.scrollIntoView(); // TODO some action trigger scrollIntoView
		this.more();
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.galleryActivityList !== nextProps.galleryActivityList) {
			// 不等於時開起置頂sort必須要reload才能取得剛新增的activtiy
			this.havaReload = true;
		};	
	}
	more() {
		this.props.getPersonalWall('GALLERY', {targetPid: this.props.params.pid});
	}

	// componentWillReceiveProps(nextProps) {

	// 	/**
	// 	 * 當刪除掉最後一個作品之後去重新load profile state的資料
	// 	 * 讓新增按鈕跑出來
	// 	 * 這邊理論上要做在Reducer上面，但Delete Gallery好像沒有獨立的reducer在處理
	// 	 * 因此因應上線時間先做在compoennt上
	// 	 */

	// 	const thisGalleryLength = this.props.activity.personalStream.GALLERY[this.props.params.pid].dataList.length;
	// 	const nextGalleryLength = nextProps.activity.personalStream.GALLERY[nextProps.params.pid].dataList.length;
	// 	if( thisGalleryLength !== nextGalleryLength && nextGalleryLength === 0 ) {
	// 		this.props.loadProfile({pid: this.props.user.pid});
	// 	}
	// }

	getCarouselIndex() {
		return this.state.carouselIndex;
	}
	setCarouselIndex(aid) {
		this.setState({
			carouselIndex : aid
		});
	}
	jumpto(aid) {
		this.setState({
			carouselIndex : aid
		});
	}
	setGallerySortList(e) {
		this.setState({
			gallerySortData: e.top
		});
	}
	saveGallerySortList() {
		let newJsonArray = this.state.gallerySortData.reduce((newArray, item, key) => {
			newArray[item.sortIndex] = item.galleryId;
			return newArray;
		}, {});

		this.props.updateGallerySort(newJsonArray).then(() => {
			this.hideSortLightbox();
		});
	}
	showAddGalleryLightbox() {
		this.setState({
			openCreateGallery: true
		});
	}
	hideAddGalleryLightbox() {
		this.setState({
			openCreateGallery: false
		});
	}
	showSortLightbox() {
		this.props.loadProfileGallerySort(this.havaReload).then(() => {
			this.havaReload = false;
			this.setState({
				lightboxShow: true
			});
		});
	}
	hideSortLightbox() {
		this.setState({
			lightboxShow: false,
			gallerySortData: []
		});
	}
	imgOnError(error) {
		error.target.src = `${clientConfig.params.staticWapUrl}/images/common/icon_doc.png`;
	}
	render() {
		const { galleryActivityList } = this.props;
		const lightboxOption = {
			submit: {
				text: '儲存',
				action: this.saveGallerySortList
			},
			cancel: {
				text: '取消'
			},
			closeIcon: true,
			contentHeight: '500px',
			title: '置頂展示作品'
		};

		if( !this.props.activity.personalStream.GALLERY[this.props.params.pid] || galleryActivityList.length <= 0 ) return null;

		return (
			<div ref="gallery_edit_main">
				<div styleName="gallery">
					{
						galleryActivityList.length > 0 && this.props.activity.personalStream.GALLERY[this.props.params.pid].loading &&
						<div styleName="all_loading_cover">
							<div className="ui loading"></div>
						</div>
					}
					<div styleName="gallery_container">
						
						{
							galleryActivityList && galleryActivityList.length > 0 &&
								<div>
									<PersonalInfoComponentTitle
										ontopButton={ this.props.viewas === 'self' }
										ontopButtonLoading={ this.props.activity.gallerysort.loading }
										// createButton={ this.props.viewas === 'self' }
										maintitle="展示櫥窗"
										ontopBtnClick={ this.showSortLightbox.bind(this) }
										privacy={ this.props.privacy }
										privacyText="gallery"
										textAlign="left"
										addBtnClick={ this.showAddGalleryLightbox.bind(this) }
										gtmTopValue="置頂作品"
										gtmValue="新增作品"
									/>
									<Carousel
										items={ galleryActivityList }
										getCarouselIndex={ this.getCarouselIndex }
										setCarouselIndex={ this.setCarouselIndex }
										params={ this.props.params }
										carouselIndex={ this.state.carouselIndex }
									/>
									<ul styleName="gallery_items">
										{
											galleryActivityList.map((activity, key) => {
												let imgUrl = null;
												let contentType = 1;

												if (activity && typeof activity.extraInfo !== 'undefined' && typeof activity.extraInfo.attachmentList[0] !== 'undefined') {
													const attach = activity.extraInfo.attachmentList[0];
													contentType = attach.contentType;

													// contentType===5 audio, else document,text
													if (attach.contentType === 2 || attach.contentType === 3 || contentType === 4) {
														imgUrl = activity.extraInfo.attachmentList[0].activityFileUrl || `${clientConfig.params.staticWapUrl}/images/common/icon_doc.png`;
													}
												}

												return (
													<li
														key={ activity.aid }
														styleName={ "list_div " + (this.state.carouselIndex === activity.aid ? "active": "") }
														onClick={ this.jumpto.bind(this, activity.aid) }
													>
														{
															(contentType === 2 || contentType === 3 || contentType === 4) &&
															<img onError={ this.imgOnError.bind(null) } styleName="list_item" src={ imgUrl } />
														}
														{
															(contentType === 1 || contentType === 6) &&
															<img src={ `${clientConfig.params.staticWapUrl}/images/common/icon_doc.png` } style={ { height: '100%' } } />
														}
														{
															(contentType === 5) &&
															<img src={ `${clientConfig.params.staticWapUrl}/images/common/icon_voice.png` } style={ { height: '100%' } } />
														}
													</li>
												)
											})
										}
										{
											!this.props.activity.personalStream.GALLERY[this.props.params.pid].end &&
											<div styleName="more">
												<a onClick={ this.more }>展開更多，還有
													{
														this.props.activity.personalStream.GALLERY[this.props.params.pid].loading &&
														<div styleName="loading_cover">
															<div className="ui loading"></div>
														</div>
													}
													{
														this.props.activity.personalStream.GALLERY[this.props.params.pid]
														? this.props.activity.personalStream.GALLERY[this.props.params.pid].total - galleryActivityList.length
														: 0
													}
													筆
												</a>
											</div>
										}
									</ul>
								</div>
						}
					</div>
				</div>
				{
					this.state.lightboxShow &&
					<LightBox option={ lightboxOption } onClose={ this.hideSortLightbox.bind(this) } >
						<PickerList
							items={ this.props.activity.gallerysort }
							GetFunction={ this.setGallerySortList }
							availableItems="請點擊要置頂的作品"
							selectedItems="已經置頂的作品"
							maxAmounts={ 10 }
						/>
						{
							this.props.activity.gallerysort.loading &&
							<div className="ui loading" />
						}
					</LightBox>
				}
				{
					this.state.openCreateGallery &&
					<ActivityEditor
						close={ this.hideAddGalleryLightbox.bind(this) }
						itemData={ null }
						galleryMode
					/>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		galleryActivityList: getActivitiesByType(state, 'GALLERY')
	};
}

Gallery.propTypes = {
	// profile: PropTypes.object,
	user: PropTypes.object,
	getCarouselIndex: PropTypes.func,
	getGallerySortList: PropTypes.func,
	saveGallerySortList: PropTypes.func,
	viewas: PropTypes.string,
};

const action = { loadProfileGallery, loadProfileGallerySort, updateGallerySort, getPersonalWall, loadProfile };
export default compose(
	connect(mapStateToProps, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Gallery);
