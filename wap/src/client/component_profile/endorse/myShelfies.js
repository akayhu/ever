import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';

class MyShelfies extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mouseOver: false
		};
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleUserClick = this.handleUserClick.bind(this);
	}
	handleMouseOver() {
		this.setState({
			mouseOver: true
		});
	}
	handleMouseOut() {
		this.setState({
			mouseOver: false
		});
	}
	handleUserClick() {
		let { endorsed } = this.props;
		if (endorsed) {
			this.props.handleDeleteEndorseForUser();
		} else {
			this.props.handleAddEndorseForUser();
		}
		endorsed = !endorsed;
	}
	render() {
		const { endorsed } = this.props;
		return (
			<div
				styleName="my_shelfies"
				onMouseEnter={ this.handleMouseOver }
				onMouseLeave={ this.handleMouseOut }
				onClick={ this.handleUserClick }
				style={ endorsed
					?	this.state.mouseOver
						? {background: '#333'}
						:	{background: 'none'}
					: {background: '#333'}
				}
			>
				{ this.state.mouseOver &&
					<i className={ `icon ${endorsed ? 'minus' : 'plus'}` } />
				}
				{	endorsed
					? this.state.mouseOver
						&& <i className={ 'icon minus' } data-gtm-profile="收回肯定" />
					: <i className={ 'icon plus' } data-gtm-profile="給予肯定" />
				}
				<img
					src={ this.props.selfImg }
					style={ endorsed
						?	this.state.mouseOver
							? {opacity: 0.6}
							:	{opacity: 1}
					 	: {opacity: 0.6}
					}
				/>
			</div>
		);
	}
}

MyShelfies.propTypes = {
	endorsed: PropTypes.bool,
	handleAddEndorseForUser: PropTypes.func,
	handleDeleteEndorseForUser: PropTypes.func
};

export default (CSSModules(MyShelfies, css, {allowMultiple: true}));
