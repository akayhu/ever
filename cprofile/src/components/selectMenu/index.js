import React, { useRef } from 'react';
import { Select } from 'antd';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import './style.scss';

const Title = styled.p`
	font-size: 14px;
	color: #345;
`;

// TODO: 待做上 isRequired 讓 placeholder 顯示為紅色
const SelectMenu = props => {
	const {
		onUpdateData,
		dropdownClassName,
		itemList,
		defaultValue,
		placeholder,
		editable,
		isRequired,
		value,
	} = props;
	const selectRef = useRef(null);
	const target = fromJS(itemList).find(elm => elm.get('key') === value);
	const name = (target && target.get('name')) || '選項名稱';
	const handleOnSelect = value => {
		onUpdateData(value);
		selectRef.current.blur();
	};

	if (!editable) return <Title>{name}</Title>;

	return (
		<div className="select-menu" {...{ 'data-required': isRequired || false }}>
			<Select
				ref={selectRef}
				dropdownClassName={`${dropdownClassName} test`}
				value={value || undefined}
				defaultValue={defaultValue}
				style={placeholder ? { minWidth: '125px' } : { minWidth: '100px' }}
				onChange={handleOnSelect}
				disabled={!editable}
				placeholder={placeholder}
				dropdownMatchSelectWidth={false}
				notFoundContent="選單為空的喔"
			>
				{itemList.length &&
					itemList.map((item, key) => (
						<Select.Option key={item.key} value={item.key} title={item.name}>
							{item.name}
						</Select.Option>
					))}
			</Select>
		</div>
	);
};

export default SelectMenu;
