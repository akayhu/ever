import { fromJS } from 'immutable';
import { Machine } from 'xstate';
import { initPreview } from 'actions/ui/preview';

const validPreviewName = fromJS([
	'web',
	'paper',
	'tablet',
	'mobile',
	'businessCard',
]);
const switchPreviewDevice = current => {
	const conds = [
		{
			target: 'previewWeb',
			cond: (extendedState, event) => extendedState.device === 'web',
		},
		{
			target: 'previewPaper',
			cond: (extendedState, event) => extendedState.device === 'paper',
		},
		{
			target: 'previewTablet',
			cond: (extendedState, event) => extendedState.device === 'tablet',
		},
		{
			target: 'previewMobile',
			cond: (extendedState, event) => extendedState.device === 'mobile',
		},
		{
			target: 'previewBussinessCard',
			cond: (extendedState, event) => extendedState.device === 'businessCard',
		},
		{
			target: 'error',
			cond: (extendedState, event) => {
				return !validPreviewName.includes(extendedState.device);
			},
		},
	];
	return conds.filter(con => con.target !== current);
};

const statechart = {
	key: 'preview',
	initial: 'loading',
	states: {
		loading: {
			onEntry: [initPreview()],
			on: {
				SHOW_PREVIEW: switchPreviewDevice(),
				INIT_PREVIEW_ERROR: 'error',
			},
		},
		error: {
			on: {
				SHOW_PREVIEW: switchPreviewDevice(),
				INIT_PREVIEW: 'loading',
			},
		},
		previewWeb: {
			on: {
				SHOW_PREVIEW: switchPreviewDevice('previewWeb'),
			},
		},
		previewPaper: {
			on: {
				SHOW_PREVIEW: switchPreviewDevice('previewPaper'),
			},
		},
		previewTablet: {
			on: {
				SHOW_PREVIEW: switchPreviewDevice('previewTablet'),
			},
		},
		previewMobile: {
			on: {
				SHOW_PREVIEW: switchPreviewDevice('previewMobile'),
			},
		},
		previewBussinessCard: {
			on: {
				SHOW_PREVIEW: switchPreviewDevice('previewBussinessCard'),
			},
		},
	},
};

export default Machine(statechart);
