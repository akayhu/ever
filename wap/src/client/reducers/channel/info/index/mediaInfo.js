import { combineReducers } from 'redux';
import { loading, dataInfo } from '../../unitReducers';

const mediaInfo = combineReducers({
	dataInfo: dataInfo('mediaInfo'),
	loading: loading('mediaInfo')
});

export default mediaInfo;
