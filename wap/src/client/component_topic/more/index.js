import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

const More = ({text, linkUrl = ''}) =>
	<div styleName="moreCenter">
		<Link to={ {pathname: linkUrl, state: 'fromTopic'} }>
			<button className="ui line button">{text}</button>
		</Link>
	</div>;

More.propTypes = {
	text: PropTypes.string.isRequired,
	linkUrl: PropTypes.string
};

export default compose(
	[CSSModules, '_', css]
)(More);
