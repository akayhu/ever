import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
// selectors
import { getDataByIdsAndKey } from 'src/client/reducers/topic/selectors';
// components
import {NameCard} from 'src/client/component_common/card';
import More from 'src/client/component_topic/more';

const EndorseList = ({endorseList, isLogin, subkey}) => {
	if (!endorseList.length) {
		return null;
	}
	return (
		<ol styleName="endorseItem">
			{endorseList.slice(0, 3).map((obj, index) =>
				<li key={ index }>
					<div styleName="endorseNameCard">
						<NameCard
							targetPid={ obj.pid }
							href={ `profile/${obj.pid}` }
							imgSrc={ obj.avatarWebUrl }
							name={ obj.userName }
						/>
					</div>
					<div styleName="userInfo">
						<NameCard
							targetPid={ obj.pid }
							href={ `profile/${obj.pid}` }
							imgSrc={ obj.avatarWebUrl }
							name={ obj.userName }
							textMode
						/>
						<p styleName="userJobTitle">{obj.jobTitle}</p>
					</div>
				</li>
			)}
			{(isLogin && endorseList.length > 3) &&
				<More text="看更多" linkUrl={ `/topic/endorse/staffList/${subkey}` } />
			}
		</ol>
	);
};

EndorseList.propTypes = {
	endorseList: PropTypes.array.isRequired,
};

function mapStateToProps(state, {dataIds, subkey}) {
	return {
		isLogin: state.user.isLogin,
		endorseList: getDataByIdsAndKey(state, dataIds, 'endorse', subkey),
	};
}

export default compose(
	connect(mapStateToProps),
	translate([]),
	[CSSModules, '_', css]
)(EndorseList);
