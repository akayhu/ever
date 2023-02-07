import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { getAllAdvertising } from 'src/client/actions/advertising';
import css from './index.css';

// 登入後首頁上方廣告版位
class AD640pxBanner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCommercial: true
		};
		this.handleImgError = this.handleImgError.bind(this);
	}
	componentDidMount() {
		const { getAllAdvertising } = this.props;
		// 取得目前所有AD上/下檔資料:
		// key: activityBoard(登入首頁), activitySGPBoard(未登入文章)
		getAllAdvertising({
			type: 'activityBoard'
		});
	}
	handleImgError() {
		this.setState({
			showCommercial: false
		});
	}
	render() {
		const { showCommercial } = this.state;
		const { onAdList } = this.props;
		const randomValue = (onAdList.length > 0) ? Math.floor(Math.random() * onAdList.length) : 0;
		return (
			<div>
				{
					showCommercial && onAdList.length > 0 &&
					<div styleName="commercial">
						<a href={ onAdList[randomValue].link } target="_brank" title={ onAdList[randomValue].title }>
							<img
								src={ onAdList[randomValue].url }
								data-gtm-index="河道上方 - 行銷區塊"
								onError={ this.handleImgError }
								width="640"
							/>
						</a>
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		onAdList: state.advertising.onAdList
	};
}

const actions = { getAllAdvertising };

export default compose(
	connect(mapStateToProps, actions),
	// translate([]),
	[CSSModules, '_', css]
)(AD640pxBanner);
