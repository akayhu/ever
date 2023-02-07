import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import computeCount from 'src/client/utils/computeCount';
// actions
import {triggerCollect} from 'src/client/actions/activity';
import { checkLogin } from  'src/client/actions/user';
// components
import BaseBtn from '../baseBtn';

const CollectBtn = ({collectIt, aid, propsSource, triggerCollect, count, checkLogin, pid, pageName, filter}) => {
	const _collectIt = propsSource ? propsSource.collectIt : collectIt;
	const params = {
		aid: propsSource ? propsSource.aid : aid,
	};
	return (
		<BaseBtn
			checked={ _collectIt }
			clickHandler={ function(checked, params){
				if(!checkLogin()){
					return;
				}
				return triggerCollect(checked, params);
			} }
			params={ params }
			gtmName="收藏"
			data={ propsSource }
			event="collect"
			pid={ pid }
			pageName={ pageName }
			filter={ filter }
		>
			<i className="icon bookmark" />收藏
			{
				count !== 0 &&
				<span>{ computeCount(count) }</span>
			}
    </BaseBtn>
	);
};

CollectBtn.propTypes = {
	collectIt: PropTypes.bool,
	aid: PropTypes.string,
	propsSource: PropTypes.object,
};

export default connect(null, {triggerCollect, checkLogin})(CollectBtn);
