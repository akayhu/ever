import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const handleClick = (e) => {
	e.preventDefault();
	return false;
};

const Title = ({ itemData, area }) => {
	if (area && area === 'river') {
		return (
			<a
				href={ `/activity/${itemData.aid}` }
				className="h1"
				styleName="activity_title river_activity_title"
				onClick={ handleClick }
			>
				{ itemData.title }
				<i className={ setPrivacyIcon(itemData.privacySetting) } />
			</a>
		);
	}

	return (
		<h1 className="h1" styleName="activity_title">
			{ itemData.title }
			<i className={ setPrivacyIcon(itemData.privacySetting) } />
		</h1>
	);
};

function setPrivacyIcon(setting) {
	switch (setting) {
		case 0:
			return 'world icon';
		case 1:
			return 'friends icon';
		case 2:
			return 'lock icon';
		default:
			return 'world icon';
	}
}

export default CSSModules(Title, css, { allowMultiple: true });
