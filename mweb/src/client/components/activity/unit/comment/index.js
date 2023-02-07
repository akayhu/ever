import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// components
import CommentItem from './commentItem';
import CommentInput from './commentInput';

class Comment extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { aid, itemData, user, commentCount, pageName, filter } = this.props;

		return (
			<div styleName="comment">
				<CommentItem aid={ aid } />
				{
					commentCount === 0 &&
					<p styleName="first_section">還沒有人在這篇文章留言，快來留言吧！</p>
				}
				<CommentInput
					itemData={ itemData }
					user={ user }
					pageName={ pageName }
					filter={ filter }
				/>
			</div>
		);
	}
}

function selector(state) {
	return {
		user: state.user,
	};
}

export default compose(
	connect(selector, {}),
	[CSSModules, '_', css, { allowMultiple: true }],
)(Comment);
