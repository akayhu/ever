import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
// import { LightBox } from 'c_wap_module';
// import RecentAriticleLightBox from './recentArticleLightBox';
import { activityLightboxClose, activityLightboxOpen } from 'src/client/actions/activity';
import DOMPurify from 'dompurify';
import compose from 'src/util/compose';

class RecentArticleList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lightboxOpen: false,
			previewImgStatus: false,
			previewImgUrl: '',
		};
	}
	componentWillMount() {
		const result = previewImg(this.props.itemData.extraInfo.attachmentList);
		if (result.status) {
			this.setState({ previewImgStatus: result.status, previewImgUrl: result.url });
		}
	}
	componentDidMount() {

	}
	lightboxOpen() {
		const { isLogin } = this.props.user;
		if (isLogin) {
			this.props.activityLightboxOpen(this.props.itemData);
		} else {
			location.href = `/activity/${this.props.itemData.aid}`;
		}
	}

	textNumberFilter(string, length){
		if( string.length > length ) return string.substring(0, length) + '...';
		else return string;
	}

	render() {
		const { itemData } = this.props;
		// channelInfo.type類型 - 7:私人社團 8:公開社團 10:媒體頻道
		const iConClassName = (itemData.channelInfo && itemData.channelInfo.type === 7) ? 'protect icon' : privacySettingIcon(itemData.privacySetting);
		return (
			<li>
				<a onClick={ this.lightboxOpen.bind(this) } href='javascript:;' className="h4" data-gtm-profile-social="最新文章 - 開啟">{ itemData.title }</a>
				<span styleName="dropDown">
					<i className={ iConClassName } />
				</span>
				<div className="body_text" styleName="recent_article_content">
					<div styleName="recent_article_overflow">
						{
							this.state.previewImgStatus &&
								<a><img src={ this.state.previewImgUrl } /></a>
						}
						{
							this.textNumberFilter(DOMPurify.sanitize(this.props.itemData.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true }), 50)
						}
					</div>
					<div styleName="recent_article_tool">
						<ul>
							{
								itemData.likeCount > 0 &&
								<li>酷 &nbsp;&nbsp;
									{
										(itemData.likeCount <= 100) ? itemData.likeCount : '99+'
									}
								</li>
							}
							{
								itemData.endorseCount > 0 &&
								<li>肯定
									{
										(itemData.endorseCount <= 100) ?	itemData.endorseCount : '99+'
									}
								</li>
							}
							{
								itemData.commentCount > 0 &&
								<li>留言
									{
										(itemData.commentCount <= 100)	? itemData.commentCount : '99+'
									}
								</li>
							}
							{
								itemData.collectCount > 0 &&
								<li>收藏
									{
										(itemData.collectCount <= 100)	? itemData.collectCount : '99+'
									}
								</li>
							}
						</ul>
					</div>
				</div>
			</li>
		);
	}
}

function privacySettingIcon(privacySetting) {
	switch (privacySetting) {
		case 0:
			return 'world icon';
		case 1:
			return 'friends icon';
		case 2:
			return 'lock icon';
		default:
			return 'world icon';
	}
}

function previewImg(attachmentList) {
	const result = {
		status: false,
		url: ''
	};
	if (attachmentList.length !== 0) {
		attachmentList.forEach((obj) => {
			if (obj.contentType === 2 && obj.activityFileUrl !== null) {
				result.status = true;
				result.url = obj.activityFileUrl;
				return false;
			}
		});
	}
	return result;
}

export default compose(
	connect(null, { activityLightboxClose, activityLightboxOpen }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(RecentArticleList);
