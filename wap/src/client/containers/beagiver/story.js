import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Slider from 'src/client/component_beagiver/story/slider';
import StoryMain from 'src/client/component_beagiver/story/storyMain';
import css from './index.css';

import clientConfig from 'src/configs/client';

const IMAGE_DATA = [
	{
		src: clientConfig.params.staticWapUrl + '/images/beagiver/story/storySlider_1.png',
		alt: 'images-1',
		aid: '03935e6a-890c-401a-afec-0084c3ada7a2',
		title: '想尋回配音tempo的亞力'
	},
	{
		src: clientConfig.params.staticWapUrl + '/images/beagiver/story/storySlider_2.png',
		alt: 'images-2',
		aid: 'c51cfb8a-1a68-4b45-8172-1a3448ff6808',
		title: '想把詞寫入人心的音樂追夢青年 陳昱誠'
	},
	{
		src: clientConfig.params.staticWapUrl + '/images/beagiver/story/storySlider_3.png',
		alt: 'images-3',
		aid: 'd6e020ef-56c0-4290-8074-60561c4d96a6',
		title: 'Giver-職棒統一7-11獅隊球員高志綱 v.s. Taker-羽球選手李儼育'
	}
];

class BeAGiverStory extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Slider
					items={ IMAGE_DATA }
					speed={ 1.5 }
					delay={ 2.1 }
					pause
					autoplay
					dots
					arrows
				/>
				<div styleName="containers_main">
					<StoryMain />
				</div>
			</div>
		);
	}
}

export default CSSModules(BeAGiverStory, css, {allowMultiple: true});
