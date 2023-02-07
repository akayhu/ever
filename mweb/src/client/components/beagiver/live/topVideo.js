import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class TopVideo extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { data } = this.props;
		return (
			<div styleName="topMovie">
        <div styleName="topMovieIframe">
          <iframe
            src={ `https://www.youtube.com/embed/${data.youtube}` }
            frameBorder="0"
            allowFullScreen
          />
        </div>
				<div styleName="topMovieTitle">
					{ data.title }
				</div>
				<p dangerouslySetInnerHTML={ {__html: data.content} } />
			</div>
		);
	}
}

export default CSSModules(TopVideo, css, {allowMultiple: true});
