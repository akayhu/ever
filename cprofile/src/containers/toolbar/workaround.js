import React, { Component } from 'react';
// import { isChrome, isChromium } from 'react-device-detect';
import shallowCompare from 'react-addons-shallow-compare'; // DEPERECATED: 這是 legacy module，日後 chrome 修正了 bug 再移除他

/**
 * HACK: Workaround HOC for chrome dragend issue
 * https://github.com/react-dnd/react-dnd/issues/1085
 *
 * TODO: 此 module 間接使得拖曳的效能變好了，日後移除時需重新調校拖曳效能
 */
export const withDelayRender = WrappedComponent =>
	class DelayRender extends Component {
		shouldComponentUpdate = (nextProps, nextState) => {
			// 非 chrome 瀏覽器不會有這層判斷
			// if (!isChrome && !isChromium) return true;

			if (shallowCompare(this, nextProps, nextState)) {
				// 若判斷需要重 render，延遲指定時間後呼叫 render
				setTimeout(() => {
					this.forceUpdate();
				}, 0);
			}
			// 一律回傳 false 避免立即呼叫 render
			return false;
		};

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
