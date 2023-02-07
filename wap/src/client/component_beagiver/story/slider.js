import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import SliderItem from './sliderItem';
import SliderDots from './sliderDots';
import SliderArrows from './sliderArrows';

class Slider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nowLocal: 0,
		};
	}
	componentDidMount() {
		this.goPlay();
	}
	/* 向前向後多少 */
	turn(n) {
		let _n = this.state.nowLocal + n;
		if (_n < 0) {
			_n += this.props.items.length;
		}
		if (_n >= this.props.items.length) {
			_n -= this.props.items.length;
		}
		this.setState({nowLocal: _n});
	}
	/* 開始自動輪播 */
	goPlay() {
		if (this.props.autoplay) {
			this.autoPlayFlag = setInterval(() => {
				this.turn(1);
			}, this.props.delay * 3000);
		}
	}
	/* 暫停自動輪播 */
	pausePlay() {
		clearInterval(this.autoPlayFlag);
	}
	render() {
		const count = this.props.items.length;
		const itemNodes = this.props.items.map((item, idx) => <SliderItem item={ item } count={ count } key={ `item${idx}` } />);
		const arrowsNode = <SliderArrows turn={ this.turn.bind(this) } />;
		const dotsNode = <SliderDots turn={ this.turn.bind(this) } count={ count } nowLocal={ this.state.nowLocal } />;
		return (
			<div
				styleName="slider"
				onMouseOver={ this.props.pause ? this.pausePlay.bind(this) : null }
				onMouseOut={ this.props.pause ? this.goPlay.bind(this) : null }
			>
				<ul
					style={ {
						left: `${-100 * this.state.nowLocal}%`,
						transitionDuration: `${this.props.speed}s`,
						width: `${this.props.items.length * 100}%`
					} }
				>
					{ itemNodes }
				</ul>
				{ this.props.arrows ? arrowsNode : null }
				{ this.props.dots ? dotsNode : null }
			</div>
		);
	}
}

Slider.defaultProps = {
	speed: 1, /* 是圖片切換的時候的速度時間，需要配置一個 number 類型的數據，決定時間是幾秒 */
	delay: 2, /* 是在需要自動輪播的時候，每張圖片停留的時間，一個 number 值 */
	pause: true, /* 是在需要自動輪播的時候，鼠標停留在圖片上，是否暫停輪播，是一個布爾值 */
	autoplay: true, /* 是配置是否需要自動輪播，是一個布爾值 */
	dots: true, /* 是配置是否需要輪播下面的小點 */
	arrows: true, /* 是配置是否需要輪播的前後箭頭 */
	items: []
};

Slider.autoPlayFlag = null;

export default CSSModules(Slider, css, {allowMultiple: true});
