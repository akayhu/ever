import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Image from 'src/client/component_common/image';
import clientConfig from 'src/configs/client';
import css from './index.css';
import compose from 'src/util/compose';

class MessageListItem extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isReading: false
		};
	}
	/*componentWillReceiveProps(nextProps) {
		if (nextProps.readingChatId !== this.props.readingChatId) {
			this.setState({ isReading: this.props.chatId === nextProps.readingChatId});
		}
	}*/
	handleClick() {
		this.setState({
			isReading: true
		})
		this.props.handleClick(this.props.chatId);
	}
	render() {
		let readStyle = '';
		const { isRead, oname, readDate, spicture } = this.props;
		
		if(isRead === 1){
      readStyle = '';
    }else if(this.state.isReading === true){
    	readStyle = '';
    }else{
      readStyle = 'unread';
    }
    
    if(this.props.chatId === this.props.focus){
      readStyle = 'focus';
    }
		
		const members = oname.slice(0, 3).map((item, index) => {
			return (<span key={ index }>{ item }{index < (index-1) && "、"}</span>);
		});
		const avatarWebUrl = oname.length > 1 ? clientConfig.params.staticWapUrl+'/images/avatar/avatar_group_150.png' : spicture;
		
		return (
			<dd className={css.item} styleName={ readStyle } onClick={ this.handleClick.bind(this) }>
				<div styleName="content">
					<Image
						styleName="message_avatar"
						type={ 'avatar' }
						src={ avatarWebUrl }
					/>
					<div styleName="members">
						{ members }
						{oname.length > 3 && <span> ...等 { oname.length } 人</span>}
					</div>
					<div styleName="time">{ readDate.split(' ', 1) }</div>
				</div>
			</dd>
		);
	}
}

/*
function mapStateToProps(state) {
	return {
		readingChatId: state.message.readingChatId,
	};
}
*/

export default compose(
	//connect(mapStateToProps),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MessageListItem);
