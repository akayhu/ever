import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { validCategory } from 'config/category';
import { getItemByNo } from 'utils/category';
import './style.scss';

class CategoryPicker extends Component {
	static propTypes = {
		/** 提示輸入文案 */
		placeHolder: PropTypes.string.isRequired,
		/** 是否可編輯 */
		editable: PropTypes.bool.isRequired,
		/** 選取的項目編號 */
		selectedNo: PropTypes.string.isRequired,
		/** 類目資料來源 */
		dataSource: PropTypes.oneOf(validCategory).isRequired,
		/** 取得選擇的項目關鍵字 */
		onUpdateData: PropTypes.func.isRequired,
		/** 是否為必填欄位 (顯示紅色字) */
		isRequired: PropTypes.bool,
		/** 自訂觸發類目選單欄位的樣式 */
		className: PropTypes.string,
		/** 除了文字以外的補充資訊 */
		meta: PropTypes.object,
	};

	static defaultProps = {
		editable: false,
		isRequired: false,
		placeholder: '',
		selectedNo: '',
		className: '',
		meta: {},
		onUpdateData: () => {},
	};

	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			selectedNo: props.selectedNo || null,
			description: getItemByNo(props.list.toJS(), props.selectedNo).des || '',
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.editing) return null;
		if (nextProps.selectedNo !== prevState.selectedNo) {
			return {
				selectedNo: nextProps.selectedNo || null,
				description:
					getItemByNo(nextProps.list.toJS(), nextProps.selectedNo).des || '',
			};
		}
		return null;
	}

	componentDidMount = () => {
		const { des } = getItemByNo(this.props.list.toJS(), this.props.selectedNo);
		if (des) this.setState({ description: des });
	};

	// 開啟類目選單
	handleOpenCategoryPicker = selectedNo => {
		const { onUpdateData, dataSource } = this.props;
		if (window.categoryPicker) {
			window.categoryPicker.open({
				dataSource,
				theme: 'customer-theme',
				maxSelectedNumber: 1,
				backdropClose: true,
				selectedItems: [{ no: selectedNo }],
				onAppend: () => {
					this.setState({ editing: true });
				},
				onSubmit: ({ selectedItems }) => {
					const item = selectedItems[0];
					if (!item) {
						this.setState({ description: '', selectedNo: null });
					} else {
						this.setState({ description: item.des, selectedNo: item.no });
						onUpdateData(item.no);
					}
				},
				onClose: () => {
					this.setState({ editing: false });
				},
			});
		}
	};

	// 將 meta 轉成 data attribute
	convertMetaToDataAttribute = (meta = {}) =>
		Object.keys(meta).reduce(
			(newProps, key) => ({
				...newProps,
				[`data-${key.toLowerCase()}`]: meta[key],
			}),
			{}
		);

	// 編輯類目選單input
	renderInputEdit = () => {
		const { description } = this.state;
		const { className, placeHolder, selectedNo, isRequired, meta } = this.props;

		return (
			<input
				value={description}
				placeholder={placeHolder}
				className={`category-picker--trigger ${className}`}
				onClick={this.handleOpenCategoryPicker.bind(this, selectedNo)}
				data-required={isRequired}
				readOnly
				{...this.convertMetaToDataAttribute(meta)}
			/>
		);
	};

	// 個人頁(預覽)類目選單呈現
	renderInputView = () => {
		const { description } = this.state;
		const { className, meta } = this.props;
		return (
			<div
				className={`category-picker--trigger category-picker--preview ${className}`}
				{...this.convertMetaToDataAttribute(meta)}
			>
				{description}
			</div>
		);
	};

	render() {
		const { editable } = this.props;
		return editable ? this.renderInputEdit() : this.renderInputView();
	}
}

const mapStateToPorps = (state, { dataSource }) => ({
	list: state.getIn(['category', dataSource], List()),
});

export default connect(mapStateToPorps)(CategoryPicker);
