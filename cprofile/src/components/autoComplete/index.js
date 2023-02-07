import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Autocomplete from 'react-autocomplete';
import autosize from 'autosize';
import uuid from 'uuid/v4';
import { requestAC } from 'actions/ac';
import setting from '../../config/autoComplete';
import withScrollAnchor from 'containers/scrollAnchor';
import { handleFieldCheck } from 'utils/fieldCheck';
import './style.scss';

export class ACInput extends PureComponent {
	static propTypes = {
		/** 是否顯示範例文案 */
		showFirstUseSample: PropTypes.bool.isRequired,
		/** 提示輸入文案 */
		placeHolder: PropTypes.string,
		/** 當前文字 */
		value: PropTypes.string,
		/** 除了文字以外的補充資訊 */
		meta: PropTypes.object,
		/** 是否可編輯 */
		editable: PropTypes.bool.isRequired,
		/** 自動完成資料類別 */
		autoCompleteName: PropTypes.oneOf([
			'companyName',
			'jobTitle',
			'ability',
			'schoolName',
			'major',
		]).isRequired,
		/** 容器的 style */
		wrapperClassName: PropTypes.string,
		/** input style */
		inputClassName: PropTypes.string,
		/** 範例文案 */
		sampleText: PropTypes.string,
		/** 是否為必填欄位 (顯示紅色字) */
		isRequired: PropTypes.bool,
		overflow: PropTypes.string,
		/** 開關新增字詞面板 */
		toggleFreeKeyPanel: PropTypes.func.isRequired,
		/** 更新自由編輯字詞的 event handler */
		onSaveFreeKeyItem: PropTypes.func,
		/** 更新字詞面板的設定 */
		setFreeKeyPanelOption: PropTypes.func.isRequired,
		/** 取得選擇的項目關鍵字 */
		onUpdateData: PropTypes.func.isRequired,
		/** API 取得自動完成字詞列表 */
		requestAC: PropTypes.func.isRequired,
	};

	static defaultProps = {
		showFirstUseSample: false,
		sampleText: '',
		placeHolder: '',
		value: '',
		editable: false,
		isRequired: false,
		onUpdateData: (value, meta) => {
			console.log('onUpdateData', value, meta);
		},
		toggleFreeKeyPanel: () => {},
		setFreeKeyPanelOption: option => {
			// console.log(option);
		},
		requestAC: () => {},
		wrapperClassName: '',
		inputClassName: '',
		meta: {},
	};

	constructor(props) {
		super(props);
		this.inputRef = null;
		this.state = {
			items: [],
			editing: false,
			showSample: props.showFirstUseSample,
			placeHolder: props.placeHolder,
			value: props.value,
			meta: props.meta,
			invalidText: false,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!prevState.editing) {
			return {
				...prevState,
				showSample: nextProps.showFirstUseSample,
				placeHolder: nextProps.placeHolder,
				value: nextProps.value,
				meta: nextProps.meta,
			};
		}
		return null;
	}

	componentDidMount = () => {
		if (this.inputRef && this.inputRef.refs.input) {
			autosize(this.inputRef.refs.input);
		}
	};

	componentWillUnmount = () => {
		if (this.input && this.inputRef.refs.input) {
			autosize.destroy(this.inputRef.refs.input);
		}
	};

	componentDidUpdate() {
		this.inputRef &&
			this.inputRef.refs.input &&
			autosize.update(this.inputRef.refs.input);
	}

	_updateList = (res = {}) => {
		let items = res.Result || [];
		this.setState({ items });
	};

	_onSelect = (value, item) => {
		// 送出的地方
		this.setState(
			state => ({ value, items: [], meta: { ...state.meta, item } }),
			() => {
				this.inputRef.blur();
			}
		);
	};

	_onFocus = event => {
		this.setState(
			{ editing: true, placeHolder: '', invalidText: false },
			() => {
				this._onChange(null, this.state.value, this.state.meta);
			}
		);
	};

	_fieldCheck(targetVale) {
		const { blockType, autoCompleteName } = this.props;

		const reFocus = !handleFieldCheck(blockType, autoCompleteName, targetVale);

		if (reFocus) {
			this.inputRef.refs.input.id = 'tmpIdForScroll';
			this.props.scrollToAnchor('tmpIdForScroll');
			this.setState({ invalidText: true });
		}
	}

	_onBlur = e => {
		const valueName = setting[this.props.autoCompleteName].value;
		this.props.onUpdateData(this.state.value, this.state.meta);
		// 檢查是否為 freekey
		const isFreeKey =
			this.state.items.length > 0 &&
			this.state.items.every(item => item[valueName] !== this.state.value);
		if (isFreeKey) {
			this.props.toggleFreeKeyPanel(true);
		}

		this.setState({ editing: false, placeHolder: this.props.placeHolder });
		this._fieldCheck(e.target.value);
	};

	_onChange = (event, value) => {
		const { autoCompleteName, setFreeKeyPanelOption } = this.props;
		setFreeKeyPanelOption({ keyword: value });
		this.setState({ value });
		if (value) {
			this.props.requestAC(
				{ autoCompleteName: setting[autoCompleteName].endpoint, value },
				this._updateList
			);
		}
	};

	_onClick = e => {
		if (!this.props.editable) return;
		if (this.state.showSample) this.setState({ showSample: false });
	};

	// 開啟新增字詞面板
	_triggerFreeKeyPanel = () => {
		this.props.setFreeKeyPanelOption({ keyword: this.state.value });
		this.props.toggleFreeKeyPanel(true);
		this.inputRef.blur();
	};

	// 顯示下拉選單
	_renderMenu = children => {
		// 顯示新增 freekey 選項
		return <div className="auto-complete__menu">{children}</div>;
	};

	// 顯示下拉選單選項
	_renderItem = (item, isHighlighted) => {
		const { autoCompleteName } = this.props;

		// 不合法的 autoComplateName
		if (!item) {
			console.error('不合法的 autoComplateName', autoCompleteName);
			return null;
		}

		const valueName = setting[autoCompleteName].value;
		return (
			<div className="auto-complete__menu-item" key={uuid()}>
				{item[valueName]}
			</div>
		);
	};

	// 每個選項 click 後得到的數值
	_getItemValue = item => {
		const { autoCompleteName } = this.props;
		if (autoCompleteName in setting) {
			const valueName = setting[autoCompleteName].value;
			return item[valueName] || '';
		}
		return '';
	};

	_renderInput = props => {
		return (
			<Fragment>
				<textarea
					rows={1}
					{...props}
					{...this.convertMetaToDataAttribute(this.state.meta)}
					value={props.value || ''}
				/>
			</Fragment>
		);
	};

	_renderViewOnlyText = () => {
		const { wrapperClassName, inputClassName } = this.props;
		const { value } = this.state;
		return (
			<div
				className={`auto-complete ${wrapperClassName} ${wrapperClassName}-preview`}
				{...this.convertMetaToDataAttribute(this.state.meta)}
			>
				<p
					className={`auto-complete__input ${inputClassName}`}
					{...this.convertMetaToDataAttribute(this.state.meta)}
				>
					{value}
				</p>
			</div>
		);
	};

	convertMetaToDataAttribute = (meta = {}) =>
		Object.keys(meta).reduce(
			(newProps, key) => ({
				...newProps,
				[`data-${key.toLowerCase()}`]: meta[key],
			}),
			{}
		);

	render() {
		const {
			editable,
			wrapperClassName,
			inputClassName,
			sampleText,
			isRequired,
		} = this.props;
		const { value, items, showSample, placeHolder } = this.state;
		const displaySample = editable && !value && showSample && sampleText;

		return (
			<Fragment>
				{editable && (
					<Autocomplete
						ref={el => (this.inputRef = el)}
						inputProps={{
							required: true,
							placeholder: placeHolder,
							onBlur: this._onBlur,
							onFocus: this._onFocus,
							onClick: this._onClick,
							disabled: !editable,
							'data-required': isRequired,
							className: `auto-complete__input ${inputClassName}
							${this.state.invalidText ? 'invalid-text' : ''}`,
							...this.convertMetaToDataAttribute(this.state.meta),
						}}
						wrapperProps={{
							className: `auto-complete ${wrapperClassName}`,
							...this.convertMetaToDataAttribute(this.state.meta),
						}}
						value={displaySample ? sampleText : value} // 顯示順序：真實數值 > sample > placeHolder
						items={items}
						getItemValue={this._getItemValue}
						onSelect={this._onSelect}
						onChange={this._onChange}
						renderMenu={this._renderMenu}
						renderItem={this._renderItem}
						renderInput={this._renderInput}
					/>
				)}
				{!editable && this._renderViewOnlyText()}
			</Fragment>
		);
	}
}

const mapStateToPorps = state => ({
	config: state.get('config'),
});

export default compose(
	connect(
		mapStateToPorps,
		{
			requestAC,
		}
	),
	withScrollAnchor
)(ACInput);
