import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusActivitycomment = ({content, subComponents, _followed, commentContent}) =>
	<div styleName="plus_activitycomment">
		{content  && <span styleName="content_text" dangerouslySetInnerHTML={{__html: commentContent}}></span>}
		{!content && <span styleName="content_text" dangerouslySetInnerHTML={{__html: commentContent}}></span>}
		{_followed}
	</div>;

export default CSSModules(PlusActivitycomment, css);
