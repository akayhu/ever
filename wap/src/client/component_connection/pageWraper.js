import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FriendItem from './friendItem';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import css from './index.css';
import compose from 'src/util/compose';
import { getDataList } from 'src/client/reducers/connection';


const PageWrapper = ({ data, total, user, mode, groupItems, viewas, viewasInfo}) => {
	let title,
		flagName = mode,
		groupName;
	if (parseInt(flagName)) {
    // 用來處理groupFriend
		flagName = 'friends';
		const targetItem = groupItems.filter(item => item.groupId == mode);
		groupName = targetItem.length > 0 ? targetItem[0].groupName : null;
	}
	switch (flagName) {
		case 'friend':
			title = `全部朋友(${total}位)`;
			break;
		case 'friends':
			title = `${groupName} (${total})`;
			break;
		case 'invitations':
			title = `收到的邀請(${total})`;
			break;
		case 'unconfirmed':
			title = `待對方確認的邀請(${total})`;
			break;
		case 'following':
			title = viewas === 'self' ? `我的關注(${total})` : '關注列表';
			break;
		case 'myfollowers':
			title = `關注我的人(${total})`;
			break;
		case 'mayKnowPeopleList':
			title = '可能認識的人';
			break;
		case 'excellentPeopleList':
			title = '值得關注的對象';
			break;
		case 'nonSelf':
			title = `朋友列表(${total})`;
			break;
		default:
			title = '尚未定義';
	}
	return (
		<div>
			<div className="h2" styleName="contacts_title">{ title }</div>
			<div styleName="contacts_main">
				<dl>
					{ data.map((item, index) =>{
						return (
							<FriendItem
								{ ...item }
								key={ `${item.pid}${index}` }
								viewasInfo={ viewasInfo }
								viewas={ viewas }
								pid={ user.pid }
								targetPid={ item.pid }
								mode={ mode }
								isLogin={ user.isLogin }
							/>
						)
					})
          }
				</dl>
			</div>
		</div>
	);
};

PageWrapper.propTypes = {
  // data: PropTypes.object.isRequired,
  // userPid: PropTypes.object.isRequired
};

const mapStateToProps = (state, {mode}) => {
	const nowState = state.connection;
	return {
		groupItems: getDataList(nowState, 'groupItems'),
		user: state.user
	};
};

export default compose(
	connect(mapStateToProps),
	translate([]),
	[CSSModules, '_', css]
)(PageWrapper);
