import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { undoIgnore, undoNotInterested } from 'src/client/actions/activity';

const Ignore = ({itemData, undoIgnore, undoNotInterested, hideIgnore, style}) => {
	const type = itemData.ignore;
	
	if (type === 'article') {
		return (
			<div styleName="activity_ignore" style={style}>
				你將不會在首頁再看到這篇文章
				<span onClick={ undoIgnore.bind(this, itemData) }>取消</span>
				<i className="icon close" onClick={ hideIgnore.bind(this, itemData) } />
			</div>
		);
	} else if (type === 'person') {
		return (
			<div styleName="activity_ignore" style={style}>
				你將不會在首頁再看到這位會員的文章
				<span onClick={ undoNotInterested.bind(this, itemData) }>取消</span>
				<i className="icon close" onClick={ hideIgnore.bind(this, itemData) } />
			</div>
		);
	}
	
	return null;
};

Ignore.propTypes = {
	itemData: PropTypes.object.isRequired,
	undoIgnore: PropTypes.func.isRequired,
	undoNotInterested: PropTypes.func.isRequired
};

const actions = { undoIgnore, undoNotInterested };

export default compose(
	connect(null, actions),
	translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Ignore);
