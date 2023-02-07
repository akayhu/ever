import {
	TRIGGER_LIKE,
	TRIGGER_COLLECT,
} from 'src/client/actions/activity';

export default function (state, action) {
	switch (action.type) {
		case TRIGGER_LIKE: {
			const {data, checked} = action.payload;
			const {likeCount, likeList} = state;
			const _likeCount = checked ? likeCount + 1 : likeCount - 1;
			let _likeList = likeList || [];
			_likeList = checked ? _likeList.concat({...data}) : _likeList.filter(item => item.pid !== data.pid);
			return {
				...state,
				likeIt: checked,
				likeCount: _likeCount,
				likeList: _likeList,
			};
		}
		case TRIGGER_COLLECT: {
			const {data, checked} = action.payload;
			const {collectCount, collectList} = state;
			const _collectCount = checked ? collectCount + 1 : collectCount - 1;
			let _collectList = collectList || [];
			_collectList = checked ? _collectList.concat({...data}) : _collectList.filter(item => item.pid !== data.pid);
			return {
				...state,
				collectIt: checked,
				collectCount: _collectCount,
				collectList: _collectList,
			};
		}
		default:
			return state;
	}
}
