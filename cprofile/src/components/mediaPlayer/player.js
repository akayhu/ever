import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
// import { BrowserView } from 'react-device-detect';
import { pickTagWithOrder, tagsMap } from 'config/document';
import './player.css';

/* TODO: 缺手機板顯示 */

class DocumentPlayer extends Component {
	constructor(props) {
		super(props);
		const images = pickTagWithOrder(
			props.fileUrlMap,
			tagsMap.DOCUMENT.document
		);
		this.state = {
			images,
			currentIndex: 0,
			imagesCount: images.length,
			loading: true,
			fullscreen: false,
		};
	}

	imgLoad = () => this.setState({ loading: false });

	handleKeydown = e => {
		if (e.keyCode === 37) return this.previous();
		if (e.keyCode === 39) {
			return this.next();
		}
	};

	previous = () => {
		const { currentIndex, imagesCount } = this.state;
		let nextIndex = currentIndex - 1;
		if (nextIndex < 0) {
			nextIndex = imagesCount - 1;
		}
		this.setState({ currentIndex: nextIndex, loading: true });
	};

	next = () => {
		const { currentIndex } = this.state;
		let nextIndex = currentIndex + 1;
		if (nextIndex > this.state.imagesCount - 1) {
			nextIndex = 0;
		}
		this.setState({ currentIndex: nextIndex, loading: true });
	};

	jump = e => {
		const { imagesCount } = this.state;
		let nextIndex = !e.target.value ? 1 : parseInt(e.target.value) - 1;
		if (nextIndex > imagesCount - 1) {
			nextIndex = 0;
		}
		if (nextIndex < 0) {
			nextIndex = imagesCount - 1;
		}
		this.setState({ currentIndex: nextIndex, loading: true });
	};

	fullscreen = () => {
		const ele = this.refs.player;
		if (this.state.fullscreen) {
			this.setState({ fullscreen: false }, () => {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			});
			return;
		}

		this.setState({ fullscreen: true }, () => {
			if (ele.requestFullscreen) {
				ele.requestFullscreen();
			} else if (ele.webkitRequestFullscreen) {
				ele.webkitRequestFullscreen();
			} else if (ele.mozRequestFullScreen) {
				ele.mozRequestFullScreen();
			} else if (ele.msRequestFullscreen) {
				ele.msRequestFullscreen();
			} else {
				console.log('Fullscreen API is not supported.');
			}
		});
	};

	render() {
		const {
			loading,
			currentIndex,
			imagesCount,
			fullscreen,
			images,
		} = this.state;

		return (
			<div ref="player" className="player" tabIndex="1">
				<div ref="playground" className="playground">
					{loading && <div className="loading ui loading" />}
					<img
						ref="play_image"
						onLoad={this.imgLoad}
						onKeyDown={this.handleKeydown}
						src={images[currentIndex]}
						alt="play_image"
					/>
				</div>
				<div className="controls">
					<span className="controls_item">
						{imagesCount > 1 && (
							<span className="direction">
								<Icon type="caret-left" onClick={this.previous} />
							</span>
						)}
						<span className="count">
							<input readOnly value={currentIndex + 1} onChange={this.jump} />/
							{imagesCount}
						</span>
						{imagesCount > 1 && (
							<span className="direction">
								<Icon type="caret-right" onClick={this.next} />
							</span>
						)}
					</span>
					<span className="fullscreen">
						<Icon
							onClick={this.fullscreen}
							type={fullscreen ? 'fullscreen-exit' : 'fullscreen'}
						/>
					</span>
				</div>
			</div>
		);
	}
}

DocumentPlayer.propTypes = {
	/** 多媒體檔案相關的 url */
	fileUrlMap: PropTypes.object.isRequired,
	/** 多媒體檔案的補充資訊 */
	meta: PropTypes.object,
};

DocumentPlayer.defaultProps = {
	fileUrlMap: {},
	meta: {},
};

export default DocumentPlayer;
