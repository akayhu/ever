import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from '../../../../util/compose';
import css from './style.css';
import { getIsEmptyByDomain } from '../../../reducers/navigation/selectors';
import AlertList from './alertList';

class AlertBlock extends Component {
	constructor(props) {
		super(props);
	}
	showList(error, props) {
		const { listData, userPid, contentElement, isEmpty } = props;
		if(error) {
			return ( <div styleName="error_content">發生錯誤，請稍後再試</div> );
		} else {
			return (
				<AlertList
					data={ listData }
					userPid={ userPid }
					content={ contentElement }
					isEmpty={ isEmpty }
				/>
			);
		}
	}
	render() {
		const { title, readMoreText, readMoreLink, error = false } = this.props;
		return (
			<div styleName="list_container">
				<div styleName="list_title">{ title }</div>
				{ this.showList(error, this.props) }
				<div styleName="list_read_more">
					<a href={ readMoreLink }>{ readMoreText }</a>
				</div>
			</div>
		);
	}
}

AlertBlock.propTypes = {
	title: PropTypes.string.isRequired,
	readMoreText: PropTypes.string.isRequired,
	readMoreLink: PropTypes.string.isRequired,
	userPid: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
	listData: PropTypes.arrayOf(PropTypes.any).isRequired,
	contentElement: PropTypes.node.isRequired
};

function mapStateToProps(state, { domain }) {
	return {
		isEmpty: getIsEmptyByDomain(state, domain)
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(AlertBlock);
