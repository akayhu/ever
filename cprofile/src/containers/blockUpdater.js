import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { is } from 'immutable';
import nameMap from 'config/nameMap';
import schemaMap from 'config/schema';
import { changeShowTag } from 'actions/ui/factory';
import { updateCard } from 'actions/ui/card';
import { blockDataUpdateProcessStart } from 'actions/blocks';
import { uploadCroppedImage } from 'actions/document';
import { requestUpdateCustom } from 'actions/blocks/custom';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { toggleReOrderConfirm } from 'actions/ui/reorder';
import { validateDataModel } from 'utils/validation';
import swap from 'utils/swap';
import { fromJS } from 'immutable';
import html2canvas from 'html2canvas';

class BlockUpdater extends Component {
	static propTypes = {
		config: PropTypes.object.isRequired,
	};
	static defaultProps = {
		config: {},
		meta: {},
	};

	// trigger，欄位有異動觸發更新流程
	handleFeildOnChange = (
		index,
		keyPath,
		value,
		meta,
		multiFeildsUpdate = false,
		convertType
	) => {
		const { blockDataUpdateProcessStart } = this.props;
		const { blockType, uniKey } = this.props.config;
		const metadata = nameMap[blockType].metadata;
		const hooks = {
			validateError: this.handleValidateError,
			shouldUpdateData: this.handleShouldUpdateData,
			updateSuccess: this.handleUpdateSuccess,
			blockFinishUpdate: this.handleBlockFinishUpdate,
		};
		blockDataUpdateProcessStart(
			uniKey,
			{ value, keyPath, index, multiFeildsUpdate },
			metadata,
			hooks,
			convertType
		);
	};

	handleImageUpload = (
		{ hook, meta = {} },
		{ fileId, fileUrlMap, coordinate, convertType }
	) => {
		const {
			index,
			idModelName,
			urlModelName,
			coordinateModelName,
			convertTypeName,
		} = meta;
		const { uniKey } = this.props.config;

		let value = {};
		switch (hook) {
			case 'onBeforeProcessing': {
				// 更新 data uri 到 store 當作暫時的顯示
				value = {
					[urlModelName || 'fileUrlMap']: fileUrlMap,
					[coordinateModelName || 'coordinate']: coordinate,
				};
				isNaN(index)
					? this.handleFeildOnChange(
							undefined,
							[],
							value,
							{},
							true,
							convertType
					  )
					: this.handleFeildOnChange(
							index,
							[index],
							value,
							{},
							true,
							convertType
					  );
				break;
			}
			case 'onStartProcessing': {
				// 上傳新圖片的話，更新新的 fileId，調整圖片不會受到影響
				// 上傳其他檔案需要存 convertType
				value = {
					[idModelName || 'fileId']: fileId,
					[convertTypeName || 'convertType']: convertType,
				};
				isNaN(index)
					? this.handleFeildOnChange(
							undefined,
							[],
							value,
							{},
							true,
							convertType
					  )
					: this.handleFeildOnChange(
							index,
							[index],
							value,
							{},
							true,
							convertType
					  );
				break;
			}
			case 'onFinishProcessing': {
				// 將 data url 換成正式的圖片 url
				const fileUrlKeyPath = isNaN(index)
					? [urlModelName || 'fileUrlMap']
					: [index, urlModelName || 'fileUrlMap'];
				this.props.updateCard(uniKey, fileUrlMap, fileUrlKeyPath);
				break;
			}
			default:
				return;
		}
	};

	// hook，執行所有 state 更新以前, 分成 continue, pending, bailout 三種結果
	handleShouldUpdateData = (blockType, uniKey, action) => {
		// 會影響自動排序的區塊 & 欄位
		const validFieldName = fromJS({
			experience: [
				'expId',
				'status',
				'endYear',
				'endMonth',
				'startYear',
				'startMonth',
				'createDate',
			],
			education: [
				'eduId',
				'degree',
				'status',
				'endYear',
				'endMonth',
				'startYear',
				'startMonth',
				'createDate',
			],
		});

		const { keyPath, value, multiFeildsUpdate } = action.payload;
		const feilds = multiFeildsUpdate ? Object.keys(value) : keyPath.slice(-1);
		const willTriggerReSort =
			feilds.filter(
				feild =>
					validFieldName.get(blockType) &&
					validFieldName.get(blockType).includes(feild)
			).length > 0;

		if (validFieldName.has(blockType) && willTriggerReSort) {
			const uidName = nameMap[blockType].uidName;
			const schema = schemaMap[blockType];
			const currentDataList = this.props.dataEntity.get(uniKey);

			// 多筆、單筆欄位更新
			let nextDataList = fromJS([]);
			if (action.payload.multiFeildsUpdate) {
				// 多筆欄位更新: value = { 欄位1: value1, 欄位2: value2 }, keyPath = [uniKey, (index)]
				const feilds = Object.keys(action.payload.value);
				nextDataList = feilds.reduce((list, feild) => {
					return list.setIn(
						[...action.payload.keyPath, feild],
						fromJS(action.payload.value[feild])
					);
				}, currentDataList);
			} else {
				nextDataList = currentDataList.setIn(
					action.payload.keyPath,
					fromJS(action.payload.value)
				);
			}

			const sortedDataList = this.sortDataList(blockType, nextDataList, schema);

			if (!currentDataList || !sortedDataList) {
				console.error('檢查學經歷重新排序錯誤', {
					blockType,
					uniKey,
					currentDataList,
					sortedDataList,
				});
				return 'bailout';
			}

			// 學經歷需要重新排序，跳出提示並等待直到有回應
			const currentKeys = currentDataList.map(entity => entity.get(uidName));
			const sortedKeys = sortedDataList.map(entity => entity.get(uidName));

			if (!is(currentKeys, sortedKeys)) {
				this.props.toggleReOrderConfirm(true);
				return 'pending';
			}
		}
		return 'continue';
	};

	// hook，必填欄位檢查失敗
	handleValidateError = (uniKey, payload, error) => {
		// this.props.pushSystemMessage('尚有欄位未填寫完整喔!', 'info');
	};

	// hook，欄位更新成功後要做的事
	handleUpdateSuccess = (blockType, uniKey, result) => {};

	// hook，所有 feildOnChange 完成後要做的事
	handleBlockFinishUpdate = (blockType, uniKey) => {
		// 經歷、學歷區塊更新完按規則排序
		if (blockType === 'experience' || blockType === 'education') {
			const uidName = nameMap[blockType].uidName;
			const schema = schemaMap[blockType];
			const currentDataList = this.props.dataEntity.get(uniKey);
			const sortedDataList = this.sortDataList(
				blockType,
				currentDataList,
				schema
			);

			if (!currentDataList || !sortedDataList) {
				console.error('handleBlockFinishUpdate 檢查學經歷重新排序錯誤', {
					blockType,
					uniKey,
					currentDataList,
					sortedDataList,
				});
				return;
			}

			// 學經歷需要重新排序
			const currentKeys = currentDataList.map(entity => entity.get(uidName));
			const sortedKeys = sortedDataList.map(entity => entity.get(uidName));

			if (!is(currentKeys, sortedKeys)) {
				this.props.updateCard(uniKey, sortedDataList);
			}
		}

		// 客製化區塊要更新縮圖快照
		if (blockType === 'custom') {
			this.updateCustomSnapshot(blockType, uniKey);
		}
	};

	// util，製作客製化區塊縮圖
	updateCustomSnapshot = (blockType, uniKey) => {
		html2canvas(document.getElementById(uniKey))
			.then(canvas => {
				const url = canvas.toDataURL('image/jpeg');
				const f = fetch(url)
					.then(res => res.blob())
					.then(
						blob =>
							new File([blob], `custom-snapshot-${uniKey}.png`, {
								type: 'image/png',
							})
					)
					.then(file => file);
				return Promise.all([url, f]);
			})
			.then(([url, f]) => {
				this.props.uploadCroppedImage(f, {
					contentType: f.type,
					fileName: f.name,
					uniKey: uniKey,
					idModelName: 'snapshotFileId',
					urlModelName: 'snapshotFileUrlMap',
					coordinateModelName: 'snapshotCoordinate',
					onUpdateData: (index, keyPath, value) => {
						// 這個 function 不能帶 blockDataUpdateProcessStart 會導致無窮迴圈
						this.props.updateCard(uniKey, value, ['snapshotFileId']);
						const dataModel = this.props.dataEntity.get(uniKey).toJS();
						this.props.requestUpdateCustom({
							...dataModel,
							pid: this.props.user.get('pid'),
							customId: uniKey,
						});
					},
				});
			});
	};

	// util，學歷、經歷排序
	sortDataList = (blockType, dataList, schema) => {
		if (blockType === 'experience') {
			const sortList = dataList.sort((prevItem, nextItem) => {
				const prev = prevItem.toJS();
				const next = nextItem.toJS();

				// experience => status desc, endYear desc, endMonth desc, startYear desc, startMonth desc, createDate desc
				const checkIdIsTmp = swap(prev.expId, next.expId, 'tmp-forward');
				const isAnyTmpToRealId =
					validateDataModel(prev, schema) || validateDataModel(next, schema);
				if (checkIdIsTmp !== 0 && !isAnyTmpToRealId) return checkIdIsTmp;
				if (prev.status !== next.status)
					return swap(prev.status, next.status, 'desc');
				if (prev.endYear !== next.endYear)
					return swap(prev.endYear, next.endYear, 'desc');
				if (prev.endMonth !== next.endMonth)
					return swap(prev.endMonth, next.endMonth, 'desc');
				if (prev.startYear !== next.startYear)
					return swap(prev.startYear, next.startYear, 'desc');
				if (prev.startMonth !== next.startMonth)
					return swap(prev.startMonth, next.startMonth, 'desc');
				if (prev.createDate !== next.createDate)
					return swap(prev.createDate, next.createDate, 'desc');
				return 1; // 預設往後擺
			});
			return sortList;
		}

		if (blockType === 'education') {
			const sortList = dataList.sort((prevItem, nextItem) => {
				const prev = prevItem.toJS();
				const next = nextItem.toJS();

				// education => degree asc, status asc, endYear desc, endMonth desc, startYear desc, startMonth desc, createDate desc
				const checkIdIsTmp = swap(prev.eduId, next.eduId, 'tmp-forward');
				const isAnyTmpToRealId =
					validateDataModel(prev, schema) || validateDataModel(next, schema);
				if (checkIdIsTmp !== 0 && !isAnyTmpToRealId) return checkIdIsTmp;
				if (prev.degree !== next.degree)
					return swap(prev.degree, next.degree, 'asc');
				if (prev.status !== next.status)
					return swap(prev.status, next.status, 'asc');
				if (prev.endYear !== next.endYear)
					return swap(prev.endYear, next.endYear, 'desc');
				if (prev.endMonth !== next.endMonth)
					return swap(prev.endMonth, next.endMonth, 'desc');
				if (prev.startYear !== next.startYear)
					return swap(prev.startYear, next.startYear, 'desc');
				if (prev.startMonth !== next.startMonth)
					return swap(prev.startMonth, next.sstartMonth, 'desc');
				if (prev.createDate !== next.createDate)
					return swap(prev.createDate, next.createDate, 'desc');
				return -1; // 預設往前擺
			});
			return sortList;
		}
		return false;
	};

	render() {
		const meta = {
			editable: true,
			canDrag: true,
			feildOnChange: this.handleFeildOnChange,
			imageUpload: this.handleImageUpload,
			changeShowTag,
		};

		return this.props.children(meta);
	}
}

const matStateToProps = (state, props) => ({
	user: state.get('user'),
	dataEntity: state.get('data'),
});

export default connect(
	matStateToProps,
	{
		updateCard,
		blockDataUpdateProcessStart,
		uploadCroppedImage,
		requestUpdateCustom,
		toggleReOrderConfirm,
		pushSystemMessage,
	}
)(BlockUpdater);
