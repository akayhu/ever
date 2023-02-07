/* eslint-disable */
import {
	// PUSH_SYS_MESSAGE,
	// pushSystemMessage,
	DEL_SYS_MESSAGE,
	delSystemMessage,
} from 'actions/ui/systemMessage';

describe('triggerSurvey actions', () => {
	// 因 uuid() 每次 render 都不一樣，所以無法測試
	// it('trigger Survey', () => {
	//   const content = '';
	//   const level = 'info';
	//   const autoDisapear = true;
	//   const expectedAction = {
	//     type: PUSH_SYS_MESSAGE,
	//     payload: {
	//       content,
	//       level,
	//       id: '4b348a56-d518-422e-b027-bbf7af741302',
	//       autoDisapear,
	//     },
	//   };
	//   expect(pushSystemMessage(content, level, autoDisapear)).toEqual(expectedAction)
	// });

	it('start Publish Process', () => {
		const id = 3345678;
		const expectedAction = {
			type: DEL_SYS_MESSAGE,
			id,
		};
		expect(delSystemMessage(id)).toEqual(expectedAction);
	});
});
