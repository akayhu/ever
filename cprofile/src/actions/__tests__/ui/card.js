/* eslint-disable */
import {
	INIT_CARD,
	initCard,
	ADD_CARD,
	addCard,
	COPY_CARD,
	copyCard,
	MOVE_CARD,
	moveCard,
	UPDATE_CARD_ORDER,
	updateCardOrder,
	UPDATE_CARD,
	updateCard,
	DELETE_CARD,
	deleteCard,
	ARCHIVE_CARD,
	archiveCard,
	ADD_BLOCK_ELEM,
	addBlockElem,
	COPY_BLOCK_ELEM,
	copyBlockElem,
	MOVE_BLOCK_ELEM,
	moveBlockElem,
	DELETE_BLOCK_ELEM,
	deleteBlockElem,
	injectPlaceholder,
	INJECT_PLACEHOLDER,
	REMOVE_PLACEHOLDER,
	removePlaceholder,
	CHANGE_TEMPLATE,
	changeTemplate,
	SAVE_MASK,
	saveMask,
	CHANGE_THEME,
	changeTheme,
	TRANS_TEMP_ID_TO_UID,
	transTempIdToUID,
	REMOVE_EXTRA_UNIKEY,
	removeExtraUniKey,
} from 'actions/ui/card';

describe('card actions', () => {
	it('初始化區塊資料', () => {
		const uniKey = 'test-block-id';
		const blockType = 'exp';
		const templateType = 'def';
		const payload = { foo: 'bar' };
		const expectedAction = {
			type: INIT_CARD,
			uniKey,
			blockType,
			templateType,
			payload,
		};
		expect(initCard(uniKey, blockType, templateType, payload)).toEqual(
			expectedAction
		);
	});

	it('新增區塊', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const blockType = 'behance';
		const templateType = 'def';
		const insertIndex = 1;
		const needCreate = 'def';
		const expectedAction = {
			type: ADD_CARD,
			blockType,
			uniKey,
			insertIndex,
			templateType,
			needCreate,
		};
		expect(
			addCard(blockType, uniKey, insertIndex, templateType, needCreate)
		).toEqual(expectedAction);
	});

	it('複製區塊', () => {
		const blockType = 'custom';
		const prvUniKey = '';
		const insertIndex = 1;
		const templateType = 'def';
		const newUniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const expectedAction = {
			type: COPY_CARD,
			blockType,
			prvUniKey,
			insertIndex,
			templateType,
			newUniKey,
		};
		expect(
			copyCard(blockType, prvUniKey, insertIndex, templateType, newUniKey)
		).toEqual(expectedAction);
	});

	it('拖移區塊', () => {
		const hoverIndex = 2;
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const expectedAction = {
			type: MOVE_CARD,
			uniKey,
			hoverIndex,
		};
		expect(moveCard(uniKey, hoverIndex)).toEqual(expectedAction);
	});

	it('一次性更新區塊的排序', () => {
		const orderKeys = ['d03f3d1c-9815-4df9-940e-6495801d2c68'];
		const expectedAction = {
			type: UPDATE_CARD_ORDER,
			orderKeys,
		};
		expect(updateCardOrder(orderKeys)).toEqual(expectedAction);
	});

	it('更新區塊內資料', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const keyPath = [];
		const value = 'test';
		const expectedAction = {
			type: UPDATE_CARD,
			uniKey,
			keyPath,
			value,
		};
		expect(updateCard(uniKey, value, keyPath)).toEqual(expectedAction);
	});

	it('不顯示並刪除區塊資料', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const expectedAction = {
			type: DELETE_CARD,
			uniKey,
		};
		expect(deleteCard(uniKey)).toEqual(expectedAction);
	});

	it('不顯示區塊資料', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const blockType = 'custom';
		const templateType = 'def';
		const expectedAction = {
			type: ARCHIVE_CARD,
			uniKey,
			blockType,
			templateType,
		};
		expect(archiveCard(uniKey, blockType, templateType)).toEqual(
			expectedAction
		);
	});

	it('新增一筆區塊內資料段', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const blockType = 'custom';
		const uid = 'tmp-copy-3345678';
		const templateType = 'def';
		const expectedAction = {
			type: ADD_BLOCK_ELEM,
			blockType,
			uniKey,
			uid,
			templateType,
		};
		expect(addBlockElem(blockType, uniKey, uid, templateType)).toEqual(
			expectedAction
		);
	});

	it('複製一筆區塊內資料段', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const blockType = 'custom';
		const newUID = 'tmp-copy-3345678';
		const prvUID = 'd03f3d1c-9815-4df9-940e-649580154432';
		const expectedAction = {
			type: COPY_BLOCK_ELEM,
			blockType,
			uniKey,
			prvUID,
			newUID,
		};
		expect(copyBlockElem(blockType, uniKey, prvUID, newUID)).toEqual(
			expectedAction
		);
	});

	it('拖曳一筆資料段', () => {
		const blockType = 'custom';
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const uid = 'd03f3d1c-9815-4df9-940e-6495801d2789';
		const dragIndex = 2;
		const hoverIndex = 3;
		const expectedAction = {
			type: MOVE_BLOCK_ELEM,
			blockType,
			uniKey,
			uid,
			dragIndex,
			hoverIndex,
		};
		expect(
			moveBlockElem(blockType, uniKey, uid, dragIndex, hoverIndex)
		).toEqual(expectedAction);
	});

	it('刪除一筆資料段', () => {
		const blockType = 'custom';
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const uid = 'd03f3d1c-9815-4df9-940e-6495801d2789';
		const expectedAction = {
			type: DELETE_BLOCK_ELEM,
			blockType,
			uniKey,
			uid,
		};
		expect(deleteBlockElem(blockType, uniKey, uid)).toEqual(expectedAction);
	});

	it('插入拖曳虛線框', () => {
		const hoverIndex = 2;
		const direction = '';
		const dragType = '';
		const expectedAction = {
			type: INJECT_PLACEHOLDER,
			hoverIndex,
			direction,
			dragType,
		};
		expect(injectPlaceholder(hoverIndex, direction, dragType)).toEqual(
			expectedAction
		);
	});

	it('移除拖曳虛線框', () => {
		const expectedAction = {
			type: REMOVE_PLACEHOLDER,
		};
		expect(removePlaceholder()).toEqual(expectedAction);
	});

	it('更換區塊模組', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const templateType = 'def';
		const blockType = 'custom';
		const expectedAction = {
			type: CHANGE_TEMPLATE,
			uniKey,
			templateType,
			blockType,
		};
		expect(changeTemplate(uniKey, templateType, blockType)).toEqual(
			expectedAction
		);
	});

	it('調整模板底圖遮罩', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const templateType = 'def';
		const maskName = 'blackMask';
		const maskAlpha = 0;
		const expectedAction = {
			type: SAVE_MASK,
			uniKey,
			templateType,
			maskName,
			maskAlpha,
		};
		expect(saveMask(uniKey, templateType, maskName, maskAlpha)).toEqual(
			expectedAction
		);
	});

	it('更換全部主題', () => {
		const templateType = 'def';
		const expectedAction = {
			type: CHANGE_THEME,
			templateType,
		};
		expect(changeTheme(templateType)).toEqual(expectedAction);
	});

	it('暫時 ID 置換成真實 ID', () => {
		const blockType = 'honor';
		const uniKey = 'test';
		const tmpId = 'tmp-honor';
		const newUID = 'real-honor';
		const expectedAction = {
			type: TRANS_TEMP_ID_TO_UID,
			blockType,
			uniKey,
			tmpId,
			newUID,
		};
		expect(transTempIdToUID(blockType, uniKey, tmpId, newUID)).toEqual(
			expectedAction
		);
	});

	it('移除多餘的ID', () => {
		const uniKey = 'd03f3d1c-9815-4df9-940e-6495801d2c68';
		const expectedAction = {
			type: REMOVE_EXTRA_UNIKEY,
			uniKey,
		};
		expect(removeExtraUniKey(uniKey)).toEqual(expectedAction);
	});
});
