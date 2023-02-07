import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
// style
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

const NotFriendBtn = ({
	gtmTag,
	btnStyle,
	sizeStyle,
	toggle,
	onSelect
}) => {
	const { changecard, friend, colleague, classmate, others } = gtmTag;
	return (
		<DropdownMenu
			className={ `ui button	${btnStyle} ${sizeStyle}` }
			toggleOpen={ toggle }
		>
			<DropdownTarget>
				<span { ...changecard }>交換名片</span>
			</DropdownTarget>
			<DropdownList>
				<div styleName="dropdownlist_title">
					<span>選擇關係:</span>
				</div>
				<ul className="dropdown" styleName="other_actions">
					<li { ...friend } onClick={ onSelect.bind(this, 3) }>朋友</li>
					<li { ...colleague } onClick={ onSelect.bind(this, 1) }>同事</li>
					<li { ...classmate } onClick={ onSelect.bind(this, 2) }>同學</li>
					<li { ...others } onClick={ onSelect.bind(this, 3) }>我想認識他</li>
				</ul>
			</DropdownList>
		</DropdownMenu>
	);
};

NotFriendBtn.propTYpes = {
	gtmTag: PropTypes.object.isRequired,
	btnStyle: PropTypes.string,
	sizeStyle: PropTypes.string,
	toggle: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default compose(
	//translate([]),
	[CSSModules, '_', css]
)(NotFriendBtn);
