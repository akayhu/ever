import React, { useState } from 'react';
import { compose } from 'recompose';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllDataProcessStart } from 'actions/blocks';
import ImportMain from '../import';
import { BrowserView, MobileView } from 'react-device-detect';
import { withBlockingAlert } from 'containers/blockingAlert';
import { hasAnyProcessing } from 'utils/process';
import { ImportContentItemContent } from './styledComponents';

const Import = props => {
	const { checkConditionAndBlocking } = props;
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const pid = useSelector(state => state.getIn(['user', 'pid']));

	const _handleChange = () => {
		if (!open) {
			checkConditionAndBlocking(newState => setOpen(newState), {
				open: true,
			});
		}
	};

	const _handleCancel = () => {
		setOpen(false);
	};

	const _handleFinishImport = () => {
		dispatch(fetchAllDataProcessStart(pid));
	};

	return (
		<ImportContentItemContent onClick={_handleChange}>
			<BrowserView>匯入檔案</BrowserView>
			<MobileView>匯入</MobileView>
			{open && (
				<ImportMain
					onCancel={_handleCancel}
					onFinishImport={_handleFinishImport}
					firstUse={false}
				/>
			)}
		</ImportContentItemContent>
	);
};

export default compose(
	withBlockingAlert({
		condition: state => hasAnyProcessing(state.get('process')),
		message: '正在儲存資料中，請稍待片刻 ...',
	})
)(Import);
