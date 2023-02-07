import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { delay } from 'lodash/function';
import css from './index.css';

class Hover extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCompStyle: 'will_show_box_top',
			getData: false,
			data: {}
		};
		this.hovered = false;
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	componentDidMount() {
		this.detectMargin();
	}
	detectMargin() {
		if (!this.hoverTarget || (this.hoverTarget && !this.hoverTarget.getElementsByTagName)) return;
		const { cardWidth } = this.props;
		const hoverImg = this.hoverTarget.getElementsByTagName('img')[0];

		if (document) {
			const viewWidth = document.documentElement.offsetWidth;
			const { right } = this.hoverBox.getBoundingClientRect();
			// 右邊剩餘寬度是否小於小名片寬度
			if (viewWidth - right < cardWidth) {
				this.hoverWillShow.classList.add(css.left_mode);
			} else if (hoverImg) {
				// 若hover的目標是圖片的話要去看他的大小
				if (hoverImg.clientWidth < 40) {
					this.hoverWillShow.classList.add(css.small_mode);
				}
			}
		}
	}
	handleMouseOver() {
		if (this.hovered) return;
		const { data } = this.state;
		this.hovered = true;
		this.handleCardStyle();

		delay(() => {
			if (this.hovered && !Object.keys(data).length) this.loadData();
		}, 200);
	}
	handleMouseLeave() {
		this.hovered = false;
		setTimeout(() => this.close(), 100);
	}
	handleCardStyle() {
		const {cardHeight } = this.props;
		const { top } = this.hoverBox.getBoundingClientRect();
		const cardDOM = this.hoverWillShow;
		const topStyle = css.will_show_box_top;
		const botStyle = css.will_show_box_bot;
		// show Layer
		this.layer.style.display = 'block';
		this.layer.style['z-index'] = 1;
		// modify z-index
		this.hoverBox.style['z-index'] = 4;

		if (top < cardHeight + 50) {
			this.replaceStyle(cardDOM, topStyle, botStyle);
		} else {
			this.replaceStyle(cardDOM, botStyle, topStyle);
		}
		cardDOM.classList.remove(css.hide);
	}
	replaceStyle(target, oldStyle, newStyle) {
		target.classList.remove(oldStyle);
		target.classList.add(newStyle);
	}
	close() {
		if (this.hovered) return;
		this.hoverWillShow.classList.add(css.hide);
		this.hoverBox.style['z-index'] = 0;
		this.layer.style.display = 'none';
		this.layer.style['z-index'] = 0;
	}
	clickLayer(e) {
		e.stopPropagation();
		this.hovered = false;
		this.close();
		
	}
	loadData() {
		this.hoverWillShow.classList.add(css.loading);
		this.props.hoverAct(this.props.actParams).then((res) => {
			if (!res.response.hasOwnProperty('error') && !res.response.hasOwnProperty('warn')) {
				this.setState({
					getData: true,
					data: res.response
				});
			}
			this.hoverWillShow.classList.remove(css.loading);
		});
	}
	render() {
		const { WillShow, children, comProps, pass } = this.props;
		const { getData, data } = this.state;

		if (pass) {
			return (
				<div styleName="wrap">
					<div styleName="hover_box">
						{this.props.children}
					</div>
				</div>
			);
		}

		return (
			<div styleName="wrap">
				<div styleName="layer" onClick={ this.clickLayer.bind(this) } ref={ _ref => (this.layer = _ref) } />
				<div ref={ _ref => (this.hoverBox = _ref) } styleName="hover_box">
					<div styleName="hover_target">
						{React.cloneElement(children, {
							ref: _ref => (this.hoverTarget = _ref),
							onMouseOver: this.handleMouseOver,
							onMouseLeave: this.handleMouseLeave
						})}
					</div>
					<div
						ref={ _ref => (this.hoverWillShow = _ref) }
						styleName="hide"
						onMouseOver={ this.handleMouseOver }
						onMouseLeave={ this.handleMouseLeave }
					>
						{
							getData
							? <WillShow { ...data } { ...comProps } />
							: <div className="ui loading" styleName="loading_view" />
						}
					</div>
				</div>
			</div>
		);
	}
}
Hover.defaultProps = {
	pass: false,
	cardHeight: 210,
	cardWidth: 430
};
Hover.propTypes = {
	WillShow: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.element,
		PropTypes.node
	]),
	cardHeight: PropTypes.number,
	cardWidth: PropTypes.number,
	comProps: PropTypes.object,
	pass: PropTypes.bool,
	actParams: PropTypes.object
};

export default CSSModules(Hover, css, { allowMultiple: true });
