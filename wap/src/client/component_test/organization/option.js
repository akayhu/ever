import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

class Option extends Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div>
				<label htmlFor={ this.props.value } styleName="option">
					<input
						id={ this.props.value }
						type="checkbox"
						value={ this.props.value }
						checked={ this.props.isChecked }
						onChange={ this.props.onChange }
					/>
					<span>{this.props.text}</span>
				</label>
			</div>
		);
	}
}

export default compose(
	//connect(null, { nextPage, prevPage, readyAnswerPoAPI }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Option);;
