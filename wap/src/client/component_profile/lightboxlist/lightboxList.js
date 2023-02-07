import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Image from 'src/client/component_common/image';
// import compose from 'src/util/compose';
import { getTitle } from './util';

const LightboxListItem = ({personData}) =>
	<div styleName="item">
		<a href={ `/profile/${personData.pid}` } title={ personData.userName }>
			<Image
				styleName="itemimg"
				src={ personData.avatarWebUrl }
				type="avatar"
				title={ personData.userName }
				alt={ personData.userName }
			/>
		</a>
		<div styleName="title_desc">
			<a href={ `/profile/${personData.pid}` } title={ personData.userName }>
				{ personData.pid !== 9999999999 ? personData.userName : '帳號不存在' }
			</a><br />
			{ getTitle(personData) }
		</div>
	</div>;

LightboxListItem.propTypes = {
	personData: PropTypes.object.isRequied,
};

// export default compose(
// 	// connect(null, {}),
// 	// translate([]),
// 	[CSSModules, '_', css, { allowMultiple: true }]
// )(LightboxListItem);

export default CSSModules(LightboxListItem, css, { allowMultiple: true });
