import { all } from 'redux-saga/effects';
import {
	watchAccountProcess,
	watchInitialProfile,
	watchLoginStatus,
	watchLogin,
	watchLogout,
} from './user';
import { watchUploadProcess, watchFetchPreviewFile } from './document';
import { watchBlockUpdater } from './blocks/updater';
import { watchBlockElemDeleter } from './blocks/deleter';
import { watchBlockSettingChange } from './blocks/setting';
import { watchFetchAllData } from './blocks/fetchAllData';
import { watchUpdateUserData } from './blocks/basic';
import { watchBlockSortChange, watchBlockElemSortChange } from './sort';
import { watchPusherMessage, watchPusherDisconnect } from './pusher';
import { watchSearch } from './search';
import { initPreview } from './preview';
import {
	publishProcess,
	fetchPrivacyProcess,
	setPrivacyProcess,
	switchPrivacyProcess,
} from './publish';
import { importProcess } from './import';
import { fetchMyCollection, toggleCollection } from './collection';

// TODO: 優化時要調整 naming
export default function* rootSaga() {
	yield all([
		watchAccountProcess(),
		watchLoginStatus(),
		watchLogin(),
		watchLogout(),
		watchUploadProcess(),
		watchBlockUpdater(),
		watchFetchAllData(),
		watchBlockSortChange(),
		watchBlockElemSortChange(),
		watchBlockSettingChange(),
		watchBlockElemDeleter(),
		watchPusherMessage(),
		watchPusherDisconnect(),
		watchInitialProfile(),
		watchFetchPreviewFile(),
		watchSearch(),
		initPreview(),
		publishProcess(),
		importProcess(),
		fetchMyCollection(),
		toggleCollection(),
		fetchPrivacyProcess(),
		setPrivacyProcess(),
		switchPrivacyProcess(),
		watchUpdateUserData(),
	]);
}
