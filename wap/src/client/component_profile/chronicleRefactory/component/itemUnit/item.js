import React from 'react';
import CSSModules from 'react-css-modules';
import css from './item.css';

const Item = ({ startYear, tempData, showCircle, children}) =>
	<div styleName="chronicleItem">
		<div styleName="itemTop">
			<div styleName="line" />
			{
				showCircle &&
				<div styleName="orange_circle" />
			}
			{
				showCircle &&
				<div styleName="endTime">
					<div styleName="dashLine" />
					<div styleName="endTimeText">
						<span>{ startYear }</span>
					</div>
				</div>
			}
		</div>
		<div styleName="itemContent">
			{ children }
			{
				tempData &&
				<div styleName="tempData_hint">資訊不完整，無法公開</div>
			}
		</div>
		<div styleName="itemBottom">
			<div styleName="line" />
		</div>
	</div>
;

Item.defaultProps = {
	tempData: false,
};

export default CSSModules(Item, css, { allowMultiple: true });
