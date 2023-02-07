import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const AnswerInfo = ({part, count, children}) =>
	<div className="info">
		已填
		<span styleName="count">
			{
				part === 1
				? count
				: count + (34 * (part - 1))
			}
		</span>
		/
		<span styleName="count">
			{ // 簡易版時就是給第一part的總題數
				// 進階版就是剩下的三個part的總題數
				part === 1
				? 34
				: 136
			}
		</span>
		題，剩餘時間
		<span	styleName="count">
			{ children }
		</span>
	</div>;

export default CSSModules(AnswerInfo, css);
