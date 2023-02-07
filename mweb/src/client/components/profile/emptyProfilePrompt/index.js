import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const EmptyProfilePrompt = () =>
	<div styleName="container">
		<p>若要編輯個人檔案 ,</p>
		<p>
      請下載APP:
      <a href="">IOS</a>
      /
      <a href="">Android</a>
		</p>
		<p>
      或至
      <a href="">電腦版網頁</a>
      使用
    </p>
	</div>;

export default CSSModules(EmptyProfilePrompt, css);
