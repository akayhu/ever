import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

class MenuBlock extends Component {
	constructor(props) {
		super(props);
	}
	changeToNext(submenu) {
		this.props.changeToNext(submenu);
	}
	closeMenu() {
		this.props.closeMenu();
	}
	render() {
		const { data, isLogin } = this.props;
		return (
			<ul>
				{
					data.hasOwnProperty('back') &&
					<h3 onClick={ this.changeToNext.bind(this, data.back) }>
						<i className="angle left icon" />
						{ data.title }
					</h3>
				}
				{
					!data.hasOwnProperty('back') &&
					<h3>{ data.title }</h3>
				}
				{
					data.submenu.map((menu) => {
						if (menu.isLogin && !isLogin) {
							return null;
						}
						const className = menu.className + ' icon';
						const otherAttr = {};
						if (menu.hasOwnProperty('submenu') && !menu.back) {
							menu.back = [data];
						}
						if (menu.hasOwnProperty('target')) {
							otherAttr.target = menu.target;
						}
						if (menu.hasOwnProperty('id')) {
							otherAttr.id = menu.id;
						}
						if (menu.link) {
							if (menu.noSpa === true) {
								return (
									<li key={ menu.title }>
										<a
											href={ menu.link }
											{ ...otherAttr }
											data-gtm-header={ menu.gtmName }
											rel="noreferrer noopener"
										>
											<i className={ className } />
											{ menu.title }
											{
												menu.hasOwnProperty('submenu') && menu.submenu.length > 0 &&
												<i className="angle right icon" styleName="icon_float_right" />
											}
										</a>
									</li>
								);
							}
							return (
								<li key={ menu.title }>
									<Link
										onClick={ this.closeMenu.bind(this) }
										to={ menu.link }
										{ ...otherAttr }
										data-gtm-header={ menu.gtmName }
										rel="noreferrer noopener"
									>
										<i className={ className } />
										{ menu.title }
										{
											menu.hasOwnProperty('submenu') && menu.submenu.length > 0 &&
											<i className="angle right icon" styleName="icon_float_right" />
										}
									</Link>
								</li>
							);
						} else {
							return (
								<li key={ menu.title }>
									<button onClick={ this.changeToNext.bind(this, [menu]) } data-gtm-header={ menu.gtmName }>
										<i className={ className } />
										{ menu.title }
										{
											menu.hasOwnProperty('submenu') && menu.submenu.length > 0 &&
											<i className="angle right icon" styleName="icon_float_right" />
										}
									</button>
								</li>
							);
						}
					})
				}
			</ul>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default compose(
	connect(mapStateToProps),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MenuBlock);
