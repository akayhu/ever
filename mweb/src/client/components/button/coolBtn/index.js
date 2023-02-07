import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import computeCount from 'src/client/utils/computeCount';
// actions
import {triggerLike} from 'src/client/actions/activity';
import { checkLogin } from  'src/client/actions/user';
// components
import BaseBtn from '../baseBtn';

const CoolBtn = ({likeIt, aidParent, aid, propsSource, triggerLike, mode, count, checkLogin, pid, pageName, filter}) => {
	const _likeIt = propsSource ? propsSource.likeIt : likeIt;
	const params = {
		aidParent: propsSource ? (propsSource.aidParent||propsSource.aid) : aidParent,
		aid: propsSource ? propsSource.aid : aid,
	};
	return (
		<BaseBtn
			checked={ _likeIt }
			clickHandler={ function(checked, params){
				if(!checkLogin()){
					return;
				}
				return triggerLike(checked, params);
			} }
			params={ params }
			mode={ mode }
			gtmName="酷"
			data={ propsSource }
			event="cool"
			pid={ pid }
			pageName={ pageName }
			filter={ filter }
		>
			<i className="icon thumb_up" />酷
			{
				count !== 0 &&
				<span>{ computeCount(count) }</span>
			}
      </BaseBtn>
	);
};

CoolBtn.propTypes = {
	likeIt: PropTypes.bool,
	aidParent: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
	]),
	aid: PropTypes.string,
	propsSource: PropTypes.object,
};

export default connect(null, {triggerLike, checkLogin})(CoolBtn);
