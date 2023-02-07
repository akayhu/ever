import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import MBeAGiverMainCom from 'src/client/components/beagiver/main';

class MBeAgiverMain extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div styleName="main_giver">
				<div styleName="banner_giver" data-gtm-giver="最新動態-活動大圖">
					<iframe
						src={ 'https://www.youtube.com/embed/fcWg_RA3rjs?autoplay=1' }
						frameBorder="0"
						allowFullScreen
					/>
					{/*圖片<img src='./main_pic.jpg'/>*/}
				</div>
				<MBeAGiverMainCom />
			</div>
		);
	}
}

export default CSSModules(MBeAgiverMain, css, {allowMultiple: true});
