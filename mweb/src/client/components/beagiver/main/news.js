import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class BeAGiverNews extends Component {
	constructor(props) {
		super(props);
		this.toggleMore = this.toggleMore.bind(this);
		this.state = {
			showItem: 3
		};
	}
	toggleMore() {
		this.setState({
			showItem: this.state.showItem + 3
		});
	}
	render() {
		const { newsList } = this.props;
		const { showItem } = this.state;
		const len = newsList.length - 1;
		return (
			<div styleName="news_giver">
				<h2>最新消息</h2>
				<ul>
					{
						newsList.slice(0, showItem).map((news, index) => (
							<li key={ index }>
								<a 
									data-gtm-giver="最新動態-最新消息" 
									target="_blank" 
									href={ `/activity/${news.aid}` }
								>
								{news.title}
								</a>
								<span>{news.date}</span>
							</li>
						))
					}
				</ul>
				{
					showItem <= len &&
					<a 
						data-gtm-giver="最新動態-看更多消息" 
						styleName="news_more" onClick={ this.toggleMore } 
						href="javascript:;"
					>
					看更多
					</a>
				}
			</div>
		);
	}
}

export default CSSModules(BeAGiverNews, css, {allowMultiple: true});
