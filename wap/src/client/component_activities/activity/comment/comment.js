import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import CommentItem from './commentItem.js';
import CommentInput from './commentInput.js';
import { getCommentList } from 'src/client/actions/activity';
import compose from 'src/util/compose';
import { fromJS } from 'immutable';
import Exenv from 'exenv';

class Comment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			getMoreCommentLoading: false,
		};
		this.pass = true;
	}
	componentDidMount() {
		if (
			this.props.itemData.commentCount > 0 &&
			this.props.itemData.hasOwnProperty('commentList') &&
			this.props.itemData.commentList.length === 0) {
			this.getComment(2);
		}
	}
	getComment(limit) {
		if (this.props.user.pid === -3 && this.pass === false && this.props.showHint) {
			this.props.showHint();
			return;
		}
		this.pass = false;
		this.props.getCommentList(this.props.itemData.aid, limit);
	}
	render() {
		const hasMoreComment = (this.props.itemData.commentCount > (this.props.itemData.commentList ? this.props.itemData.commentList.length : 0));
		const mentions = fromJS(this.props.myFriendList.list);
		return (
			<div styleName="comment_main">
				{
					hasMoreComment &&
					<div onClick={ this.getComment.bind(this, 10) } styleName="getMoreComment_btn">看更多留言
						{
							this.props.itemData.commentLoading &&
							<span className="ui loading" styleName="getMoreComment_loading" />
						}
					</div>
				}
				{
					this.props.itemData.commentList && this.props.itemData.commentList.map((commentId, index) => {

						if (this.props.activity.activityPool[commentId]) {
							const comment = this.props.activity.activityPool[commentId];

							return (<CommentItem
								key={ comment.aid }
								index={ index }
								user={ this.props.user }
								itemData={ comment }
								author={ comment.pid === this.props.user.pid }
								showHint={ this.props.showHint }
								mentions={ mentions }
								commitAid={true}
							/>);
						}
					})
				}
				{
					this.props.user.pid !== '-3' && Exenv.canUseDOM &&
					<CommentInput
						itemData={ this.props.itemData }
						mentions={ mentions }
						user={ this.props.user }
						showHint={ this.props.showHint }
						pageName={this.props.pageName}
						filterName={this.props.filterName}
					/>
				}
				{
					this.props.user.pid === '-3' &&
					<div style={ {textAlign: 'center'} }>
						<button className="ui primary button" onClick={ this.props.showHint }>我要留言</button>
					</div>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		myFriendList: state.global.myFriendList,
		activity: state.activity
	};
}

export default compose(
	connect(mapStateToProps, { getCommentList }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Comment);
