import React from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import DOMPurify from 'dompurify';
import clientConfig from 'src/configs/client';
import compose from 'src/util/compose';
import { activityLightboxOpen/*, activityLightboxClose*/ } from 'src/client/actions/activity';

function setPrivacyIcon(setting) {
	switch (setting) {
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

class Carousel extends React.Component {
	constructor(props, context){
		super(props, context);
		
		// this.state = {
			// startItem: 0,
			// position: 0,
			// currentItem: 0,
			// prevItem: null
			// currentIndex: 0
		// };
		// 
		this.currentIndex = 0;
	}
	componentWillMount() {
		const carouselIndex = this.props.getCarouselIndex();
		
		if(!carouselIndex){
			this.props.setCarouselIndex(this.props.items[0].aid);
		}
	}
	componentWillReceiveProps(nextProps) {
		if(this.props.params.pid !== nextProps.params.pid){
			this.currentIndex = 0;
		}
		if(nextProps.items !== this.props.items) {
			if(!this.checkExit(nextProps.items, this.props.getCarouselIndex() )){
				this.props.setCarouselIndex(nextProps.items[0].aid);
			}
		}
	}
	swap(action) {
		if(action === 'left'){
			if(this.currentIndex - 1 < 0){
				this.currentIndex = this.props.items.length - 1;
			}else {
				this.currentIndex -= 1;
			}
		}else if(action === 'right'){
			if(this.currentIndex + 1 > this.props.items.length - 1){
				this.currentIndex = 0;
			}else {
				this.currentIndex += 1;
			}
		}
		
		this.props.setCarouselIndex(this.props.items[this.currentIndex].aid);
	}
	lightboxOpen(itemData) {
		this.props.activityLightboxOpen(itemData);
	}
	imgOnError(e) {
		e.target.src = clientConfig.params.staticWapUrl+'/images/common/icon_doc.png';
	}
	checkExit(data, key) {

		var check = false;
		for( let i=0; i<data.length; i++ ) {
			if( data[i].aid == key ) check = true;
		}

		return check;
	}
	render() {
		const carouselIndex = this.props.getCarouselIndex();
		
		if(!carouselIndex){
			return null;
		}

		return (
			<div styleName="carousel">
				<i onClick={ this.swap.bind(this, 'left') } className="angle left icon" styleName="left" ></i>
				<i onClick={ this.swap.bind(this, 'right') } className="angle right icon" styleName="right" ></i>
				<ul>
					{
						this.props.items.map((activity, key) => {
							let posStyleName = " back_pos";
							let imgUrl = null;
							let contentType = 1;
							
							if (activity.aid === carouselIndex) {
								posStyleName = " main_pos";
								this.currentIndex = key;
							}
							
							if (typeof activity.extraInfo !== 'undefined' && typeof activity.extraInfo.attachmentList[0] !== 'undefined' ) {
								let attach = activity.extraInfo.attachmentList[0];
								contentType = attach.contentType;

								// contentType===5 audio, else document,text
								if (attach.contentType === 2 || attach.contentType === 3 || contentType === 4) {
									imgUrl = activity.extraInfo.attachmentList[0].activityFileUrl || clientConfig.params.staticWapUrl+'/images/common/icon_doc.png';
								}
							}

							return(
								<li key={ activity.aid } ref={ "carousel_item_" + activity.aid } styleName={ "items" + posStyleName } data-file-id={ activity.aid }>
									<div styleName="image_div" onClick={this.lightboxOpen.bind(this, activity)}>
										{
											(contentType === 2 || contentType === 3 || contentType === 4) &&
											<img onError={this.imgOnError.bind(this)}  src={ imgUrl } data-gtm-profile="開啟作品" />
										}
										{
											(contentType === 1 || contentType === 6) &&
											<div styleName="fake_text">
												{
													DOMPurify.sanitize(activity.content,{ ALLOWED_TAGS: [], KEEP_CONTENT: true })
												}
												<img src={`${clientConfig.params.staticWapUrl}/images/common/icon_doc.png`} data-gtm-profile="開啟作品" />
											</div>
										}
										{
											(contentType === 5) &&
											<div styleName="fake_text">
												{
													DOMPurify.sanitize(activity.content,{ ALLOWED_TAGS: [], KEEP_CONTENT: true })
												}
												<img src={`${clientConfig.params.staticWapUrl}/images/common/icon_voice.png`} data-gtm-profile="開啟作品" />
											</div>
										}
									</div>
									<div styleName="desc" className="h5">
										<div styleName="content">
											<span>{ activity.title }</span>
											<i className={setPrivacyIcon(activity.privacySetting)}></i>
										</div>
										{
											activity.likeCount > 0 &&
											<span>酷<span styleName="counts">{ activity.likeCount > 1000 ? '999+' : activity.likeCount }</span>　</span>
										}
										{
											activity.commentCount > 0 &&
											<span>留言<span styleName="counts">{ activity.commentCount > 1000 ? '999+' : activity.commentCount }</span>　</span>
										}
										{
											activity.endorseCount > 0 &&
											<span>肯定<span styleName="counts">{ activity.endorseCount > 1000 ? '999+' : activity.endorseCount }</span>　</span>
										}
										{
											activity.collectCount > 0 &&
											<span>收藏<span styleName="counts">{ activity.collectCount > 1000 ? '999+' : activity.collectCount }</span></span>
										}
										<span>&nbsp;</span>
									</div>
								</li>
								)
						})
					}
				</ul>
			</div>
		);
	}
}

export default compose(
	connect(null, { activityLightboxOpen/*, activityLightboxClose*/ }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Carousel);
