import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import cx from 'classnames';
import css from './index.css';
// actions
import { activityEventLog } from 'src/client/actions/activity/activity_log.js';

function getStyleName(state, props) {
	const isCommentMode = props.mode === 'comment';
	const isChecked = state.checked;
	return cx({
		checked: isChecked,
		for_comment: isCommentMode,
		for_activity: !isCommentMode,
	});
}

class BaseBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: props.checked,
		};

		this.onHandleClick = this.onHandleClick.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.checked !== this.props.checked) {
			this.setState({checked: nextProps.checked});
		}
	}
	shouldComponentUpdate(nextProps) {
		if (nextProps.checked !== this.props.checked) {
			return true;
		}
		return false;
	}

	onHandleClick() {
		const {checked} = this.state;
		const {clickHandler, params, data, event, filter, pageName, pid } = this.props;
		const eventLog = { pid: pid, page: pageName ? pageName : '', filter: filter ? filter : '', event: event ? event : '' }
		clickHandler(!checked, params);
		this.setState({checked: !checked});
		if( !checked ){
			activityEventLog( data, eventLog );
		}
	}
	render() {
		const {gtmName} = this.props;
		return (
			<div
				styleName={ getStyleName(this.state, this.props) }
				onClick={ this.onHandleClick }
				data-gtm-activity={ gtmName }
			>
				{this.props.children}
			</div>
		);
	}
}

export default CSSModules(BaseBtn, css, {allowMultiple: true});
