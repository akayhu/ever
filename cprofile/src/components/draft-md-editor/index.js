import React, { PureComponent } from 'react';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { compose } from 'recompose';
import { isMobile } from 'react-device-detect';
import { EditorState, RichUtils } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	UnorderedListButton,
	OrderedListButton,
} from 'draft-js-buttons';
import LinkButton from './link/button';
import { creatLinkPlugin } from './link/decorator';
import { handleFieldCheck } from 'utils/fieldCheck';
import withScrollAnchor from 'containers/scrollAnchor';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import './style.scss';
import schema from 'config/schema';
import { fromJS } from 'immutable';

const Container = styled.div`
	position: relative;
	cursor: initial;
	width: 100%;
	word-break: break-all;
`;

/**
 * Utils
 */
const getEditorStateFromProps = props => {
	let editorState = EditorState.createEmpty();

	if (props.editorState) {
		// 有提供editorState 就直接使用
		editorState = props.editorState;
	} else if (props.html) {
		editorState = EditorState.createWithContent(
			convertFromHTML({
				htmlToEntity: (nodeName, node, createEntity) => {
					if (nodeName === 'a') {
						return createEntity('LINK', 'MUTABLE', { link: node.href });
					}
				},
			})(props.html)
		);
	}
	return editorState;
};

const getLinkFromEditorState = editorState => {
	const contentState = editorState.getCurrentContent();

	const blockKey = editorState.getSelection().getStartKey();
	const linkOffset = editorState.getSelection().getStartOffset();
	const linkKey = contentState.getBlockForKey(blockKey).getEntityAt(linkOffset);

	if (linkKey !== null) {
		const { link } = contentState.getEntity(linkKey).getData();
		return link;
	}
	return '';
};

const isShowSample = props => {
	if (!props.editable) return false;
	if (!props.showFirstUseSample) return false;
	if (!props.sampleText) return false;
	if (props.html && props.html !== '<p></p>') return false;

	return true;
};

/**
 * Editor
 */
class DraftMdEditor extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editorState: getEditorStateFromProps(props),
			showSample: isShowSample(props),
			placeHolder: props.placeHolder || '',
			html: props.html,
			invalidText: false,
		};

		// 因為連結輸入的面板會用到 focus 操作，會讓 editor 觸發 onBlur
		// 若使用 setState 會來不及阻止 onBlur 發生，所以使用了這個 workaround
		this.isLinkPanelOpen = false;

		this.inlineToolbarPlugin = createInlineToolbarPlugin({
			structure: [
				BoldButton,
				ItalicButton,
				UnderlineButton,
				UnorderedListButton,
				OrderedListButton,
				props => (
					<LinkButton
						{...props}
						link={getLinkFromEditorState(this.state.editorState)}
						onSaveLink={this.handleSaveLink}
						onRemoveLink={this.handleRemoveLink}
						onLinkPanelOpen={this.handleLinkOpen}
						onLinkPanelClose={this.handleLinkClose}
					/>
				),
			],
		});

		this.plugins = [this.inlineToolbarPlugin, creatLinkPlugin()];
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.html !== prevState.html) {
			return {
				editorState: getEditorStateFromProps(nextProps),
				html: nextProps.html,
			};
		}
		return null;
	}

	onChange = editorState => this.setState({ editorState });

	onFocus = e => this.setState({ placeHolder: '', invalidText: false });

	onBlur = e => {
		e.stopPropagation(); // 避免觸發兩次
		if (this.isLinkPanelOpen) return; // 若連結面板是開啟的，不執行 onBlur
		const { onUpdateContent, placeHolder, meta, convertType } = this.props;
		const html = convertToHTML({
			entityToHTML: (entity, originalText) => {
				if (entity.type === 'LINK') {
					const url = entity.data.url || entity.data.link;
					return (
						<a
							href={url ? url : originalText}
							target="_blank"
							rel="noopener noreferrer" // TODO: 請後端針對 a link 補上這個而非 nofollow
						>
							{originalText}
						</a>
					);
				}
				return originalText;
			},
		})(this.state.editorState.getCurrentContent());

		if (html !== this.props.html) {
			onUpdateContent(html, meta, false, convertType);
		}

		this.setState({ placeHolder: placeHolder });
		this._fieldCheck(e.target.innerText);
	};

	clearSampleText = e => {
		if (!this.props.editable) return;
		this.setState({ showSample: false }, () => {
			this.refs.editor.focus();
		});
	};

	_fieldCheck(innerText, showErrStyle = false) {
		const { blockType, drafEditorName } = this.props;

		const reFocus = !handleFieldCheck(blockType, drafEditorName, innerText);

		if (reFocus) {
			this.refs.editor.id = 'tmpIdForScroll';
			this.props.scrollToAnchor('tmpIdForScroll');
			if (showErrStyle) {
				this.setState({ invalidText: true });
			}
		}
	}

	handleLinkOpen = () => {
		this.isLinkPanelOpen = true;
	};

	handleLinkClose = () => {
		this.isLinkPanelOpen = false;
		setTimeout(this.refs.editor.focus, 0);
	};

	handleSaveLink = value => {
		const link = encodeURIComponent(
			DOMPurify.sanitize(value, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
		)
			.replace(/%2F/g, '/')
			.replace(/%3A/g, ':')
			.replace(/%20/g, '+');
		if (!link.length) return;

		const contentState = this.state.editorState.getCurrentContent();
		const blockKey = this.state.editorState.getSelection().getStartKey();
		const linkOffset = this.state.editorState.getSelection().getStartOffset();
		const linkKey = contentState
			.getBlockForKey(blockKey)
			.getEntityAt(linkOffset);

		// 選取的文字若沒有現成的 link 就新增一個 entity
		if (linkKey === null) {
			const entityKey = contentState
				.createEntity('LINK', 'MUTABLE', { link })
				.getLastCreatedEntityKey();
			this.onChange(
				RichUtils.toggleLink(
					this.state.editorState,
					this.state.editorState.getSelection(),
					entityKey
				)
			);
			return;
		}

		// 選取的文字若已存在 link 就取代它的資料
		const newContentState = contentState.replaceEntityData(linkKey, { link });
		this.onChange(EditorState.createWithContent(newContentState));
	};

	handleRemoveLink = () => {
		// 強制讓選取的文字的 linkKey 斷開關聯
		this.onChange(
			RichUtils.toggleLink(
				this.state.editorState,
				this.state.editorState.getSelection(),
				null
			)
		);
	};

	_getLengthOfSelectedText = () => {
		const currentSelection = this.state.editorState.getSelection();
		const isCollapsed = currentSelection.isCollapsed();

		let length = 0;

		if (!isCollapsed) {
			const currentContent = this.state.editorState.getCurrentContent();
			const startKey = currentSelection.getStartKey();
			const endKey = currentSelection.getEndKey();
			const startBlock = currentContent.getBlockForKey(startKey);
			const isStartAndEndBlockAreTheSame = startKey === endKey;
			const startBlockTextLength = startBlock.getLength();
			const startSelectedTextLength =
				startBlockTextLength - currentSelection.getStartOffset();
			const endSelectedTextLength = currentSelection.getEndOffset();
			const keyAfterEnd = currentContent.getKeyAfter(endKey);
			if (isStartAndEndBlockAreTheSame) {
				length +=
					currentSelection.getEndOffset() - currentSelection.getStartOffset();
			} else {
				let currentKey = startKey;

				while (currentKey && currentKey !== keyAfterEnd) {
					if (currentKey === startKey) {
						length += startSelectedTextLength + 1;
					} else if (currentKey === endKey) {
						length += endSelectedTextLength;
					} else {
						length += currentContent.getBlockForKey(currentKey).getLength() + 1;
					}

					currentKey = currentContent.getKeyAfter(currentKey);
				}
			}
		}

		return length;
	};

	_handleBeforeInput = () => {
		const { blockType, drafEditorName } = this.props;
		const checkSchema = fromJS(schema);
		const maxLen = field =>
			checkSchema.getIn([blockType, 'properties', field, 'maxLength']);

		if (drafEditorName === 'description') {
			const currentContent = this.state.editorState.getCurrentContent();
			const currentContentLength = currentContent.getPlainText('').length;
			const selectedTextLength = this._getLengthOfSelectedText();

			if (
				currentContentLength - selectedTextLength >
				maxLen(drafEditorName) - 1
			) {
				console.log(`you can type max ${maxLen(drafEditorName)} characters`);

				return 'handled';
			}
		}
	};

	_handlePastedText = pastedText => {
		const { blockType, drafEditorName } = this.props;
		const checkSchema = fromJS(schema);
		const maxLen = field =>
			checkSchema.getIn([blockType, 'properties', field, 'maxLength']);

		if (drafEditorName === 'description') {
			const currentContent = this.state.editorState.getCurrentContent();
			const currentContentLength = currentContent.getPlainText('').length;
			const selectedTextLength = this._getLengthOfSelectedText();

			if (
				currentContentLength + pastedText.length - selectedTextLength >
				maxLen(drafEditorName)
			) {
				this._fieldCheck(currentContent.getPlainText() + pastedText, false);
				console.log(`you can type max ${maxLen(drafEditorName)} characters`);

				return 'handled';
			}
		}
	};

	render() {
		const { editorState, showSample, placeHolder, invalidText } = this.state;
		const { InlineToolbar } = this.inlineToolbarPlugin;
		return (
			<Container>
				{showSample ? (
					<div onClick={this.clearSampleText} className="editor-sample-text">
						{this.props.sampleText}
					</div>
				) : (
					<div className={invalidText ? 'invalid-text' : ''}>
						<Editor
							editorState={editorState}
							onChange={this.onChange}
							onBlur={this.onBlur}
							onFocus={this.onFocus}
							ref="editor"
							spellCheck={true}
							plugins={this.plugins}
							readOnly={!this.props.editable}
							placeholder={this.props.editable ? placeHolder : undefined}
							handleBeforeInput={this._handleBeforeInput}
							handlePastedText={this._handlePastedText}
						/>
						{!isMobile && <InlineToolbar />}
					</div>
				)}
			</Container>
		);
	}
}

export default compose(withScrollAnchor)(DraftMdEditor);
