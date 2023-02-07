import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import ListPeople from './listPeople';

class ListStory extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { storyList } = this.props;
		return (
			<div>
				{
					storyList.map((item, index) => (
						<li key={ index }>
							<a 
								href={`/activity/${item.storyLink}`}
								target="_blank"
							>
								<h2 title={ item.title }>
									<span data-gtm-giver="他們的故事-其他故事">{ item.title }</span>
								</h2>
								<div styleName="story_content">
									<ListPeople
										name={ item.giver }
										photo={ item.giverImg }
										nameTitle="Giver"
									/>
									<ListPeople
										name={ item.taker }
										photo={ item.takerImg }
										nameTitle="Taker"
									/>
									<p 
										data-gtm-giver="他們的故事-其他故事" 
										title={item.study} 
										styleName="study_content"
									>
										學習：{item.study}
									</p>
								</div>								
							</a>
						</li>
						)
					)
				}
			</div>
		);
	}
}

export default CSSModules(ListStory, css, {allowMultiple: true});
