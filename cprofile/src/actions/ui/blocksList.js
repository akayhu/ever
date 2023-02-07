// 切換拖曳狀態
export const TOGGLE_BLOCKS_LIST_DRAG = 'TOGGLE_BLOCKS_LIST_DRAG';
export const toggleBlocksListDrag = (value = false, dragIndex = null) => ({
	type: TOGGLE_BLOCKS_LIST_DRAG,
	value,
	dragIndex,
});
