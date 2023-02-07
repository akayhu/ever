import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
import clientConfig from 'src/configs/client';

const Tags = ({ tagList }) => (
	<div styleName="tag_box">
		<i className="tag icon" />
		{tagList.map((tag, index) => (
			<a
				key={ index }
				styleName="tag_link"
				href={ `${clientConfig.params.wapUrl}/search/group/${tag}` }
				data-gtm-tag="group"
			>
				{ `${tag}　` }
			</a>
		))}
	</div>
);

Tags.propTypes = {
	tagList: PropTypes.array.isRequired
};

export default compose(
	//translate([]),
	[CSSModules, '_', css]
)(Tags);
