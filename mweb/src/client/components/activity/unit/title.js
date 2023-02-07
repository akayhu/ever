import React from 'react';
import CSSModules from 'react-css-modules';
import css from './title.css';

const handleClick = (e) => {
	e.preventDefault();
	return false;
};

const title = ({ title, children, area, aid }) => {
	if (area === 'river') {
		return (
			<a
				href={ `/m/activity/${aid}` }
				onClick={ handleClick }
				styleName="main_text">
				{ title }{ children }
			</a>
		);
	}
	return <h1 styleName="main_text">{ title }{ children }</h1>;
};

export default CSSModules(title, css);
