import React from 'react';
import css from './index.css';
import CSSModules from 'react-css-modules';
import { FeatureDataList } from '../data';
import clientConfig from 'src/configs/client';
import { Link } from 'react-router';

const FeatureField = () => (
	<div styleName="block">
		{
			FeatureDataList.map((data, key) => {
				const eventP = (key === 2) ? data.eventCss : '';
				return (
					<div styleName="col" key={ key }>
						<Link to={ data.linkUrl } target={ data.target }>
							<h2>{ data.title }</h2>
							<img src={ `${clientConfig.params.staticWapUrl}${data.imgUrl}` } />
							<p styleName={ eventP }>{ data.description }</p>
						</Link>
					</div>
				);
			})
		}
	</div>
);

export default CSSModules(FeatureField, css, { allowMultiple: true });
