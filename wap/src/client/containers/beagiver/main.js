import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import BeAGiverMainCom from 'src/client/component_beagiver/main';

class BeAGiverMain extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div styleName="main_giver">
				<div styleName="banner_giver" data-gtm-giver="最新動態-活動大圖">
					<iframe
						width="960"
						height="540"
						src={ 'https://www.youtube.com/embed/fcWg_RA3rjs?autoplay=1' }
						frameBorder="0"
						allowFullScreen
					/>
					{/*圖片
					<img src='./main_pic.jpg'/>
					*/}
				</div>
				<div styleName="containers_main">
					<BeAGiverMainCom />
				</div>
			</div>
		);
	}
}

export default CSSModules(BeAGiverMain, css, {allowMultiple: true});
