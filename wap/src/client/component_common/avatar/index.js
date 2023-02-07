// import { connect } from 'react-redux';
import React, {Component} from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Cropper from './crop';
import MoveCropper from './crop/moveCrop';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import ImageComponent from 'src/client/component_common/image';
// 不要取名Image 會蓋過去new Image(); 這個原始的function

class Avatar extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			editFileUrl: '',
			cropperType: 'create',
			showCropper: false,
			fileError: '',
			deleteAvatarLightbox: false
		};
		this.disabledAction = false;
	}
	closeLightBox() {
		document.getElementById('avatar_file').value = '';
		this.setState({showCropper: false, fileTypeError: false, fileError: ''});
		document.body.style.cursor = 'default';
	}
	formClick() {
		this.avatar_file.click();
		this.avatar_file.onchange = this.uploadImage.bind(this);
	}
	uploadImage() {
		const file = document.getElementById('avatar_file').files[0];
		const fileType = /^image\//;

		if( file.size > 10485760) {
			this.setState({	fileError: '請選擇容量小於 10 MB的圖片' });
			return;
		}

		if (!file || !fileType.test(file.type)) {
			this.setState({	fileError: '請選擇檔案格式為 jpg，gif，png，jpeg，bmp 的圖片' });
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			const tempImg = new Image();
			tempImg.src = e.target.result;
			tempImg.onload = () => {
				if (tempImg.width < 150 || tempImg.height < 150) {
					this.setState({	fileError: '請選擇長寬至少150*150的圖片' });
					return;
				}

				if (tempImg.width > 9999 || tempImg.height > 9999) {
					this.setState({	fileError: '請選擇寬小於 9999 像素和高小於9999 像素的圖片' });
					return;
				}
				this.setState({
					cropperType: 'create',
					ori_file: file,
					showCropper: true
				});
				
			};
		};
		// 
	}
	updateAvatar() {
		return this.props.updateAvatar().then((editFileUrl) => {
			this.setState({cropperType: 'adjust', showCropper: true, editFileUrl});
		});
	}
	deleteAvatar() {
		if (this.disabledAction) return;
		this.disabledAction = true;
		return this.props.deleteAvatar().then(() => {
			this.setState({showCropper: false, deleteAvatarLightbox: false});
			document.body.style.cursor = 'default';
			this.disabledAction = false;
		});
	}
	submitAvatar(params) {
		return this.props.submitAvatar(this.state.cropperType, params).then(() => {
			document.getElementById('avatar_file').value = '';
			this.setState({showCropper: false});
			document.body.style.cursor = 'default';
		});
	}
	alertDeleteAvatarLightbox() {
		this.setState({
			deleteAvatarLightbox: !this.state.deleteAvatarLightbox
		});
	}
	render() {
		const lightboxOptionDelete = {
			submit: {
				text: '刪除',
				action: this.deleteAvatar.bind(this)
			},
			cancel: {
				text: '取消'
			}
		};
		const lightboxOptionUpdate = {
			title: '調整個人圖片',
			closeIcon: true  // 有無close ICON,
		};
		const lightboxOptionFileTypeError = {
			onClose: this.closeLightBox.bind(this),
			closeIcon: true
		};
		const {avatarWebUrl, avatarIsDefault, editable, avatarCoordinate} = this.props;
		return (
			<div styleName="avatar_wrap">
				<div styleName="avatar_img_block">
					<ImageComponent
						src={ avatarWebUrl }
						type="avatar"
						className={ css.avatar_img }
						retry
					/>
					<input
						id="avatar_file"
						ref={ _ref => this.avatar_file = _ref }
						type="file"
						name="avatar_file"
						styleName="avatar_fileinput"
						onChange={ this.uploadImage.bind(this) }
						accept="image/*"
					/>
					{/* {
						editable &&
						<div>
							<DropdownMenu styleName="dropdown_block tooltip">
								<span styleName="tooltip_text">最小限制：300 * 300</span>
								<DropdownTarget>
									<i className="edit icon" />
								</DropdownTarget>
								<DropdownList>
									<ul className="dropdown">
										<li onClick={ this.formClick.bind(this) } data-gtm-profile="更換大頭照">
											<i />更換照片
										</li>
										{
											!avatarIsDefault &&
											<li onClick={ this.updateAvatar.bind(this) }>
												<i />調整照片
											</li>
										}
										{
											!avatarIsDefault &&
											<li onClick={ this.alertDeleteAvatarLightbox.bind(this) }>
												<i />刪除照片
											</li>
										}
									</ul>
								</DropdownList>
							</DropdownMenu>
							{
								this.state.fileError !== '' &&
								<LightBox option={ lightboxOptionFileTypeError } onClose={ this.closeLightBox.bind(this) }>
									{this.state.fileError}
								</LightBox>
							}
						</div>
					} */}
					{
						this.state.showCropper &&
						<LightBox refs="lightbox" option={ lightboxOptionUpdate } onClose={ this.closeLightBox.bind(this) }>
							{
								this.state.cropperType === 'create' &&
								<Cropper
									aspect
									file={ this.state.ori_file }
									baseWidth={ 534 }
									baseHeight={ 300 }
									minCropWidth={ 150 }
									minCropHeight={ 150 }
									completeCrop={ this.submitAvatar.bind(this) }
									cancelCrop={ this.closeLightBox.bind(this) }
								/>
							}
							{
								this.state.cropperType === 'adjust' &&
								<MoveCropper
									aspect
									fileUrl={ this.state.editFileUrl }
									baseWidth={ 534 }
									baseHeight={ 300 }
									minCropWidth={ 150 }
									minCropHeight={ 150 }
									coordination={ avatarCoordinate }
									completeCrop={ this.submitAvatar.bind(this) }
									cancelCrop={ this.closeLightBox.bind(this) }
								/>
							}
						</LightBox>
					}
					{
						this.state.deleteAvatarLightbox &&
						<LightBox option={ lightboxOptionDelete } onClose={ this.alertDeleteAvatarLightbox.bind(this) } >
							<h3>確定要刪除照片</h3>
						</LightBox>
					}
				</div>
			</div>
		);
	}
}

export default CSSModules(Avatar, css, {allowMultiple: true});
