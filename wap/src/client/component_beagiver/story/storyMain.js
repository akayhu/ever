import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import ListStory from './listStory';
import { STORY_DATA } from './story_data.js';

class StoryMain extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showItem: 4
		};
	}
	more() {
		this.setState({	showItem: this.state.showItem + 4	});
	}
	render() {
		const { showItem } = this.state;
		const dataTotal = STORY_DATA.length;
		return (
			<div styleName="story">
				<ul>
					<ListStory showItems={ showItem } storyList={ STORY_DATA } />
				</ul>
				<div styleName="button">
					{
						this.state.showItem < dataTotal &&
						<a 
							data-gtm-giver="他們的故事-顯示更多" 
							styleName="more" 
							href="javascript:void(0)" 
							onClick={ () => this.more() }
						>
							顯示更多
						</a>
					}
					<a 
						data-gtm-giver="他們的故事-加入我們" 
						styleName="join" 
						href="https://jr3j.app.link/LOXt9l3x7v" 
						target="_blank"
					>
						加入我們
					</a>
				</div>
			</div>
		);
	}
}

export default CSSModules(StoryMain, css, {allowMultiple: true});
