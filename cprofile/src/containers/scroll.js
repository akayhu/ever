import { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import BezierEasing from 'bezier-easing';

class Scroll extends Component {
	scrollTimer = null;
	state = {
		// fixed
		scrollTriggerThread: 150, // px
		triggerInterval: 10, // 更高的話捲起來頓頓的
		maxDelta: 10,

		// variant
		isScrolling: false,
		scrollDirection: null,
		clientOffset: {
			x: 0,
			y: 0,
		},
	};

	constructor(props) {
		super(props);
		this.mouseEventListener = throttle(
			this.updateMouseCoordinate.bind(this),
			100
		);
	}

	componentDidMount = () => {
		// mousemove 與 drag 不會同時觸發，因此需監聽這兩個事件更新滑鼠座標
		window.addEventListener('mousemove', this.mouseEventListener);
		window.addEventListener('dragover', this.mouseEventListener);

		// 停止拖曳同時停止捲動
		window.addEventListener('dragend', this.stopScroll);
	};

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.mouseEventListener);
		window.removeEventListener('dragover', this.mouseEventListener);

		// 停止拖曳同時停止捲動
		window.removeEventListener('dragend', this.stopScroll);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// 非拖曳狀態下沒作用
		if (!nextProps.isDragging) {
			if (!prevState.isScrolling && !prevState.scrollDirection) return null;
			return {
				...prevState,
				isScrolling: false,
				scrollDirection: null,
			};
		}

		// 往下捲
		if (
			window.innerHeight - prevState.clientOffset.y <
				prevState.scrollTriggerThread &&
			document.documentElement.clientHeight +
				document.documentElement.scrollTop <
				document.documentElement.scrollHeight
		) {
			if (prevState.isScrolling && prevState.scrollDirection === 'toBottom')
				return null;
			return {
				...prevState,
				isScrolling: true,
				scrollDirection: 'toBottom',
			};
		}

		// 往上捲
		if (
			prevState.clientOffset.y < prevState.scrollTriggerThread &&
			document.documentElement.scrollTop > 0
		) {
			if (prevState.isScrolling && prevState.scrollDirection === 'toTop')
				return null;
			return {
				...prevState,
				isScrolling: true,
				scrollDirection: 'toTop',
			};
		}

		// 中間 or 最上面 or 最下面不捲動
		if (!prevState.isScrolling && !prevState.scrollDirection) return null;
		return {
			...prevState,
			isScrolling: false,
			scrollDirection: null,
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		// 只在捲動狀態不同時作用 (開關、方向)
		if (
			prevState.isScrolling === this.state.isScrolling &&
			prevState.scrollDirection === this.state.scrollDirection
		)
			return;

		// 開始 or 停止捲動
		this.state.isScrolling ? this.startScroll() : this.stopScroll();
	};

	updateMouseCoordinate = e => {
		this.setState({
			clientOffset: {
				x: e.clientX,
				y: e.clientY,
			},
		});
	};

	startScroll = () => {
		const validDirection = ['toTop', 'toBottom'];
		if (validDirection.indexOf(this.state.scrollDirection) === -1) return;

		// 避免重複註冊 timer 導致無法停止滾動
		if (this.scrollTimer) return;

		this.scrollTimer = setInterval(() => {
			const {
				scrollHeight,
				scrollTop,
				clientHeight,
			} = document.documentElement;

			// 捲動到底時自動關閉捲動
			const isReachEnd =
				this.state.scrollDirection === 'toTop'
					? scrollTop === 0 // toTop
					: scrollTop + clientHeight === scrollHeight; // toBottom
			if (isReachEnd) return this.stopScroll();

			// 計算捲動的值
			const delta = this.getScrollRate();
			if (!delta || delta === 0) return this.stopScroll();

			// 按方向捲動
			this.state.scrollDirection === 'toTop'
				? (document.documentElement.scrollTop -= delta) // toTop
				: (document.documentElement.scrollTop += delta); // toBottom
		}, this.state.triggerInterval);
	};

	stopScroll = () => {
		clearInterval(this.scrollTimer);
		this.scrollTimer = null;
		this.setState({
			isScrolling: false,
			scrollDirection: null,
		});
	};

	// 由貝茲曲線計算捲動速率
	getScrollRate = () => {
		const validDirection = ['toTop', 'toBottom'];
		if (validDirection.indexOf(this.state.scrollDirection) === -1) return 0;

		// http://greweb.me/bezier-easing-editor/example/
		const curve = BezierEasing(1, 0, 1, 1);

		const delta =
			this.state.scrollDirection === 'toTop'
				? this.state.clientOffset.y / this.state.scrollTriggerThread // toTop
				: (window.innerHeight - this.state.clientOffset.y) /
				  this.state.scrollTriggerThread; // toBottom

		// 超過 thread 視為無效
		if (delta > 1 || delta < 0) return 0;

		return (1 - curve(delta)) * this.state.maxDelta;
	};

	render() {
		return null;
	}
}

const mapStateToProps = state => ({
	isDragging: state.getIn(['ui', 'blocksList', 'isDragging']),
});

export default connect(
	mapStateToProps,
	{}
)(Scroll);
