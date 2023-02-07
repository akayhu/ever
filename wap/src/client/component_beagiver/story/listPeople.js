import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';
import css from './index.css';

class ListPeople extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { name, photo, nameTitle } = this.props;
		return (
			<div styleName="photo_style">
				<img 
					data-gtm-giver="他們的故事-其他故事" 
					src={ `${clientConfig.params.staticWapUrl}/images/beagiver/story/${photo}` } 
				/>
				<span>{nameTitle}</span>
				<p title={name}>{name}</p>
			</div>
		);
	}
}

export default CSSModules(ListPeople, css, {allowMultiple: true});
