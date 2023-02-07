import React from 'react';
import { useSelector } from 'react-redux';
import { MobileDrawerMain } from './styledComponents';

const MobileDrawer = props => {
	const { height, children } = props;
	const visible = useSelector(state =>
		state.getIn(['ui', 'mobileDrawer', 'visible'])
	);

	return (
		<MobileDrawerMain visible={visible} height={height}>
			{children}
		</MobileDrawerMain>
	);
};

export default MobileDrawer;
