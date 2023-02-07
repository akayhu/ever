import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './counter.css';
import compose from 'src/util/compose';
import computeCount from 'src/client/utils/computeCount';

class Counter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { itemData } = this.props;
		const { viewCount } = itemData;
		return (
			<div className="clearfix" styleName="counter">
				<div styleName="left">
					{
						viewCount > 0 &&
						<span>{ computeCount(viewCount) }次瀏覽</span>
					}
				</div>
				{
					this.props.mode === 'stream' &&
					<div styleName="right">
						{
							itemData.commentCount > 0 &&
							<span styleName="count_item">留言{ computeCount(itemData.commentCount) }</span>
						}
						{
							itemData.endorseCount > 0 &&
							<span styleName="count_item">肯定{ computeCount(itemData.endorseCount) }</span>
						}
					</div>
				}
				{
					this.props.mode === 'master' && itemData.tagList &&
					<div styleName="right">
						{
							itemData.tagList.length > 0 &&
							<i className="icon tag" styleName="tag" />
						}
						{
							itemData.tagList.map((obj, index) => {
								const tagUrl = `/search/tag/${obj}`;
								return <TagItem key={ index } text={ obj } url={ tagUrl } />;
							})
						}
					</div>
				}
			</div>
		);
	}
}

const Tag = ({ text, url }) => <span styleName="tag" data-gtm-tag="activity" href={ url } >{ text }</span>;
const TagItem = CSSModules(Tag, css, { allowMultiple: true });

Counter.defaultProps = {
	itemData: {},
	mode: 'stream',
};

Counter.propTypes = {
	itemData: PropTypes.object.isRequired,
	mode: PropTypes.string.isRequired,
};
export default compose(
	[CSSModules, '_', css, { allowMultiple: true }],
)(Counter);
