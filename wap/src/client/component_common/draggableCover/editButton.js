import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
// utils
import { getResizedImgInfo} from './utils';

class EditButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fileErrorMsg : '',
			deleteCoverLightbox: false
		};

		this.uploadImage = this.uploadImage.bind(this);
		this.updateCover = this.updateCover.bind(this);
		this.deleteCover = this.deleteCover.bind(this);
	}
	closeLightBox() {
		document.getElementById("cover_file").value="";
		this.setState({fileErrorMsg: ''});
		this.props.onEvent('emptyFile');
		document.body.style.cursor = 'default';
	}
	listOnclick() {
		this.cover_fileinput.click();
	}
	uploadImage() {
		const file = document.getElementById("cover_file").files[0];
		const fileType = /^image\/(png|jpeg|gif|bmp|jpg|vnd.wap.wbm)/;


		if( file.size > 10485760 ) {
			this.setState({
				fileErrorMsg: '請選擇容量小於 10 MB的圖片'
			});
			return;
		}

		if (!fileType.test(file.type)) {
			this.setState({
				fileErrorMsg: '請選擇檔案格式為 jpg，gif，png，jpeg，bmp 的圖片'
			});
			return;
		}

		this.props.onEvent('startUpload');

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			this.processImgSrc(e.target.result, file);
		};
	}
	updateCover() {
		this.props.onEvent('startUpload');

		return this.props.updateCover()
		.then((srcUrl) => {
			this.processImgSrc(srcUrl, null, false);
		})
		.catch((err) => {
			this.props.onEvent('error', err);
		});
	}
	deleteCover() {
		return this.props.deleteCover().then(() => {
			this.setState({
				deleteCoverLightbox: false
			})
		});
	}
	processImgSrc(srcImg, file, isNew = true) {
		const tempImg = new Image(); // 暫存用的

		tempImg.src = srcImg;
		tempImg.crossOrigin = 'anonymous';
		tempImg.onload = () => {
			if (!this.availableImg(tempImg)) {
				return;
			}

			this.completeUpload(tempImg, file, isNew);
		};
	}
	availableImg(img) {
		if (img.width < 750 || img.height < 274) {
			this.props.onEvent('smallImg');
			return false;
		}else if( img.width > 9999 || img.height > 9999 ){
			this.props.onEvent('bigImg');
			return false;
		}

		return true;
	}
	completeUpload(srcImg, rawFile, isNew = true) {
		const { containerSize: { width, height }, onFinishUpload } = this.props;
		const { imgUrl, newWidth, newHeight } = getResizedImgInfo(srcImg, width, height);

		onFinishUpload({
			rawFile,
			imgUrl,
			xRange: Math.max(newWidth - width, 0),
			yRange: Math.max(newHeight - height, 0)
		}, isNew);
	}
	alertDeleteCoverLightbox() {
		this.setState({
			deleteCoverLightbox: !this.state.deleteCoverLightbox
		});
	}
	render() {
		const { coverIsDefault } = this.props;
		const lightboxOptionFileTypeError = {
			onClose: this.closeLightBox.bind(this),
			closeIcon: true
		};
		const lightboxOptionDelete = {
			submit: {
				text: '刪除',
				action: this.deleteCover.bind(this)
			},
			cancel: {
				text: '取消'
			}
		};

		return (
			<div>
				<input
					id="cover_file"
					ref={ _ref => this.cover_fileinput = _ref }
					type="file"
					name="cover_file"
					styleName="cover_fileinput"
					onChange={ this.uploadImage }
					accept="image/*"
				/>
				{/* <DropdownMenu styleName="dropdown_block tooltip">
					<p styleName="tooltip_text">最小限制：750 * 274</p>
					<DropdownTarget styleName="target">
						<i className="edit icon" />
					</DropdownTarget>
					<div className="dropdownList">
						<DropdownList>
							<ul className="dropdown" styleName="option_ul">
								<li onClick={ () => this.listOnclick() }>
									<form id="cover_fileupload" data-gtm-profile="更換風景照">
										<i />更換照片
									</form>
								</li>
								{
									!coverIsDefault &&
									<li onClick={ this.updateCover } >
										<i />調整照片
									</li>
								}
								{
									!coverIsDefault &&
									<li onClick={ this.alertDeleteCoverLightbox.bind(this) } >
										<i />刪除照片
									</li>
								}
							</ul>
						</DropdownList>
					</div>
				</DropdownMenu> */}
				{
					this.state.fileErrorMsg.length > 0 &&
					<LightBox option={ lightboxOptionFileTypeError } onClose={ this.closeLightBox.bind(this) }>
						{ this.state.fileErrorMsg }
					</LightBox>
				}
				{
					this.state.deleteCoverLightbox &&
					<LightBox option={ lightboxOptionDelete } onClose={ this.alertDeleteCoverLightbox.bind(this) } >
						<h3>確定要刪除照片</h3>
					</LightBox>
				}
			</div>
		);
	}
}

EditButton.propTypes = {
	onEvent: PropTypes.func,
	onFinishUpload: PropTypes.func,
	updateCover: PropTypes.func, // 提供調整的原圖(url or function)
	deleteCover: PropTypes.func,
	containerSize: PropTypes.object
};

const EditButtonCss = CSSModules(EditButton, css, {allowMultiple: true});
export default EditButtonCss;
