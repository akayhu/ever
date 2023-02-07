import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import { LightBox } from 'c_wap_module';
import DraggableImg from './draggableImg';
import EditButton from './editButton';
import ConfirmPanel from './confirmPanel';
// utils

class DraggableCover extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showConfirmPanel: false,
			coverEdit: false,
			loading: false,
			imgTooSmall: false,
			imgTooBig: false,
			error: false,
			errorMsg: '',
			file: null,
			imgUrl: '',
			xRange: 0,
			yRange: 0,
			updateNewCover: false,
		};
		this.record = {
			file: null,
			coordination: {
				ltx: 0,
				lty: 0,
				rbx: 0,
				rby: 0
			}
		};
		this.onEvent = this.onEvent.bind(this);
		this.onFinishUpload = this.onFinishUpload.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.setTrackPos = this.setTrackPos.bind(this);
		this.closeLightBox = this.closeLightBox.bind(this);
	}
	onEvent(type, msg) {
		switch (type) {
			case 'startUpload':
				this.props.editStatus(true);
				this.setState({ loading: true });
				return;
			case 'emptyFile':
				this.setState({ loading: false });
				return;
			case 'smallImg':
				this.setState({ loading: false, imgTooSmall: true });
				return;
			case 'bigImg':
				this.setState({ loading: false, imgTooBig: true });
				return;
			case 'error':
				this.setState({ loading: false, error: true, errorMsg: msg });
				return;
			default:
				return;
		}
	}
	setTrackPos({x, y}) {
		const { width, height, coverAdjustMode } = this.props;
		const abs = Math.abs;

		this.record.coordination = {
			ltx: (coverAdjustMode) ? abs(this.props.coverCoordinate.ltx - x) : abs(-x),
			lty: (coverAdjustMode) ? abs(this.props.coverCoordinate.lty - y) : abs(-y),
			rbx: (coverAdjustMode) ? abs(this.props.coverCoordinate.ltx - x) + width : abs(width - x),
			rby: (coverAdjustMode) ? abs(this.props.coverCoordinate.lty - y) + height : abs(height - y)
		};
	}
	closeLightBox() {
		this.setState({
			imgTooSmall: false,
			imgTooBig: false,
			error: false
		});
		this.props.editStatus(false);
		document.body.style.cursor = 'default';
	}
	onFinishUpload({rawFile, imgUrl, xRange, yRange}, isNewCover = true) {
		this.record.file = rawFile;
		this.imgBlock.style.zIndex = '3';
		this.props.editStatus(true);
		this.setState({
			showConfirmPanel: true,
			loading: false,
			coverEdit: true,
			imgUrl,
			xRange,
			yRange,
			updateNewCover: isNewCover,
		});
	}
	onSubmit() {
		const { updateNewCover } = this.state;
		const { submitCover } = this.props;

		this.record.coordination.ltx = Math.round(this.record.coordination.ltx);
		this.record.coordination.lty = Math.round(this.record.coordination.lty);
		this.record.coordination.rbx = Math.round(this.record.coordination.rbx);
		this.record.coordination.rby = Math.round(this.record.coordination.rby);

		this.setState({ loading: true, showConfirmPanel: false });
		submitCover(this.record, updateNewCover).then(() => {
			this.imgBlock.style.zIndex = '0';
			this.setState({
				loading: false,
				coverEdit: false
			});
		});
	}
	onCancel() {
		document.getElementById('cover_file').value = '';

		this.record.file = null;
		this.imgBlock.style.zIndex = '0';
		this.props.editStatus(false);
		this.setState({
			showConfirmPanel: false,
			coverEdit: false,
			imgUrl: '',
			loading: false,
		});
	}
	render() {
		const lightboxOption = {
			onClose: this.closeLightBox,
			closeIcon: true
		};
		const { showConfirmPanel, coverEdit, imgTooSmall, error, errorMsg, loading, xRange, yRange, imgUrl, imgTooBig } = this.state;
		const { coverUrl, updateCover, deleteCover, editable, width, height, type, coverIsDefault, title } = this.props;
		const blockSizeStyle = {width: `${width}px`, height: `${height}px`};
		return (
			<div styleName="draggable_wrap" style={ blockSizeStyle }>
				<div className="ui segment" ref={ _ref => (this.imgBlock = _ref) } styleName="cover_img_block" style={ blockSizeStyle }>
					{
						loading &&
						<div styleName="loading_cover">
							<div className="ui loading" />
						</div>
					}
					<DraggableImg
						type={ type }
						title={ title }
						editing={ coverEdit }
						imgForDrag={ imgUrl }
						originImg={ coverUrl }
						trackPos={ this.setTrackPos }
						range={ {top: -yRange, left: -xRange, right: 0, bottom: 0} }
						defaultPositionX={ (this.props.coverAdjustMode) ? -this.props.coverCoordinate.ltx : 0 }
						defaultPositionY={ (this.props.coverAdjustMode) ? this.props.coverCoordinate.lty : 0 }
					/>
				</div>
				{
					editable &&
					<EditButton
						onEvent={ this.onEvent }
						onFinishUpload={ this.onFinishUpload }
						updateCover={ updateCover }
						deleteCover={ deleteCover }
						containerSize={ { width, height } }
						coverIsDefault={ coverIsDefault }
					/>
				}
				<ConfirmPanel
					show={ showConfirmPanel }
					submit={ this.onSubmit }
					cancel={ this.onCancel }
				/>
				{
					imgTooBig &&
					<LightBox option={ lightboxOption } onClose={ this.closeLightBox }>
						請選擇寬小於 9999 像素和高小於9999 像素的圖片
					</LightBox>
				}
				{
					imgTooSmall &&
					<LightBox option={ lightboxOption } onClose={ this.closeLightBox }>
						請選擇一張至少寬 750 像素和高 274 像素的圖片
					</LightBox>
				}
				{
					error &&
					<LightBox option={ lightboxOption } onClose={ this.closeLightBox }>
						{errorMsg || '發生錯誤，請稍後在試'}
					</LightBox>
				}
				<div styleName="layer" />
			</div>
		);
	}
}

DraggableCover.propTypes = {
	width: PropTypes.number, // 風景照寬
	height: PropTypes.number, // 風景照高
	coverUrl: PropTypes.string, // 風景照圖片位置
	editable: PropTypes.bool, // 是否可以更改風景照(鉛筆)
	editStatus: PropTypes.func, // 回傳目前編輯狀態(true, false)
	updateCover: PropTypes.func, // 提供調整的原圖(url or function)
	deleteCover: PropTypes.func, // 按下刪除後的動作
	submit: PropTypes.func // 按下確定後會執行，會有record參數傳入
};
DraggableCover.defaultProps = {
	width: 960,
	height: 350,
	coverCoordinate: {
		ltx: 0,
		lty: 0,
		rbx: 960,
		rby: 350,
	},
	coverAdjustMode: false,
	editStatus: x => x,
};
const CoverCss = CSSModules(DraggableCover, css, {allowMultiple: true});
export default CoverCss;
