import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class Tag extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div styleName="tag_row">
				{
					this.props.itemData.tagList.length > 0 &&
					<i className="icon tag" styleName="tag" />
				}
				{
					this.props.itemData.tagList.map((obj, index) => {
						const tagUrl = `/search/tag/${obj}`;
						return <TagItem key={ index } text={ obj } url={ tagUrl } />;
					})
				}
			</div>
		);
	}
}

const TagItem = ({ text, url }) => <a style={ { marginLeft: '8px', color: 'gray' } } data-gtm-tag="activity" href={ url } >{ text }</a>;
export default CSSModules(Tag, css, { allowMultiple: true });
