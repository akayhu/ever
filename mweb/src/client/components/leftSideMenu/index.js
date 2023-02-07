import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';
import menuSetting from './menu.js';
import MenuBlock from './menuBlock.js';
import compose from 'src/util/compose';
import { initSubscribeList } from 'src/client/actions/topic';

class LeftSideMenu extends Component {
	constructor(props) {
		super(props);
		this.menu = [];
		this.state = {
			target: this.menu,
		};
	}
	componentWillMount() {
		const { user: { isLogin } } = this.props;
		this.menu = menuSetting({ pid: this.props.user.pid });
		this.menu.map((data) => {
			data.isRoot = true;
		});
		this.state.target = this.menu;
		if (isLogin) {
			this.props.initSubscribeList();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.showMenu === false) {
			this.state.target = this.menu;
			return;
		}
		if (nextProps.funcList.length > 0) {
			const funcList = nextProps.funcList.map((item) => {
				return {
					title: item,
					className: 'browser',
					link: '/m/topic/' + item
				};
			});
			this.menu[0].submenu[1].submenu = this.menu[0].submenu[1].submenu.concat(funcList);
		}
	}
	changeToNext(target) {
		if (target[0].isRoot === true) {
			this.setState({
				target: this.menu,
			});
		} else {
			this.setState({
				target,
			});
		}
	}
	render() {
		const { target } = this.state;
		const { user: { isLogin }, toggleMenu } = this.props;
		return (
			<aside id="left_side" styleName="menu">
				{
					target.map((data, index) => {
						if (data.isLogin === true && isLogin === false) {
							return null;
						}
						return (
							<MenuBlock
								key={ index }
								data={ data }
								isLogin={ isLogin }
								closeMenu={ toggleMenu }
								changeToNext={ this.changeToNext.bind(this) }
							/>
						);
					})
				}
			</aside>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		funcList: state.topic.allFunc.funcList,
	};
}

export default compose(
	connect(mapStateToProps, { initSubscribeList }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(LeftSideMenu);
