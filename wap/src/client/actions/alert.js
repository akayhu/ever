import {actions as CPlatformActions} from 'c_platform';

const setDirectPanel = CPlatformActions.alert.setDirectPanel;

/**
	顯示lightbox 可以帶單行文字
	藉由middleWare/elog去撈住SHOW_PLATFORM_ALERT後在C_platform顯示lightbox
	使用在：
		一、權限不足，無法操作這個動作
		二、各action.response.warning顯示
*/
export const SHOW_PLATFORM_ALERT = 'SHOW_PLATFORM_ALERT';
export function showPlatformAlert(text) {
	return {
		type: SHOW_PLATFORM_ALERT,
		text
	};
}

export {setDirectPanel};
