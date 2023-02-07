/* eslint-disable */
import {
	UPDATE_CONNECTOR_STATUS,
	updateConnectorStatus,
} from 'actions/blocks/connector';

describe('connector actions', () => {
	it('更新第三方服務連結狀態', () => {
		const blockType = 'behance';
		const payload = {
			id: 108190,
		};
		const expectedAction = {
			type: UPDATE_CONNECTOR_STATUS,
			blockType,
			payload,
		};
		expect(updateConnectorStatus(blockType, payload)).toEqual(expectedAction);
	});
});
