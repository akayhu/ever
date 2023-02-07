// constants
// 更新泡泡的部分直接監聽 pusher 的 action ，做在 reducer 中
export const GET_BUBBLE_COUNT = 'GET_BUBBLE_COUNT';
export const CLEAR_BUBBLE = 'CLEAR_BUBBLE';

/* ************** 取得初始未讀通知泡泡數目 ************** */
export function initBubbleCount() {
	return {
		CALL_API: {
			type: GET_BUBBLE_COUNT,
			method: 'get',
			target: '/pusher/getUnreadNotify',
		},
	};
}

/* ************** 點鈴鐺後，將通知數歸零 ************** */
export function triggerClickBubble() {
	return (dispatch, getState) => {
		const hasBubbles = getState().bubble.bubbleCount > 0;
		if (hasBubbles) {
			// 歸零store中的通知數
			dispatch({ type: CLEAR_BUBBLE });
		}
	};
}
