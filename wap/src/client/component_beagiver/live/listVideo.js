import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class ListVideo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showItem: 6
		};
	}
	more() {
		this.setState({	showItem: this.state.showItem + 6	});
	}
	render() {
		const { data } = this.props;
		const { showItem } = this.state;
		const dataTotal = data.length;
		return (
			<div styleName="listVideo maxWidth">
				<div styleName="listVideoTitle">更多剪影</div>
				<ul>
					{
						data.map((item, index) => {
							if (index < showItem && index < dataTotal) {
								return (
									<li key={ item.youtube }>
										<iframe
											width="335"
											height="188"
											src={ `https://www.youtube.com/embed/${item.youtube}` }
											frameBorder="0"
											allowFullScreen
										/>
										<div styleName="listVideoDataTitle">{ item.title }</div>
									</li>
								);
							}
						})
					}
				</ul>
				<div styleName="button">
					{
						this.state.showItem < dataTotal &&
						<a 
							data-gtm-giver="活動剪影-顯示更多" 
							styleName="more" href="javascript:void(0)" 
							onClick={ () => this.more() }
						>
							顯示更多剪影
						</a>
					}
					<a 
						data-gtm-giver="活動剪影-加入我們" 
						styleName="join" href="https://jr3j.app.link/LOXt9l3x7v" 
						target="_blank"
					>
						加入我們
					</a>
				</div>
			</div>
		);
	}
}

export default CSSModules(ListVideo, css, {allowMultiple: true});
