import { Entity } from 'draft-js';

const convertPattern = {
	/* convert to HTML pattern */
	styleToHTML: {},
	blockToHTML: {
		atomic: {
			start: '<figure>',
			end: '</figure>',
			empty: '<br>'
		},
		blockquote: {
			start: '<blockquote>',
			end: '</blockquote>'
		}
	},
	entityToHTML: (entity, originalText) => {
		switch (entity.type) {
			case 'IMAGE':
				return `<img tagType="IMAGE" fileId="${entity.data.fileId}"/>`;
			case 'DOCUMENT':
				return `<img tagType="DOCUMENT" fileId="${entity.data.fileId}"/>`;
			case 'HYPERLINK':
				return `<img tagType="HYPERLINK" fileId="${entity.data.fileId}"/>`;
			case 'YOUTUBE':
				return `<img tagType="YOUTUBE" file="${entity.data.file}" url="${entity.data.url}" src="${entity.data.src}"/>`;
			case 'VIDEO':
				return `<img tagType="VIDEO" fileId="${entity.data.fileId}"/>`;
			case 'AUDIO':
				return `<img tagType="AUDIO" fileId="${entity.data.fileId}"/>`;
			case 'mention':
				if (typeof (entity.data.mention.get) === 'undefined') {
					return `<span tagType="MEMBER" pid="${entity.data.mention.id}"></span>`;
				}
				return `<span tagType="MEMBER" pid="${entity.data.mention.get('id')}"></span>`;

			case 'LINK':
				const { href, url } = entity.data;
				const link = href || url;

				return `<a href="${link}" target="_blank">${originalText}</a>`;
			default:
				return originalText;
		}
	},
	/* convert from HTML pattern (如果沒用到就不必加)*/
	htmlToStyle: (nodeName, node, currentStyle) => currentStyle,
	htmlToEntity: (nodeName, node) => {
		const data = {};
		if (typeof (node.attributes) !== 'undefined') {
			Array.prototype.slice.call(node.attributes).forEach((item) => {
				let name = item.name;
				if (name === 'fileid') name = 'fileId';
				else if (name === 'tagtype') name = 'tagType';

				data[name] = item.value;
			});
		}

		switch (nodeName) {
			case 'img':
				return Entity.create(node.getAttribute('tagtype'), 'IMMUTABLE', data);
			case 'a':
				return Entity.create('LINK', 'MUTABLE', data);
			case 'span':
			case 'div':
				if (node.getAttribute('tagtype') === 'MEMBER') {
					const transData = {
						mention: {
							id: data.pid,
							link: data.pid,
							name: node.innerText,
							avatar: ''
						}
					};
					return Entity.create('mention', 'SEGMENTED', transData);
				}
				return false;
			default:
				return false;
		}
	},
	htmlToBlock: (nodeName, node) => {
		if (nodeName === 'blockquote') {
			return {
				type: 'blockquote',
				data: {}
			};
		} else if (nodeName === 'figure') {
			return {
				type: 'atomic',
				data: {}
			};
		}
	}
};


export default convertPattern;
