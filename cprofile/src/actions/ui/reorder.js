export const TOGGLE_REORDER_CONFIRM = 'TOGGLE_REORDER_CONFIRM';
export const toggleReOrderConfirm = (visibility = false) => ({
	type: TOGGLE_REORDER_CONFIRM,
	visibility,
});
