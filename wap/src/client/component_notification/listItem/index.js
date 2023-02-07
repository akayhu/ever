import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import Image from 'src/client/component_common/image';
import moment from 'moment';

const ListItem = (props) => {
	const { message, iconUrl, createDate, targetLink } = props;

	return (
		<dd styleName="list_item_box">
			<div styleName="item_for_group">
				<div styleName="left">
					<Image src={ iconUrl } />
				</div>
				<div styleName="right">
					<a href={ targetLink }>
						<div styleName="content">
							<div styleName="content_block">
								<span styleName="content_text">{message}</span>
							</div>
						</div>
						<div styleName="time">
							{moment(createDate).format('YYYY-MM-DD HH:mm:ss')}
						</div>
					</a>
				</div>
			</div>
		</dd>
	);
};


ListItem.propTypes = {
	iconUrl: PropTypes.string,
	createDate: PropTypes.string.isRequired,
};

export default compose(
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ListItem);
