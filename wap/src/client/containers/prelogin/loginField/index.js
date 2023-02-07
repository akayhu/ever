import React from 'react';
import Button from '../button/index';
import css from './index.css';
import CSSModules from 'react-css-modules';

const LoginField = () => (
	<div styleName="login-field">
		<Button btnClass="btn ac-login" text="104帳號登入" gtmTag="未登首頁 - 登入 - AC" url="/sso/saml-login" />
		<Button btnClass="btn fb-login" text="Facebook帳號登入" gtmTag="未登首頁 - 登入 - FB" url="/sso/fb-login" />
	</div>
);

export default CSSModules(LoginField, css, { allowMultiple: true });
