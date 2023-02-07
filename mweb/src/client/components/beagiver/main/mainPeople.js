import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';
import css from './index.css';

class BeAGiverPeople extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { peopelItems, dataGtm, linkName, describe} = this.props;
		return (
			<ul styleName="people_item">
				{
					peopelItems.map(item => (
						<li key={ item.id }>
							<a target="_blank" href={ `/activity/${item.aid}` }>
								<div styleName="item_pic">
									<img 
										data-gtm-giver={ dataGtm } 
										src={ `${clientConfig.params.staticWapUrl}/images/beagiver/${linkName}/${item.img}` } 
									/>
								</div>
								<p styleName="item_name">{item.name}</p>
								<p title={item.content}><span>{describe}</span>{item.content}</p>
							</a>
						</li>
					))
				}
			</ul>
		);
	}
}

export default CSSModules(BeAGiverPeople, css, {allowMultiple: true});
