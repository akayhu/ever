import { Machine } from 'xstate';
import { startPublishProcess } from 'actions/ui/publish';
import { fetchPrivacyProcess, setPrivacyProcess } from 'actions/profile';
import {
	registerStateMachine,
	removeStateMachine,
} from 'actions/ui/statemachine';
import PrivacyMachine from './privacy';

const statechart = {
	key: 'publish',
	initial: 'hide',
	states: {
		// 隱藏，背景先讀取分享設定
		hide: {
			onEntry: [fetchPrivacyProcess()],
			on: {
				START_PUBLISH: 'publishing',
				SHOW_UNPUBLISH_CONFIRM: 'unpublishConfirm',
			},
		},
		// 發佈 loading
		publishing: {
			onEntry: [startPublishProcess()],
			on: {
				PUBLISH_SUCCESS: 'loadPrivacy',
				ERROR: 'error',
			},
		},
		loadPrivacy: {
			onEntry: [fetchPrivacyProcess()],
			on: {
				LOAD_PRIVACY_SUCCESS: 'privacy',
				ERROR: 'error',
			},
		},
		// 資訊開放設定面板
		privacy: {
			onEntry: [registerStateMachine('privacy', PrivacyMachine)],
			on: {
				HIDE_LIGHTBOX: 'hide',
			},
			onExit: [removeStateMachine('privacy')],
		},
		// 取消發佈的確認視窗
		unpublishConfirm: {
			on: {
				START_UNPUBLISH: 'unpublishing',
				HIDE_LIGHTBOX: 'hide',
			},
		},
		// 取消發佈處理 (關閉 lightbox 背景執行)
		unpublishing: {
			onEntry: [setPrivacyProcess()],
			on: {
				UNPUBLISH_SUCCESS: 'hide',
				ERROR: 'error',
			},
		},
		// 統一的錯誤畫面，從發佈從頭開始
		error: {
			on: {
				START_PUBLISH: 'publishing',
				HIDE_LIGHTBOX: 'hide',
			},
		},
	},
};

export default Machine(statechart);
