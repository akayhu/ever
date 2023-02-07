import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// actions
import { closeWarning } from 'src/client/actions/warning';

class Alert extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { warning, closeWarning } = this.props;
		if (!warning.isShow) return null;
		setTimeout(() => {
			closeWarning();
		}, 5000);
		const text = warning.desc || '很抱歉，系統發生錯誤，請稍候再試';
		return (
			<div styleName="alert">
				<p>{ text }</p>
				<i
					className="icon close"
					onClick={ () => closeWarning() }
					style={ { cursor: 'pointer' } }
				/>
			</div>
		);
	}
}

function selector(state) {
	return {
		warning: state.warning,
	};
}

export default compose(
  connect(selector, { closeWarning }),
  [CSSModules, '_', css, { allowMultiple: true }],
)(Alert);
