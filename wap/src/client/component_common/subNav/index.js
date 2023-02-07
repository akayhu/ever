import React, { Component } from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { Link } from 'react-router';

class SubNav extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const active = this.props.navSetting.active;
		const tagName = this.props.navSetting.tagName;

		return (
			<div styleName="sub_nav">
				{
					this.props.navSetting.navList.map((item, index) => {
						if (!item.hasOwnProperty('isShow') || (item.hasOwnProperty('isShow') && item.isShow === true)) {
							return (
								<span className={ active === item.itemKey ? css.active : '' } styleName="item" key={ index }>
									{
										tagName === 'profile' &&
										<Link to={ item.url } data-gtm-profile={ `${item.title} Tab` }>
											{item.title}{item.count > 0 ? `(${item.count})` : ''}
										</Link>
									}
									{
										tagName === 'group' &&
										<Link to={ item.url } data-gtm-group={ `${item.title} Tab` }>
											{item.title}{item.count > 0 ? `(${item.count})` : ''}
										</Link>
									}
									{
										tagName === 'channel' &&
										<Link to={ item.url } data-gtm-channel={ `${item.title} Tab` }>
											{item.title}{item.count > 0 ? `(${item.count})` : ''}
										</Link>
									}
									{
										tagName === 'job' &&
										<Link to={ item.url }>
											{item.title}{item.count > 0 ? `(${item.count})` : ''}
										</Link>
									}
								</span>
							);
						}
					})
				}
			</div>
		);
	}
}

const SubNavCss = CSSModules(SubNav, css, { allowMultiple: true });

export default SubNavCss;
