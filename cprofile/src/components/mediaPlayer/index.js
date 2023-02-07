import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPreviewFile } from 'actions/document';
import PropTypes from 'prop-types';
import DocumentPlayer from './player.js';
import { mediaTypeMap, pickTagWithOrder, tagsMap } from 'config/document';
import './style.css';

// TODO: 缺手機版顯示

/**
 * 多媒體 entity 與 React Component 對照表
 *
 * <img tagType />  <->  React Component
 */

export const entityConvertMap = {
	TEXT: {
		entity: ({ text }) => `<p>${text}</p>`,
		component: ({ meta: { text }, convertType, fileUrlMap }) => <p>{text}</p>,
	},
	IMAGE: {
		entity: ({ fileId }) => `<img tagType="IMAGE" fileId="${fileId}" alt="" />`,
		component: ({ meta, convertType, fileUrlMap }) => {
			const url =
				pickTagWithOrder(fileUrlMap, tagsMap.IMAGE[convertType]) || '';
			return <img src={url} alt="images" width="100%" />;
		},
	},
	VIDEO: {
		entity: ({ fileId }) => `<img tagType="VIDEO" fileId="${fileId}"/>`,
		component: ({ meta, convertType, fileUrlMap }) => {
			const url = pickTagWithOrder(fileUrlMap, tagsMap.VIDEO.video) || '';
			return <video src={url} controls width="100%" />;
		},
	},
	DOCUMENT: {
		entity: ({ fileId }) => `<img tagType="DOCUMENT" fileId="${fileId}"/>`,
		component: ({ meta, convertType, fileUrlMap }) => (
			<DocumentPlayer fileUrlMap={fileUrlMap} meta={meta} />
		),
	},
	AUDIO: {
		entity: ({ fileId }) => `<img tagType="AUDIO" fileId="${fileId}"/>`,
		component: ({ meta, convertType, fileUrlMap }) => {
			const url = pickTagWithOrder(fileUrlMap, tagsMap.AUDIO.audio) || '';
			return <audio src={url} controls />;
		},
	},
	HYPERLINK: {
		entity: ({ fileId, url }) =>
			`<img tagType="HYPERLINK" fileId="${fileId}" url="${url}"/>`,
		component: ({
			meta: { linkContent, linkImageId, linkImageUrl, linkTitle, linkUrl },
			convertType,
			fileUrlMap,
		}) => {
			return (
				<div className="block">
					<a href={linkUrl} target="_blank" rel="noopener noreferrer">
						<span className="link">{linkUrl || ''}</span>
						<div className="linkBlock">
							<span
								className="hyper-image"
								style={{
									background: `url(${linkImageUrl}) 100% center`,
									backgroundSize: 'cover',
								}}
							/>
							<div className="info">
								<h3>{linkTitle || ''}</h3>
								<p>{linkContent || ''}</p>
							</div>
							<img className="loadImage" src={linkImageUrl} alt="loadImage" />
						</div>
					</a>
				</div>
			);
		},
	},
	LINK: {
		entity: ({ href, originalText }) =>
			`<a href="${href}" target="_blank">${originalText}</a>`,
		component: ({
			meta: { linkUrl, originalText },
			convertType,
			fileUrlMap,
		}) => (
			<a href={linkUrl} target="_blank" rel="noopener noreferrer">
				{originalText}
			</a>
		),
	},
	YOUTUBE: {
		entity: ({ file, url, src }) =>
			`<img tagType="YOUTUBE" file="${file}" url="${url}" src="${src}"/>`,
		component: ({ meta: { url, youtubeId }, convertType, fileUrlMap }) => (
			<div className="block">
				<a href={url} target="_blank" rel="noopener noreferrer">
					{url}
				</a>
				<div>
					<iframe
						width="476"
						height="267.5"
						src={`https://www.youtube.com/embed/${youtubeId}`}
						title="YOUTUBE"
						frameBorder="0"
					/>
				</div>
			</div>
		),
	},
};

export class MediaPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			transformed: props.mediaType !== 'YOUTUBE' ? false : true,
			error: false,
			fileUrlMap: {},
		};
	}

	componentDidMount = () => {
		const { transformed } = this.state;
		const {
			fetchPreviewFile,
			fileId,
			mediaType,
			convertType,
			actionType,
			page,
			isGallery,
		} = this.props;
		if (!transformed) {
			if (fileId) {
				fetchPreviewFile(fileId, {
					mediaType,
					convertType,
					onSuccess: this.onGetFileUrlSuccess,
					onError: this.onGetFileUrlError,
					fetchPreviewFile,
					actionType,
					page,
					isGallery,
				});
				return;
			}
		}
	};

	onGetFileUrlSuccess = fileUrlMap => {
		this.setState({
			transformed: true,
			fileUrlMap,
		});
	};

	onGetFileUrlError = error => {
		this.setState({
			transformed: false,
			error: true,
		});
	};

	render() {
		const { mediaType, meta, convertType } = this.props;
		const { transformed, fileUrlMap } = this.state;
		if (!mediaType || !mediaTypeMap.hasOwnProperty(mediaType)) return null;

		if (!transformed) {
			return (
				<div className="loading-preset">
					<div className="loading" />
					<p className="handleText">檔案處理中</p>
				</div>
			);
		}

		const Template = entityConvertMap[mediaType].component;

		return (
			<Template fileUrlMap={fileUrlMap} meta={meta} convertType={convertType} />
		);
	}
}

MediaPlayer.propTypes = {
	/** Doc API 檔案唯一識別碼 */
	fileId: PropTypes.string,
	/** 多媒體檔案類型，參見 config/document 的 mediaTypeMap */
	mediaType: PropTypes.oneOf([
		'TEXT',
		'VIDEO',
		'AUDIO',
		'IMAGE',
		'DOCUMENT',
		'YOUTUBE',
		'HYPERLINK',
		'LINK',
	]).isRequired,
	/** 多媒體檔案子類型，tag 會以此有所不同。例如：圖片 > 頭像、封面圖 ... */
	convertType: PropTypes.oneOf([
		'avatar',
		'cover',
		'companyLogo',
		'activity',
		'video',
		'document',
		'audio',
		'link',
	]),
	/** 多媒體檔案的補充資訊 */
	meta: PropTypes.object,
};

MediaPlayer.defaultProps = {
	fileId: '',
	meta: {},
	isGallery: false,
};

export default connect(
	null,
	{
		fetchPreviewFile,
	}
)(MediaPlayer);
