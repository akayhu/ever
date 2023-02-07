import React from 'react';
import './style.css';

const PlaceHolder = ({ text, className, onClickHandler }) => {
	return (
		<div
			className={className || 'placeHolder-default'}
			onClick={onClickHandler}
		>
			{text || 'PLACEHOLDER'}
		</div>
	);
};

export default PlaceHolder;
