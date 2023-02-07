import React, { useState } from 'react';
import { Rate } from 'antd';
import './style.scss';

const Star = props => {
	const { grade, gradeChange, disabled } = props;
	const [value, setValue] = useState(grade);
	const handleChange = newValue => {
		setValue(newValue);
		gradeChange(newValue);
	};

	return (
		<Rate
			onChange={handleChange}
			defaultValue={value}
			value={value}
			disabled={disabled ? disabled : false}
			allowClear={false}
		/>
	);
};

export default Star;
