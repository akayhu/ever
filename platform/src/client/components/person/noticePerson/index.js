"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import Image from '../../../components/image';
import css from './style.css';

class NoticePerson extends Component {
	render() {
		return (
			<div className={css['notice-person']}>
				<a href={"/"+this.props.person.pid} className={css['avator']}>
					<Image
						type={ 'avatar' }
						src={ this.props.person.avatarWebUrl }
					/>
				</a>
				<div className={css['content']}>
					<a href={"/"+this.props.person.pid} className={css['name']}>{this.props.person.name}</a>
					{this.props.children}
				</div>
			</div>
		);
	}
}

const NoticePersonCss = CSSModules( NoticePerson, css, { allowMultiple : true } )
//const NoticePersonTranslate = translate( [] )( NoticePersonCss );
export default NoticePersonCss;