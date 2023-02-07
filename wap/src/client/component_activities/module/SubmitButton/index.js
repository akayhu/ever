import React from 'react';

const SubmitButton = (...props) => {
	const { onClick, isLoading, dataGtmActivity, buttonValue} = props[0];
	let buttonStyle = 'ui primary button';
	if (isLoading) {
		buttonStyle = 'ui primary  button disabled loading';
	}
	return (
		<button
			className={ buttonStyle }
			onClick={ onClick }
			data-gtm-activity={ dataGtmActivity }
		>{ buttonValue }</button>
	);
};

export default SubmitButton;
