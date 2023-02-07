import React from 'react';
import CSSModules from 'react-css-modules';
import css from './unit.css';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';


const EditTrigger = ({ editTrigger, delTrigger }) =>
	<DropdownMenu>
		<DropdownTarget>
			<i styleName="itemEdit" className="edit icon" />
		</DropdownTarget>
		<DropdownList>
			<ul className="dropdown">
				<li onClick={ editTrigger }><i />編輯</li>
				<li onClick={ delTrigger }><i />刪除</li>
			</ul>
		</DropdownList>
	</DropdownMenu>;

export default CSSModules(EditTrigger, css, { allowMultiple: true });
