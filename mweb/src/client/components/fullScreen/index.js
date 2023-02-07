import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

import { throttle } from 'lodash/function';

import { MobileMediaPlayer } from 'c_wap_module';
import Swipeable from 'react-swipeable';
import compose from 'src/util/compose';

class FullScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			direction: '',
			rCurrentIndex: props.showIndex || 0,
			fullScreenWidth: 0,
			fullScreenMargin: 0,
			rOffset: 0,
			style: {},
			isFlick: false,
		};
		this.handleResize = this.handleResize.bind(this);
	}
	componentWillMount() {
		// 延遲觸發
		this.slideToIndex = throttle(this.slideToIndex.bind(this), 500);
	}
	componentDidMount() {
		window.setTimeout(() => this.handleResize(), 500);
		window.addEventListener('resize', this.handleResize);
	}
	handleResize() {
		this.setState({
			fullScreenWidth: this.fullScreen.offsetWidth,
			fullScreenMargin: (this.fullScreen.offsetHeight - this.slides.offsetHeight) / 2,
		});
	}
	rHandleSwiping(index, _, delta) {
		const rOffset = index * ((delta / this.state.fullScreenWidth) * 100);
		this.setState({
			style: {},
			rOffset,
		});
	}
	handleOnSwiped(ev, x, y, isFlick) {
		// 檢查抽動
		this.setState({isFlick});
	}
	shouldSlideOnSwipe(offset) {
		const shouldSlide = Math.abs(offset) > 30 ||
			this.state.isFlick;

		if (shouldSlide) {
			this.setState({isFlick: false});
		}
		return shouldSlide;
	}

	rHandleOnSwipedTo(index, direction) {
		let slideTo = this.state.rCurrentIndex;

		if (this.shouldSlideOnSwipe(this.state.rOffset)) {
			slideTo += index;
		}

		this.slideToIndex(slideTo, direction);
		// 歸零滑鼠拖曳的位移
		this.setState({
			rOffset: 0,
		});
	}
	getAlignmentClassName(index) {
		const { rCurrentIndex } = this.state;
		let alignment = '';

		if (index === rCurrentIndex) {
			alignment = ' center';
		}
		return alignment;
	}
	slideToIndex(index, direction) {
		const slideCount = this.props.dataList.length - 1;
		let rCurrentIndex = index;

		if (index < 0) {
			rCurrentIndex = slideCount;
		} else if (index > slideCount) {
			rCurrentIndex = 0;
		}

		this.setState({
			direction,
			rCurrentIndex,
			style: {
				transition: 'transform .45s ease-out',
			},
		});
	}
	getSlideStyle(index) {
		const { rCurrentIndex, direction, rOffset } = this.state;
		// 取得照片總數
		const slideCount = this.props.dataList.length - 1;
		let baseTranslateX = 0;

		if (rCurrentIndex > index) {
			// 這張在現在這張的左邊
			baseTranslateX = (-100 * (rCurrentIndex - index));
		} else if (rCurrentIndex < index) {
			// 這張在現在這張的右邊
			baseTranslateX = (100 * (index - rCurrentIndex));
		}

		if (index === 0 && rCurrentIndex === slideCount) {
			// 在最後一張時，將第一張移到最後一張右邊，就不會有刷過去的殘影了
			baseTranslateX = 100;
		} else if (index === slideCount && rCurrentIndex === 0) {
			// 在第一張時，將最後一張移到第一張左邊，就不會有刷過去的殘影了
			baseTranslateX = -100;
		}

		// 取得上一張的位置
		let previousIndex = 0;
		if (rCurrentIndex === 0) {
			previousIndex = slideCount;
		} else {
			previousIndex = rCurrentIndex - 1;
		}

		// 取得下一張的位置
		let nextIndex = 0;
		if (rCurrentIndex === slideCount) {
			nextIndex = 0;
		} else {
			nextIndex = rCurrentIndex + 1;
		}

		// 為了遮蔽刷動
		let zIndex = 1;
		if (index === rCurrentIndex) {
			zIndex = 3;
		}

		if (direction === 'right' && previousIndex === index) {
			zIndex = 2;
		}

		if (direction === 'left' && nextIndex === index) {
			zIndex = 2;
		}

		const translate3d = `translate3d(${baseTranslateX + rOffset}%, 0, 0)`;

		return {
			WebkitTransform: translate3d,
			MozTransform: translate3d,
			msTransform: translate3d,
			OTransform: translate3d,
			transform: translate3d,
			zIndex,
			// visibility: zIndex === 1 ? 'hidden' : 'inherit',
		};
	}
	render() {
		const rSlides = [];
		this.props.dataList.map((item, index) => {
			let attachmentProperty = {
				fileid: "",
				src: "",
				tagtype: "",
			};
			const alignment = this.getAlignmentClassName(index);
			if (item.extraInfo.attachmentList !== null) {
				const { activityFileId, activityFileUrl, contentType } = item.extraInfo.attachmentList[0];
				attachmentProperty = {
					fileid: activityFileId,
					src: activityFileUrl,
					tagtype: attachmentTypeFilter(contentType),
				};
			}
			const rSlide = (
				<div
					key={ index }
					styleName={ `rSlide${alignment}` }
					style={ Object.assign(this.getSlideStyle(index), this.state.style) }
				>
					<MobileMediaPlayer property={ attachmentProperty } />
				</div>
			);
			rSlides.push(rSlide);
		});
		return (
			<div
				styleName="fullScreen"
				ref={ i => (this.fullScreen = i) }
			>
				<i
					className="cross icon"
					styleName="f_icon close"
					onClick={ this.props.handleShowFullScreen.bind(this, false) }
				/>
				<Swipeable
					styleName="swipe"
					onSwipingLeft={ this.rHandleSwiping.bind(this, -1) }
					onSwipingRight={ this.rHandleSwiping.bind(this, 1) }
					onSwiped={ this.handleOnSwiped.bind(this) }
					onSwipedLeft={ this.rHandleOnSwipedTo.bind(this, 1, 'right') }
					onSwipedRight={ this.rHandleOnSwipedTo.bind(this, -1, 'left') }
				>
					<div
						styleName="slides"
						ref={ i => (this.slides = i) }
					>
						{ rSlides }
						{/*<i
							className="angle left icon"
							styleName="f_icon left"
							onClick={ this.slideToIndex.bind(this, this.state.rCurrentIndex - 1, 'left') }
						/>
						<i
							className="angle right icon"
							styleName="f_icon right"
							onClick={ this.slideToIndex.bind(this, this.state.rCurrentIndex + 1, 'right') }
						/>*/}
					</div>
				</Swipeable>
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

export default compose(
	[CSSModules, '_', css, { allowMultiple: true }]
)(FullScreen);
