import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { MediaPlayer } from 'c_wap_module';
import compose from 'src/util/compose';

class Attachment extends Component {
	constructor(props) {
		super(props);
		this.attachmentProperty = {
			fileid: '',
			src: '',
			tagtype: ''
		};
	}
	componentWillMount() {
		const { attachment } = this.props;
		if (attachment !== null) {
			this.attachmentProperty = {
				fileid: attachment.activityFileId,
				src: attachment.activityFileUrl,
				tagtype: attachmentTypeFilter(attachment.contentType)
			};
		}
	}
	render() {
		return (
			<div styleName="attachment_block">
				{
					this.props.updateMode &&
					<i className="cross icon" styleName="crossItem" onClick={ this.props.removeAttachment } />
				}
				{
					this.props.attachment.convertStatus === 1 &&
					<div styleName="preview_image">
						<MediaPlayer property={ this.attachmentProperty } />
					</div>
				}
				{
					this.props.attachment.convertStatus === 0 &&
					<div>
						<i className="ui loading" styleName="uploading_icon" />
						<div styleName="uploading_hint">檔案上傳中</div>
					</div>
				}
				{
					this.props.attachment.convertStatus === -1 &&
					<div>
						<div styleName="uploading_hint">檔案處理錯誤，無法顯示</div>
					</div>
				}
			</div>
		);
	}
}

function attachmentTypeFilter(type) {
	switch (type) {
		case 2:
			return 'IMAGE';
		case 3:
			return 'VIDEO';
		case 4:
			return 'DOCUMENT';
		case 5:
			return 'AUDIO';
		default:
			return 'IMAGE';
	}
}

Attachment.defaultProps = {
	updateMode: false,
};

Attachment.propTypes = {
	updateMode: PropTypes.bool,
	attachment: PropTypes.object,
	removeAttachment: PropTypes.func
};


export default compose(
	// connect(mapStateToProps, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Attachment);
