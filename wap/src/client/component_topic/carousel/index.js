import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { activityLightboxOpen } from 'src/client/actions/activity';

class Carousel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			left: 0
		};
		this.handleNext = this.handleNext.bind(this);
		this.handlePrev = this.handlePrev.bind(this);
	}
	handleNext() {
		const {left} = this.state;
		const { data, width } = this.props;
		if (left !== -(data.length - 1) * width) {
			this.setState({
				left: left - width
			});
		} else {
			this.setState({
				left: 0
			});
		}
	}
	handlePrev() {
		const {left} = this.state;
		const { data, width } = this.props;
		if (left !== 0) {
			this.setState({
				left: left + width
			});
		} else {
			this.setState({
				left: -(data.length - 1) * width
			});
		}
	}
	render() {
		const { data, width, activityLightboxOpen } = this.props;
		return (
			<div styleName="carousel">
				<i
					className="angle left icon"
					styleName="left"
					onClick={ this.handlePrev }
				/>
				<i
					className="angle right icon"
					styleName="right"
					onClick={ this.handleNext }
				/>
				<div styleName="slide_frame">
					<ul
						style={ {
							left: this.state.left,
							width: data.length * width
						} }
					>
						{
							data.map((item, index) =>
								<li
									key={ index }
									style={ {width} }
									onClick={ () => { activityLightboxOpen(item); } }
								>
									<img
										src={ item.worksImg || '//farm8.staticflickr.com/7287/27584724615_f0a3ba24b9.jpg' }
									/>
									<div styleName="slide_main">
										<div styleName="title" className="h2">{item.title}</div>
										<span>酷 {item.likeCount}&nbsp; | &nbsp;</span>
										<span>留言 {item.commentCount}&nbsp; | &nbsp;</span>
										<span>肯定 {item.endorseCount}&nbsp; | &nbsp;</span>
										<span>收藏 {item.collectCount}</span>
									</div>
								</li>
							)
						}
					</ul>
				</div>
			</div>
		);
	}
}

Carousel.propTypes = {
	width: PropTypes.number,
	data: PropTypes.array,
};

export default compose(
	connect(null, {activityLightboxOpen}),
	[CSSModules, '_', css]
)(Carousel);
