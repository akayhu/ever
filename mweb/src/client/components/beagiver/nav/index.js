import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

class MBeAGiverNav extends Component {
	constructor(props) {
		super(props);
		this.scrollNav = this.scrollNav.bind(this);
	}
	scrollNav() {
		const elem = ReactDOM.findDOMNode(this.refs.giver_nav);
		const $body = $('html,body');
		$body.animate({
			scrollTop: $(elem).offset().top - 77
		}, 500);
	}
	render() {
		const active = this.props.navSetting.active;
		return (
			<nav ref="giver_nav" styleName="nav_giver">
				<ul>
					{
						this.props.navSetting.navList.map((item, index) => {
							if (!item.hasOwnProperty('isShow') || (item.hasOwnProperty('isShow') && item.isShow === true)) {
								return (
									<li 
										onClick={ this.scrollNav } 
										styleName={ active === item.itemKey ? 'active' : '' } 
										key={ index }
									>
										<Link to={ item.url } data-gtm-giver={ `${item.title} Tab` }>
											{item.title}
										</Link>
									</li>
								);
							}
						})
					}
					<li>
						<a 
							target="_blank" 
							data-gtm-giver={ '加入我們' } 
							href="https://jr3j.app.link/LOXt9l3x7v"
						>
						加入我們
						</a>
					</li>
				</ul>
			</nav>
		);
	}
}

export default CSSModules(MBeAGiverNav, css, {allowMultiple: true});
