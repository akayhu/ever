import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clientConfig from 'src/configs/client';
import style from './style.css';

class MoveCropper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
		this.information = {
			resizedWidth: 0, // 所見範圍，取決於Props.baseWidth & Props.baseHeight
			resizedHeight: 0,
			editWidth: 0,
			editHeight: 0
		};
		this.eventState = {
			isResize: false,
			startX: 0,
			startY: 0,
			deltaX: 0,
			deltaY: 0,
			cropStartX: 0,
			cropStartY: 0,
			cropStartWidth: 0,
			cropStartHeight: 0
		};
		this.crop = {
			cropWindow: null,
			initImg: null,
			imageCir: null,
			ratio: 1,
			x: 40,
			y: 40,
			width: 20,
			height: 20
		};
		this.canAct = false;
		this.imgOnload = this.imgOnload.bind(this);
		this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
		this.cropActionStart = this.cropActionStart.bind(this);
		this.handleFinish = this.handleFinish.bind(this);
	}

	componentDidMount() {
		this.crop.cropWindow = this.refs.cropWindow;
		this.crop.initImg = this.refs.image;
		this.crop.imageCir = this.refs.imageCir;
		document.addEventListener('mousemove', this.handleOnMouseMove);
		document.addEventListener('mouseup', this.handleOnMouseUp);
		this.initCropper();
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.handleOnMouseMove);
		document.removeEventListener('mouseup', this.handleOnMouseUp);
	}

	initCropper() {
		this.refs.image.src = this.props.fileUrl; // got to initialImage
	}

	imgOnload() {
		const { baseWidth, baseHeight } = this.props;
		const coordination = this.props.coordination;
		const crop = this.crop;
		let width = this.refs.image.width;
		let height = this.refs.image.height;
		// 記錄 原始尺寸 (其中一邊符合長為534或是高為300 另一邊不大於)
		this.information.resizedWidth = width;
		this.information.resizedHeight = height;
		// 縮放圖片
		// default rule
		if (width / height > baseWidth / baseHeight) {
			this.information.editHeight = baseHeight; // 記錄 編輯尺寸 (其中一邊符合長為534或是高為300 另一邊不小於)
			this.information.editWidth = Math.round(this.information.resizedWidth * (baseHeight / this.information.resizedHeight));
			height *= baseWidth / width;
			width = baseWidth;
		} else {
			this.information.editWidth = baseWidth; // 記錄 編輯尺寸 (其中一邊符合長為534或是高為300 另一邊不小於)
			this.information.editHeight = Math.round(this.information.resizedHeight * (baseWidth / this.information.resizedWidth));
			width *= baseHeight / height;
			height = baseHeight;
		}
		this.crop.minWidth = (this.props.minCropWidth / this.information.resizedWidth) * 100;
		this.crop.minHeight = (this.props.minCropHeight / this.information.resizedHeight) * 100;

		// 初始cropwindow位置
		crop.width = ((coordination.rbx - coordination.ltx) / crop.initImg.width) * 100;
		crop.height = ((coordination.rby - coordination.lty) / crop.initImg.height) * 100;
		crop.x = (coordination.ltx / crop.initImg.width) * 100;
		crop.y = (coordination.lty / crop.initImg.height) * 100;

		if (
			coordination.rbx === 0 &&
			coordination.ltx === 0 &&
			coordination.rby === 0 &&
			coordination.lty === 0
		) {
			crop.width = this.crop.minWidth;
			crop.height = this.crop.minHeight;
			crop.x = 50 - (crop.width / 2);
			crop.y = 50 - (crop.height / 2);
		}

		crop.ratio = crop.width / crop.height;
		crop.minWidth = (150 / crop.initImg.width) * 100;
		crop.minHeight = (150 / crop.initImg.height) * 100;
		// setCropwindow
		this.setCropwindow();
		// set cropedImage
		this.setCropedImage();
	}

	setCropwindow() {
		const { y, x, width, height } = this.crop;
		this.crop.cropWindow.style.top = `${y}%`;
		this.crop.cropWindow.style.left = `${x}%`;
		this.crop.cropWindow.style.width = `${width}%`;
		this.crop.cropWindow.style.height = `${height}%`;
	}

	setCropedImage() {
		const { initImg, imageCir } = this.crop;
		const { x, y, width, height } = this.getPixelOfCropwindow();
		const { editWidth, resizedWidth } = this.information;
		const canvas = document.createElement('canvas');
		let ratio = 1;
		if (editWidth > resizedWidth) {
			ratio = editWidth / resizedWidth;
		} else {
			ratio = resizedWidth / editWidth;
		}
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(
			initImg,
			(x * ratio), (y * ratio), (width * ratio), (height * ratio),
			0, 0,
			width, height
		);
		const dataUrl = canvas.toDataURL('image/jpeg');
		imageCir.src = dataUrl;
	}
	/* setCropedImage stack */
	getPixelOfCropwindow(round = false) {
		const { initImg } = this.crop;
		let { x, y, width, height } = this.crop;
		x = this.percentToPixel(x, initImg.width);
		y = this.percentToPixel(y, initImg.height);
		width = this.percentToPixel(width, initImg.width);
		height = this.percentToPixel(height, initImg.height);

		if (round) {
			x = Math.round(x);
			y = Math.round(y);
			width = Math.round(width);
			height = Math.round(height);
		}
		return { x, y, width, height };
	}

	percentToPixel(percent, total) {
		return percent * total / 100;
	}
	/* ******************* */

	cropActionStart(e) {
		e.preventDefault();
		const { cropWindow, imageCir, x, y, width, height } = this.crop;
		const startPos = this.getClientPos(e);

		this.eventState = {
			isResize: (e.target !== cropWindow && e.target !== imageCir),
			selectedCorner: null,
			startX: startPos.x,
			startY: startPos.y,
			cropStartX: x,
			cropStartY: y,
			cropStartWidth: width,
			cropStartHeight: height
		};

		if (this.eventState.isResize) {
			this.eventState.selectedCorner = e.target;
		}

		this.canAct = true;
	}

	handleOnMouseMove(e) {
		if (!this.canAct) { return; }

		const { initImg } = this.crop;
		const eventState = this.eventState;
		const movingPos = this.getClientPos(e);

		eventState.deltaX = ((movingPos.x - eventState.startX) / initImg.width) * 100;
		eventState.deltaY = ((movingPos.y - eventState.startY) / initImg.height) * 100;

		if (eventState.isResize) {
			this.resizeCrop(eventState.selectedCorner);
		} else {
			this.dragCrop();
		}
		this.setCropwindow();
		this.setCropedImage();
	}

	handleOnMouseUp() {
		this.canAct = false;
	}

	resizeCrop(corner) {
		const { cropStartX, cropStartY, cropStartWidth, cropStartHeight, deltaX, deltaY } = this.eventState;
		const { minHeight, minWidth, ratio } = this.crop;

		if (this.props.aspect) {
			// 以寬為基底來調整高和top left
			// 1. 計算寬度 2.以寬度來等比得到高度 3.寬度需被高度牽制 4.用寬or高來回推left or top
			switch (corner) {
				case this.refs.se:
					this.crop.width = this.getBoundedValue(cropStartWidth + deltaX, minWidth, 100 - cropStartX);
					this.crop.height = this.getBoundedValue(this.crop.width / ratio, minHeight, 100 - cropStartY);
					this.crop.width = this.getBoundedValue(this.crop.height * ratio, minWidth, 100 - cropStartX);
					break;
				case this.refs.ne:
					this.crop.width = this.getBoundedValue(cropStartWidth + deltaX, minWidth, 100 - cropStartX);
					this.crop.height = this.getBoundedValue(this.crop.width / ratio, minHeight, cropStartHeight + cropStartY);
					this.crop.width = this.getBoundedValue(this.crop.height * ratio, minWidth, 100 - cropStartX);
					this.crop.y = this.getBoundedValue((cropStartY + cropStartHeight) - this.crop.height, 0, (cropStartY + cropStartHeight) - minHeight);
					break;
				case this.refs.sw:
					this.crop.width = this.getBoundedValue(cropStartWidth - deltaX, minWidth, cropStartWidth + cropStartX);
					this.crop.height = this.getBoundedValue(this.crop.width / ratio, minHeight, 100 - cropStartY);
					this.crop.width = this.getBoundedValue(this.crop.height * ratio, minWidth, cropStartWidth + cropStartX);
					this.crop.x = this.getBoundedValue((cropStartX + cropStartWidth) - this.crop.width, 0, (cropStartX + cropStartWidth) - minWidth);
					break;
				case this.refs.nw:
					this.crop.width = this.getBoundedValue(cropStartWidth - deltaX, minWidth, cropStartWidth + cropStartX);
					this.crop.height = this.getBoundedValue(this.crop.width / ratio, minHeight, cropStartY + cropStartHeight);
					this.crop.width = this.getBoundedValue(this.crop.height * ratio, minWidth, cropStartWidth + cropStartX);
					this.crop.x = this.getBoundedValue((cropStartX + cropStartWidth) - this.crop.width, 0, (cropStartX + cropStartWidth) - minWidth);
					this.crop.y = this.getBoundedValue((cropStartY + cropStartHeight) - this.crop.height, 0, (cropStartY + cropStartHeight) - minHeight);
					break;
				}
		} else {
			switch (corner) {
				case this.refs.se:
					this.crop.width = this.getBoundedValue(cropStartWidth + deltaX, minWidth, 100 - cropStartX);
					this.crop.height = this.getBoundedValue(cropStartHeight + deltaY, minHeight, 100 - cropStartY);
					break;
				case this.refs.ne:
					this.crop.y = this.getBoundedValue(cropStartY + deltaY, 0, (cropStartY + cropStartHeight) - minHeight);
					this.crop.width = this.getBoundedValue(cropStartWidth + deltaX, minWidth, 100);
					this.crop.height = this.getBoundedValue(cropStartHeight - deltaY, minHeight, cropStartHeight + cropStartY);
					break;
				case this.refs.sw:
					this.crop.x = this.getBoundedValue(cropStartX + deltaX, 0, (cropStartX + cropStartWidth) - minWidth);
					this.crop.width = this.getBoundedValue(cropStartWidth - deltaX, minWidth, cropStartWidth + cropStartX);
					this.crop.height = this.getBoundedValue(cropStartHeight + deltaY, minHeight, 100 - cropStartY);
					break;
				case this.refs.nw:
					this.crop.x = this.getBoundedValue(cropStartX + deltaX, 0, (cropStartX + cropStartWidth) - minWidth);
					this.crop.y = this.getBoundedValue(cropStartY + deltaY, 0, (cropStartY + cropStartHeight) - minHeight);
					this.crop.width = this.getBoundedValue(cropStartWidth - deltaX, minWidth, cropStartWidth + cropStartX);
					this.crop.height = this.getBoundedValue(cropStartHeight - deltaY, minHeight, cropStartHeight + cropStartY);
					break;
			}
		}
	}

	dragCrop() {
		const { width, height } = this.crop;
		const { cropStartX, cropStartY, deltaX, deltaY } = this.eventState;

		this.crop.x = this.getBoundedValue(cropStartX + deltaX, 0, 100 - width);
		this.crop.y = this.getBoundedValue(cropStartY + deltaY, 0, 100 - height);
	}

	getBoundedValue(finalPos, min, max) {
		return Math.min(Math.max(finalPos, min), max);
	}

	getElementOffset(element) {
		// 回傳元素的top和left座標
		const rect = element.getBoundingClientRect();
		const docEl = document.documentElement;

		const rectTop = (rect.top + window.pageYOffset) - docEl.clientTop;
		const rectLeft = (rect.left + window.pageXOffset) - docEl.clientLeft;

		return {
			y: rectTop,
			x: rectLeft
		};
	}

	getClientPos(e) {
		// 拿到滑鼠座標
		return {
			x: e.pageX,
			y: e.pageY
		};
	}

	handleFinish() {
		this.setState({ loading: true });
		const { x, y, width, height } = this.getPixelOfCropwindow(true);
		const { resizedWidth, resizedHeight, editWidth, editHeight } = this.information;
		const ltx = x;
		const lty = y;
		const rbx = x + width;
		const rby = y + height;
		document.body.style.cursor = 'wait';
		if (this.props.completeCrop) {
			this.props.completeCrop({
				resizedWidth,
				resizedHeight,
				editWidth,
				editHeight,
				ltx,
				lty,
				rbx,
				rby
			});
		}
	}

	render() {
		const { baseWidth, baseHeight } = this.props;
		const wrapperStyle = {
			margin: 'auto 0',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: `${this.props.baseWidth}px`,
			height: `${this.props.baseHeight}px`,
			overflow: 'hidden',
			backgroundImage: `url(${clientConfig.params.staticWapUrl}/images/transparent.png)`
		};
		return (
			<div className={ style.mainContainer }>
				<div style={ wrapperStyle }>
					<div className={ style.crop_container }>
						<img ref="image" src="" alt="maskImg" onLoad={ this.imgOnload } style={ { maxWidth: baseWidth, maxHeight: baseHeight } } crossOrigin="Anonymous" />
						<div className= { style.cropBox }>
							<div ref='cropWindow' className={ style.cropWindow } onMouseDown={ this.cropActionStart }>
								<span ref="nw" className={ style.resize_handle_nw }></span>
								<span ref="ne" className={ style.resize_handle_ne }></span>
								<span ref="se" className={ style.resize_handle_se }></span>
								<span ref="sw" className={ style.resize_handle_sw }></span>
								<img src="" ref="imageCir" alt="imageCir" style={ { borderRadius: '50%' } } />
							</div>
						</div>
					</div>
				</div>
				<button
					onClick={ this.handleFinish }
					className="ui primary button"
					disabled={ this.state.loading }
				>
					儲存
				</button>
				<button onClick={ this.props.cancelCrop } className="ui normal button">取消</button>
			</div>
		);
	}
}

MoveCropper.propTypes = {
	aspect: PropTypes.bool,
	fileUrl: PropTypes.string,
	baseWidth: PropTypes.number,
	baseHeight: PropTypes.number,
	minCropWidth: PropTypes.number,
	minCropHeight: PropTypes.number,
	coordination: PropTypes.object,
	completeCrop: PropTypes.func
};
MoveCropper.defaultProps = {
	aspect: false,
	baseWidth: 534,
	baseHeight: 300,
	minCropWidth: 150,
	minCropHeight: 150
};

export default MoveCropper;
