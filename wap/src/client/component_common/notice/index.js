import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';
import DOMPurify from 'dompurify';
class Notice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeout: props.timeout||5000
		};
	}
	componentDidMount() {
		setTimeout(function (){
			this.handleClose();
		}.bind(this), this.state.timeout);
	}
	handleClose () {
		this.refs.notice.classList.add(css.hide);
		setTimeout(function () {
			// TODO 不建議的做法 會有warning
			// let mountNode = ReactDOM.findDOMNode(this.refs.notice);
			// let unmount = ReactDOM.unmountComponentAtNode(mountNode);
			if(typeof this.props.close === 'function') {
				this.props.close();
			}
		}.bind(this), 250);
		
	}
	render() {
		let additionClassName = this.props.style === 'alert'? css.alert : "";
		return (
			<div ref="notice" styleName="notice_wrap">
				<div  styleName="notice" className={additionClassName}>
					<p>{ this.props.content }</p>
					<span styleName="remove_block">
						<i className="cross icon" styleName="remove" onClick={ this.handleClose.bind(this) }></i>
					</span>
				</div>
			</div>
		);
	}
}

const NoticeCss = CSSModules(Notice, css, { allowMultiple: true });

export default NoticeCss;
