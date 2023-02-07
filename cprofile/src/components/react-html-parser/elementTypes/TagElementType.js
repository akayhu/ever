import React from 'react';
import ProcessNodes from '../utils/ProcessNodes';
import GeneratePropsFromAttributes from '../utils/GeneratePropsFromAttributes';
import TransformTagName from '../utils/TransformTagName';
import VoidElements from '../dom/elements/VoidElements';
import MediaPlayer from 'components/mediaPlayer';

/**
 * Converts any element (excluding style - see StyleElementType - and script) to a react element.
 *
 * @param {Object} node The tag node
 * @param {String} key The key to give the React element
 * @returns {React.Element} The React tag element
 */
const TagElementType = (node, key) => {
	// generate props
	const props = GeneratePropsFromAttributes(node.attribs, key);

	// transform the tag name if needed
	const tagName = TransformTagName(node.name);

	// If the node is not a void element and has children then process them
	let children = null;
	let meta = {};
	let convertTypeName = '';
	let page = '';
	if (VoidElements.indexOf(tagName) === -1) {
		children = ProcessNodes(node.children);
	}

	// create and return the element
	// return <Button/>;

	if (node.name === 'img') {
		switch (node.attribs.tagtype) {
			case 'IMAGE':
				convertTypeName = 'activity';
				break;
			case 'DOCUMENT':
				convertTypeName = 'document';
				page = -1;
				break;
			case 'VIDEO':
				meta = {
					previewUrl: node.attribs.src || '',
				};
				convertTypeName = 'video';
				break;
			case 'AUDIO':
				convertTypeName = 'audio';
				break;
			case 'YOUTUBE':
				meta = {
					youtubeId: node.attribs.file || '',
				};
				convertTypeName = 'link';
				break;
			case 'HYPERLINK':
				meta = {
					linkContent: node.attribs.linkcontent || '',
					linkImageId: node.attribs.fileid || '',
					linkImageUrl: node.attribs.src || '',
					linkTitle: node.attribs.linktitle || '',
					linkUrl: node.attribs.linkurl || '',
				};
				convertTypeName = 'link';
				break;
			case 'LINK':
				meta = {
					linkUrl: node.attribs.src || '',
					originalText: '測試連結',
				};
				break;
			default:
				meta = {};
				convertTypeName = '';
				page = '';
				break;
		}

		let actionType;

		if (node.attribs.fileid) {
			actionType = [
				`REQUEST_DOCUMENT_URL_${node.attribs.fileid}`,
				`RECIEVE_DOCUMENT_URL_${node.attribs.fileid}`,
				`FAILURE_DOCUMENT_URL_${node.attribs.fileid}`,
			];
		} else {
			actionType = '';
		}

		return (
			<MediaPlayer
				key={node.attribs.fileid || ''}
				fileId={node.attribs.fileid || ''}
				mediaType={node.attribs.tagtype || ''}
				convertType={convertTypeName}
				meta={meta}
				actionType={actionType}
				page={page}
			/>
		);
	} else {
		return React.createElement(tagName, props, children);
	}
};

export default TagElementType;
