import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import Layer from 'src/client/components/layer';

// announcement_data 資料位置：//static.104.com.tw/plus/js/announcementContent.js

class Announcement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			announcementData: '',
			announcementLightboxContent: '',
			isShowAll: false,
		};
		this.handelShowAllDataLayer = this.handelShowAllDataLayer.bind(this);
		this.handelShowDataLayer = this.handelShowDataLayer.bind(this);
	}
	componentDidMount() {
		if (window.announcement_data) {
			this.setState({
				announcementData: window.announcement_data,
			});
		}
	}
	handelShowDataLayer(value, content) {
		this.setState({
			isShowAll: value,
			announcementLightboxContent: content,
		});
	}
	handelShowAllDataLayer(value) {
		this.setState({
			isShowAll: value,
		});
	}
	render() {
		const { announcementData, announcementLightboxContent, isShowAll } = this.state;
		return (
			<div styleName="announcement_bg" id="announcement">
				{
					announcementData &&
					announcementData.map(item => (
						<div styleName="announcement_text">
							<span dangerouslySetInnerHTML={{ __html: item.title }}></span>
							{
								item.openLightbox &&
								<span styleName="layer_close" onClick={ () => this.handelShowDataLayer(true, item.content) }>{ item.openLightboxTitle }</span>
							}
						</div>
					))
				}
				<Layer
					backBtnText="網站公告"
					open={ isShowAll }
					onRequestClose={ this.handelShowAllDataLayer }
				>
					<div styleName="lightbox_fontSize" dangerouslySetInnerHTML={ {__html: announcementLightboxContent} } />
				</Layer>
			</div>
		);
	}
}

export default compose([CSSModules, '_', css])(Announcement);
