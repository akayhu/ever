import uuidv4 from 'uuid/v4';
import { generateId } from 'utils/idGenerator';

// 區塊操作
export const CHANGE_DEFAULT_TEMPLATE = 'CHANGE_DEFAULT_TEMPLATE';

// 區塊內單筆資料段操作
export const UPDATE_BLOCK_ELEM = 'UPDATE_BLOCK_ELEM';

/**
 * 初始化區塊資料
 */
export const INIT_CARD = 'INIT_CARD';
export const initCard = (uniKey, blockType, templateType, payload) => ({
	type: INIT_CARD,
	uniKey,
	blockType,
	templateType,
	payload,
});

/**
 * 新增區塊，[blockType, uniKey]
 * - custom: [custom, customId]
 * - 其他: [basic, basic], [experience, experience], .....
 */
export const ADD_CARD = 'ADD_CARD';
export const addCard = (
	blockType,
	uniKey = uuidv4(),
	insertIndex,
	templateType,
	needCreate
) => ({
	type: ADD_CARD,
	uniKey,
	blockType,
	insertIndex,
	templateType,
	needCreate,
});

/**
 * 複製區塊，目前只有 custom 可以使用
 * @param {*} blockType
 * @param {*} uniKey
 * @param {*} insertIndex
 * @param {*} templateType
 */
export const COPY_CARD = 'COPY_CARD';
export const copyCard = (
	blockType = 'custom',
	prvUniKey = '',
	insertIndex,
	templateType,
	newUniKey = uuidv4()
) => ({
	type: COPY_CARD,
	prvUniKey,
	newUniKey,
	blockType,
	insertIndex,
	templateType,
});

/**
 * 拖移區塊
 * @param {*} uniKey
 * @param {*} hoverIndex
 */
export const MOVE_CARD = 'MOVE_CARD';
export const moveCard = (uniKey, hoverIndex) => ({
	type: MOVE_CARD,
	uniKey,
	hoverIndex,
});

/**
 * 一次性更新區塊的排序
 * @param {*} orderKeys
 */
export const UPDATE_CARD_ORDER = 'UPDATE_CARD_ORDER';
export const updateCardOrder = (orderKeys = []) => ({
	type: UPDATE_CARD_ORDER,
	orderKeys,
});

/**
 * 更新區塊內資料
 * @param {*} uniKey
 * @param {*} value
 * @param {*} keyPath data 以下的路徑，不包含 data，單筆：[], 多筆：[index, ...]
 */
export const UPDATE_CARD = 'UPDATE_CARD';
export const updateCard = (uniKey, value, keyPath = []) => ({
	type: UPDATE_CARD,
	uniKey,
	keyPath,
	value,
});

/**
 * 不顯示並刪除區塊資料 (custom only)
 * @param {*} uniKey
 */
export const DELETE_CARD = 'DELETE_CARD';
export const deleteCard = uniKey => ({
	type: DELETE_CARD,
	uniKey,
});

/**
 * 不顯示區塊資料 (非 custom)
 * @param {*} uniKey
 */
export const ARCHIVE_CARD = 'ARCHIVE_CARD';
export const archiveCard = (uniKey, blockType, templateType) => ({
	type: ARCHIVE_CARD,
	uniKey,
	blockType,
	templateType,
});

/**
 * 新增一筆區塊內資料段
 * @param {*} blockType
 * @param {*} uniKey
 * @param {*} uid 暫時的假 id，API 新增成功才會換成正式的 id
 */
export const ADD_BLOCK_ELEM = 'ADD_BLOCK_ELEM';
export const addBlockElem = (
	blockType,
	uniKey,
	uid = generateId('tmp-new'),
	templateType
) => ({
	type: ADD_BLOCK_ELEM,
	blockType,
	uniKey,
	uid,
	templateType,
});

/**
 * 複製一筆區塊內資料段
 * @param {*} blockType
 * @param {*} uniKey
 * @param {*} prvUID
 * @param {*} newUID
 */
export const COPY_BLOCK_ELEM = 'COPY_BLOCK_ELEM';
export const copyBlockElem = (
	blockType,
	uniKey,
	prvUID = '',
	newUID = generateId('tmp-copy')
) => ({
	type: COPY_BLOCK_ELEM,
	blockType,
	uniKey,
	prvUID,
	newUID,
});

/**
 * 拖曳一筆資料段
 * @param {*} uniKey
 * @param {*} hoverIndex
 */
export const MOVE_BLOCK_ELEM = 'MOVE_BLOCK_ELEM';
export const moveBlockElem = (
	blockType,
	uniKey,
	uid,
	dragIndex,
	hoverIndex
) => ({
	type: MOVE_BLOCK_ELEM,
	blockType,
	uniKey,
	uid,
	dragIndex,
	hoverIndex,
});

/**
 * 刪除一筆資料段
 * @param {*} uniKey
 * @param {*} index
 * @param {*} feild
 */
export const DELETE_BLOCK_ELEM = 'DELETE_BLOCK_ELEM';
export const deleteBlockElem = (blockType, uniKey, uid = '') => ({
	type: DELETE_BLOCK_ELEM,
	blockType,
	uniKey,
	uid,
});

// 拖曳虛線框的特殊 uniKey
export const PLACEHOLDER_KEY = 'placeHolder';

/**
 * 插入拖曳虛線框
 * @param {*} hoverIndex
 * @param {*} direction
 * @param {*} dragType
 */
export const INJECT_PLACEHOLDER = 'INJECT_PLACEHOLDER';
export const injectPlaceholder = (hoverIndex, direction, dragType) => ({
	type: INJECT_PLACEHOLDER,
	hoverIndex,
	direction,
	dragType,
});

/**
 * 移除拖曳虛線框
 */
export const REMOVE_PLACEHOLDER = 'REMOVE_PLACEHOLDER';
export const removePlaceholder = () => {
	return {
		type: REMOVE_PLACEHOLDER,
	};
};

/**
 * 更換區塊模組
 */
export const CHANGE_TEMPLATE = 'CHANGE_TEMPLATE';
export const changeTemplate = (uniKey, templateType, blockType) => ({
	type: CHANGE_TEMPLATE,
	uniKey,
	templateType,
	blockType,
});

/**
 * 調整模板底圖遮罩
 */
export const SAVE_MASK = 'SAVE_MASK';
export const saveMask = (
	uniKey,
	templateType,
	maskName = 'blackMask',
	maskAlpha = 0
) => ({
	type: SAVE_MASK,
	uniKey,
	templateType,
	maskName,
	maskAlpha,
});

/**
 * 更換全部主題
 */
export const CHANGE_THEME = 'CHANGE_THEME';
export const changeTheme = templateType => ({
	type: CHANGE_THEME,
	templateType,
});

/**
 * 暫時 ID 置換成真實 ID
 */
export const TRANS_TEMP_ID_TO_UID = 'TRANS_TEMP_ID_TO_UID';
export const transTempIdToUID = (blockType, uniKey, tmpId, newUID) => ({
	type: TRANS_TEMP_ID_TO_UID,
	blockType,
	uniKey,
	tmpId,
	newUID,
});

/**
 * 移除多餘的ID
 */
export const REMOVE_EXTRA_UNIKEY = 'REMOVE_EXTRA_UNIKEY';
export const removeExtraUniKey = uniKey => ({
	type: REMOVE_EXTRA_UNIKEY,
	uniKey,
});
