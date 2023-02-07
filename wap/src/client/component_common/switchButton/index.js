import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';


class SwitchButton extends Component {

	constructor(props, context) {
		super(props, context);
	}
	render() {
		let id;
		let	label;
		const	labelRight = this.props.labelRight;

		if (this.props.id === '' && this.props.name !== '') {
			id = this.props.name;
		}

		return (
			<div styleName="switch">
				<span styleName={ this.props.checked ? '' : 'active' } ref="closed">只限本人</span>
				<div className={ this.props.theme } styleName="switch-button switch-button-flat-round">
					{
					this.props.defaultChecked &&
					<input
						onChange={ this.props.onChange }
						defaultChecked={ this.props.defaultChecked || false }
						id={ id }
						name={ this.props.name }
						type="checkbox"
						value="1"
					/>
				}
					{
					!this.props.defaultChecked &&
					<input
						onChange={ this.props.onChange }
						checked={ this.props.checked }
						id={ id }
						name={ this.props.name }
						type="checkbox"
						value="1"
					/>
				}

					<label htmlFor={ id } data-gtm-privacy-switch={ this.props.checked ? 'close' : 'open' }>{labelRight}</label>
				</div>
				<span styleName={ this.props.checked ? 'active' : '' } ref="open">公開</span>
			</div>
		);
	}
}

SwitchButton.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	title: PropTypes.string,
	label: PropTypes.string,
	labelRight: PropTypes.string,
	defaultChecked: PropTypes.string,
	theme: PropTypes.string,
	checked: PropTypes.string,
	onChange: PropTypes.func
};
SwitchButton.defaultProps = {
	id: '',
	name: 'switch-button',
	title: '',
	label: '',
	labelRight: '',
	defaultChecked: '',
	theme: '',
	checked: null
};
const SwitchButtonCss = CSSModules(SwitchButton, css, { allowMultiple: true });

export default SwitchButtonCss;
