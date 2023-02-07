import React, { Component, Fragment } from 'react';
import DOMPurify from 'dompurify';
import { handleFieldCheck } from 'utils/fieldCheck';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withScrollAnchor from 'containers/scrollAnchor';
import './style.css';

class editableText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSample: props.showFirstUseSample || false,
			placeHolder: props.placeHolder || '',
			invalidText: false,
		};
	}

	handleKeydown = e => {
		if (!this.props.editable) return;
		if (e.keyCode === 13) {
			if (!this.props.preventBreakLine) return;
			e.preventDefault();
			this.updateData(e);
		}
	};

	handleClick = e => {
		if (!this.props.editable) return;
		if (this.state.showSample) this.setState({ showSample: false });
	};

	handleOnFocus = e => this.setState({ placeHolder: '', invalidText: false });

	_fieldCheck(innerText) {
		const { blockType, editableName } = this.props;
		const reFocus = !handleFieldCheck(blockType, editableName, innerText);
		if (reFocus) {
			this.paragraphRef.id = 'tmpIdForScroll';
			this.props.scrollToAnchor('tmpIdForScroll');
			this.setState({ invalidText: true });
		}
	}

	updateData = e => {
		if (!this.props.editable) return;
		const { onUpdateData, placeHolder, meta, convertType } = this.props;
		const reg = /<(?:.|\s)*?>/g; // 過濾html標籤
		const htmlContent = e.target.innerHTML.replace(reg, '');
		onUpdateData(htmlContent, meta, false, convertType);
		this.setState({ placeHolder: placeHolder });
		this._fieldCheck(e.target.innerText);
	};

	handleOnPaste = e => {
		e.persist();
		setTimeout(() => {
			this.paragraphRef.innerText = e.target.innerText;
		}, 0);
	};

	render() {
		const { text, className, editable, isRequired, sampleText } = this.props; // 顯示順序：真實 text > sampleText > empty (placeHolder)
		const value =
			text || (editable && this.state.showSample && sampleText) || '';

		return (
			<Fragment>
				<p
					className={`editable-text ${className} ${
						this.state.showSample && !text ? 'editable-sample-text' : ''
					} ${this.state.invalidText ? 'invalid-text' : ''}`}
					contentEditable={editable}
					required={isRequired || false}
					placeholder={editable ? this.state.placeHolder : undefined}
					onBlur={this.updateData}
					onPaste={this.handleOnPaste}
					ref={el => {
						this.paragraphRef = el;
					}}
					onKeyDown={this.handleKeydown}
					onClick={this.handleClick}
					onFocus={this.handleOnFocus}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(value, {
							ALLOWED_TAGS: [],
							KEEP_CONTENT: true,
						}),
					}}
				/>
			</Fragment>
		);
	}
}

const mapStateToPorps = state => ({
	config: state.get('config'),
});

export default compose(
	connect(mapStateToPorps),
	withScrollAnchor
)(editableText);
