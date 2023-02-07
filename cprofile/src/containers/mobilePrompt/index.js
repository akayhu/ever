import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mobilePromptClose } from 'actions/ui/mobilePrompt';
import './style.css';

const MobilePrompt = props => {
	const { commonMode } = props;
	const dispatch = useDispatch();
	const visible = useSelector(state =>
		state.getIn(['ui', 'mobilePrompt', 'visible'])
	);
	return (
		<Fragment>
			{visible && (
				<div
					className="mobile-prompt-main"
					style={commonMode ? { top: '0' } : null}
				>
					<div className="mobile-prompt-text">
						建議在電腦上編輯個人檔案以擁有最佳體驗
					</div>
					<div className="mobile-prompt-close-div">
						<i
							className="icon-icon_cancel mobile-prompt-close"
							onClick={() => dispatch(mobilePromptClose())}
						/>
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default MobilePrompt;
