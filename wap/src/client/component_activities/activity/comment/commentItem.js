import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import Attachment from './attachment';
import CommentInput from './commentInput';
import LikeButton from 'src/client/component_common/likeBtn';
import { NameCard, ChannelCard } from 'src/client/component_common/card';
import timeAgo from 'c_platform/lib/util/timeago';
import { deleteComment } from 'src/client/actions/activity';
import { accuseTrigger } from 'src/client/actions/accuse';
import ReactHtmlParser from 'react-html-parser';
import compose from 'src/util/compose';

class CommentItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updateMode: false,
			commentProcessingStatus: false,
			deleteCheck: false,
			// 0: Height: auto, seeMoreBtn: hidden ; 1: Height: 46px, seeMoreBtn: show; 2: Height: auto, seeMoreBtn: hidden
		};
	}
	componentDidMount() {
		if (this.refs.contantBox.clientHeight > 46) {
			this.setState({ commentProcessingStatus: true });
		}
	}
	componentWillReceiveProps() {
		this.setState({ deleteLoading: false });
	}
	seeMore() {
		this.setState({ commentProcessingStatus: false });
	}
	updateComment() {
		this.setState({ updateMode: true });
	}
	finishUpdate() {
		this.setState({ updateMode: false, updateLoading: false });
	}
	updateCommentCancel() {
		this.setState({ updateMode: false, comment: this.props.itemData.content });
	}
	deleteComment() {
		this.setState({ deleteCheck: true });
	}
	deleteSubmit() {
		this.props.deleteComment(this.props.itemData).then(() => {
			this.setState({ updateMode: false, deleteLoading: false });
		});
		this.setState({ deleteLoading: true, deleteCheck: false });
	}
	closeAlert() {
		this.setState({ deleteCheck: false });
	}
	accuseComment() {
		this.props.accuseTrigger('activity', {...this.props.itemData, index: this.props.index});
	}
	renderContantBox(commentStyle, ReactHtmlParser) {
		const data = this.props.itemData.content;
		let contantBox = '';
		// let contentArr = this.props.itemData.content.split('</p>');
		// function urlify(text) {
        //     const urlRegex = /(https?:\/\/[^\s]+)/g;
        //     return text.replace(urlRegex, function(url) {
        //         return `<a href="${url}" target="_blank">${url}</a>`;
        //     })
        // }

		// if(contentArr.length > 1 )contentArr.pop();
        // contentArr.map((item, i, items) => {
        // 	if (item.indexOf('http') >= 0) {
        //         item = urlify(item);
		// 	}
        //     item = '<p>' + item
        //     contantBox += item;
		// });

        if (!this.state.updateMode) {
            contantBox = (<div ref="contantBox">
				<div styleName="comment_content" style={ commentStyle }>{ReactHtmlParser(data)}</div>
			</div>);
		}

		return contantBox;
	}
	render() {
		const commentStyle = (this.state.commentProcessingStatus === true) ? { maxHeight: 46 } : {};
		const lightboxObtion = {
			submit: {
				text: '確定',
				action: this.deleteSubmit.bind(this)
			},
			cancel: {
				text: '取消'
			}
		};

		const { userInfo, channelId, channelInfo} = this.props.itemData;
		const hasChannelInfo = channelId !== null && typeof (channelId) !== 'undefined';
		const contantBox = this.renderContantBox(commentStyle, ReactHtmlParser);

		return (
			<div styleName="activity_comment">
				<div styleName="header_img">
					{
						(!hasChannelInfo || (hasChannelInfo && channelInfo.type !== 10)) &&
						<NameCard
							targetPid={ this.props.itemData.userInfo.pid }
							key={ this.props.itemData.userInfo.pid }
							href={ `/profile/${this.props.itemData.userInfo.pid}` }
							imgSrc={ this.props.itemData.userInfo.userFileUrl }
							name={ this.props.itemData.userInfo.userName }
						/>
					}
					{
						(hasChannelInfo && channelInfo.type === 10) &&
						<ChannelCard
							imgSrc={ channelInfo.avatarWebUrl }
							name={ channelInfo.name }
							id={ channelInfo.id }
						/>
					}
				</div>
				<div styleName="header_text">
					<div>
						{
							(!hasChannelInfo || (hasChannelInfo && channelInfo.type !== 10)) &&
							<NameCard
								targetPid={ this.props.itemData.userInfo.pid }
								key={ this.props.itemData.userInfo.pid }
								href={ `/profile/${this.props.itemData.userInfo.pid}` }
								imgSrc={ this.props.itemData.userInfo.userFileUrl }
								name={ this.props.itemData.userInfo.userName }
								textMode
							/>
						}
						{
							(hasChannelInfo && channelInfo.type === 10) &&
							<ChannelCard
								imgSrc={ channelInfo.avatarWebUrl }
								name={ channelInfo.name }
								id={ channelInfo.id }
								textMode
							/>
						}
						{
							this.props.user.pid != '-3' && !this.state.updateMode &&
							<DropdownMenu styleName="interact">
								<DropdownTarget>
									<i className="dropdown icon" />
								</DropdownTarget>
								<DropdownList>
									{
										this.props.author &&
										<ul className="dropdown">
											<li onClick={ this.updateComment.bind(this) }><i />編輯留言</li>
											<li onClick={ this.deleteComment.bind(this) }><i />刪除留言</li>
										</ul>
									}
									{
										!this.props.author &&
										<ul className="dropdown">
											<li onClick={ this.accuseComment.bind(this) }><i />檢舉留言</li>
										</ul>
									}
								</DropdownList>
							</DropdownMenu>
						}
					</div>
					{ // 編輯狀態隱藏
						!this.state.updateMode && contantBox
					}
					{
						this.state.commentProcessingStatus &&
						<div styleName="getMoreComment_btn" onClick={ this.seeMore.bind(this) }>點我看更多</div>
					}
					{
						this.state.updateMode &&
						<div styleName="self_message_main">
							<div styleName="comment_message">
								<CommentInput
									index={ this.props.index }
									itemData={ this.props.itemData }
									content={ this.props.itemData.content }
									mentions={ this.props.mentions }
									hasAttachment={ this.props.itemData.representativeFile !== null }
									user={ this.props.user }
									finishUpdate={ this.finishUpdate.bind(this) }
									updateCommentCancel={ this.updateCommentCancel.bind(this) }
									deleteComment={ this.deleteComment.bind(this) }
									updateMode
								/>
							</div>
						</div>
					}
					{
						!this.state.updateMode &&
						<div className="statics_text">
							{
								!this.props.itemData.extra.hasOwnProperty('accuseStatus') &&
								<LikeButton commitAid={this.props.commitAid} itemData={ this.props.itemData } user={ this.props.user } index={ this.props.index } clickTrigger={ this.props.showHint } />
							}
							{
								this.props.itemData.likeCount > 0 &&
								<span styleName="likeCount">{ this.props.itemData.likeCount }</span>
							}
							<span styleName="commentDate">{ timeAgo(this.props.itemData.createDateStr) }</span>
						</div>
					}
					{
						this.props.itemData.representativeFile !== null && !this.props.itemData.extra.hasOwnProperty('accuseStatus') && !this.state.updateMode &&
						<Attachment attachment={ this.props.itemData.representativeFile } />
					}
				</div>
				{
					this.state.deleteLoading &&
					<div styleName="delete_loading">
						<div className="ui loading" styleName="flower" />
					</div>
				}
				{
					this.state.deleteCheck &&
					<LightBox
						option={ lightboxObtion }
						open={ this.deleteComment.bind(this) }
						onClose={ this.closeAlert.bind(this) }
						clickOverlayToClose
					>
						<h3>你確定要刪除這個留言嗎？</h3>
					</LightBox>
				}
			</div>
		);
	}
}

CommentItem.defaultProps = {
};

CommentItem.propTypes = {
	itemData: PropTypes.object,
};

export default compose(
	connect(null, { accuseTrigger, deleteComment }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(CommentItem);
