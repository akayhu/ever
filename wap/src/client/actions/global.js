export const CREATE_FROM_PROMOTION = 'CREATE_FROM_PROMOTION';

export function createFromPromotion(target) {
	return {
		type: CREATE_FROM_PROMOTION,
		target
	};
}

export const ONCHANGE_FROM_PROMOTION = 'ONCHANGE_FROM_PROMOTION';

export function onchangeFromPromotion() {
	return (dispatch, getState) => {
		const onChange = getState().global.onChange;
		if (!onChange) {
			dispatch({ type: ONCHANGE_FROM_PROMOTION });
		}
	};
}

export const INITIAL_FROM_PROMOTION = 'INITIAL_FROM_PROMOTION';

export function initialFromPromotion() {
	return {
		type: INITIAL_FROM_PROMOTION
	};
}
