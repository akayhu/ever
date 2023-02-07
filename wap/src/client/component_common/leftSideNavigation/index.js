import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
// import { translate } from 'react-i18next';
import NavigationBlock from './navigationBlock';
import compose from 'src/util/compose';
import css from './index.css';

class LeftSideNavigation extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const navSetting = this.props.navSetting;
		const navList = navSetting.navList;
		const propsCss = this.props.propsCss || {};
		return (
			<div styleName="left_side_navigation" style={ propsCss }>
				{
					navList.length > 0 && navList.map((blockData, index) => (
						<NavigationBlock key={ index } blockData={ blockData } css={ css } { ...navSetting } />
					))
				}
			</div>
		);
	}
}

LeftSideNavigation.propTypes = {
	propsCss: PropTypes.object
};

export default compose(
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(LeftSideNavigation);
