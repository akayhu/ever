import React, { useState, useEffect } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import './style.scss';

const SaveLoadingBar = () => {
	const [completed, setCompleted] = useState(99.5);
	const progress = completed => {
		if (completed > 100) {
			setCompleted(100);
		} else {
			setCompleted(completed);
			const diff = Math.random() * 100;
			setTimeout(() => progress(completed + diff), 0);
		}
	};

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		if (!signal) progress(99);
		return () => abortController.abort();
	}, []);

	return (
		<div className="save-loading-bar">
			<LinearProgress
				color="#f5b532"
				mode="determinate"
				min={60}
				style={{
					backgroundColor: '#fff',
					height: '3px',
				}}
				value={completed}
			/>
		</div>
	);
};

export default SaveLoadingBar;
