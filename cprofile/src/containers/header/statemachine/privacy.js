import { Machine } from 'xstate';
import { setPrivacyProcess, switchPrivacyProcess } from 'actions/profile';

const statechart = {
	key: 'privacy',
	initial: 'switchLoading',
	states: {
		// 顯示當前分享設定 loading
		switchLoading: {
			onEntry: [switchPrivacyProcess()],
			on: {
				SWITCH_PRIVACY: [
					{
						target: 'link',
						cond: (extendedState, event) => extendedState.privacy === 'LINK',
					},
					{
						target: 'public',
					},
				],
				PRIVACY_ERROR: 'error',
			},
		},
		public: {
			on: {
				SET_PRIVACY: 'setPrivacy',
			},
		},
		link: {
			on: {
				SET_PRIVACY: 'setPrivacy',
			},
		},
		// 更新資訊開放設定 loading
		setPrivacy: {
			onEntry: [setPrivacyProcess()],
			on: {
				SET_PRIVACY_SUCCESS: 'switchLoading',
				PRIVACY_ERROR: 'error',
			},
		},
		error: {},
	},
};

export default Machine(statechart);
