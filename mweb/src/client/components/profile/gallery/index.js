import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { has } from 'lodash/object';
import {isEqual} from 'lodash/lang';
import FullScreen from 'src/client/components/fullScreen';
import Layer from 'src/client/components/layer';
import ActivityMaster from 'src/client/components/activity/module/master';
// actions
import { layerActivityOpen, layerActivityClose } from 'src/client/actions/activity';

class Gallery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceWidth: 0,
			showFullScreen: false,
			showIndex: 0,
		};
		
		this.no = new Date().getTime();
		this.handleResize = this.handleResize.bind(this);
	}
	componentDidMount() {
		var timer = setInterval(() => {
			if(this.gallery){
				clearInterval(timer);
				this.handleResize();
			}
		}, 100);
		
		window.addEventListener('resize', () => {
			this.handleResize
		});
	}
	handleResize() {
		if(this.gallery){
			// console.log(this.no);
			this.setState({
				deviceWidth: this.gallery.offsetWidth,
			});
		}
	}
	handleShowFullScreen(value, index) {
		this.setState({
			showFullScreen: value,
			showIndex: index,
		});
	}
	shouldComponentUpdate(nextProps, nextState) {
		const nextGallery = nextProps.gallery;
		const oldGallery = this.props.gallery;
		const oldState = this.state;
		if (this.props.layerActivity !== nextProps.layerActivity) return true;
		if (this.props.activitiesPool !== nextProps.activitiesPool) return true;
		if (!isEqual(nextState, oldState)) return true;
		if (oldGallery.loading !== nextGallery.loading) return true;
		if (oldGallery.dataList.length !== nextGallery.dataList.length) return true;
		if (oldGallery.dataList.length > 0 && nextGallery.dataList.length > 0) {
			return oldGallery.dataList[0].aid !== nextGallery.dataList[0].aid;
		}
		return false;
	}
	handleShowActivity(aid) {
		this.props.layerActivityOpen({
			aid,
			from: '展示櫥窗',
		});
	}
	render() {
		if (!this.props.gallery || Object.keys(this.props.gallery).length === 0) return null;
		const { user, activitiesPool, layerActivity, layerActivityClose } = this.props;
		const width = this.state.deviceWidth - ((this.state.deviceWidth * 2) / 5);
		const height = (width * 2) / 3;
		const galleryBlockStyle = {
			maxWidth: `${width}px`,
			minWidth: `${width}px`,
		};
		const galleryImgSectionStyle = {
			minHeight: `${height}px`,
		};
		return (
			<div
				styleName="gallery"
				ref={ i => (this.gallery = i) }
			>
				<span styleName="title">展示櫥窗</span>
				<div styleName="scroll_section">
					{
						this.props.gallery.dataList.map((item, index) => {
							if (!has(item.extraInfo.attachmentList[0], 'activityFileUrl')) return null;
							return (
								<div
									key={ `gallery${item.aid}` }
									styleName="galleryBlock"
									style={ galleryBlockStyle }
									// onClick={ this.handleShowFullScreen.bind(this, true, index) }
									onClick={ this.handleShowActivity.bind(this, item.aid) }
								>
									<div
										styleName="img_section"
										style={ galleryImgSectionStyle }
									>
										<img src={ item.extraInfo.attachmentList[0].activityFileUrl } style={ { maxHeight: `${height}px` } } />
									</div>
									<div styleName="sub_title_section">
										<div>{ item.title }</div>
									</div>
								</div>
							);
						})
					}
				</div>
				{
					this.state.showFullScreen &&
					<FullScreen
						dataList={ this.props.gallery.dataList }
						showIndex={ this.state.showIndex }
						handleShowFullScreen={ this.handleShowFullScreen.bind(this) }
					/>
				}
				<Layer
					backBtnText={ layerActivity.from }
					open={ layerActivity.isShow }
					onRequestClose={ layerActivityClose }
				>
					<ActivityMaster
						user={ user }
						aid={layerActivity.aid}
						itemData={ activitiesPool[layerActivity.aid] }
					/>
				</Layer>
			</div>
		);
	}
}

export default compose(
	connect(null, { layerActivityOpen, layerActivityClose }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(Gallery);