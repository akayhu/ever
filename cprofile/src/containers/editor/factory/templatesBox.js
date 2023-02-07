import React, { PureComponent, Fragment } from 'react';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import CategoryTitle from 'components/categoryTitle';
import nameMap from 'config/nameMap';
import border_a from 'components/defaultSmallImage/project_thumbnail_highlight.png';
import mobileBorder_a from 'components/defaultSmallImage/mobile_project_thumbnail_highlight.png';
import Lightbox from 'components/lightbox';
import TemplateDnD from './templateDnd';
import { changeTemplate, addCard } from 'actions/ui/card';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import GithubRepo from 'components/githubRepo';
import BehanceRepo from 'components/behanceRepo';
import withScrollAnchor from 'containers/scrollAnchor';
import { SubmitButtonSmallSquare } from 'share/styledComponents';
import { isMobile } from 'react-device-detect';
import defaultTemplatePreview from 'components/defaultSmallImage/defaultTopicGallery.png';
import {
	TemplateContainer,
	BorderBoxHover,
	BorderBox,
	BorderBoxSelect,
	Template,
	TemplatePreview,
	PreviewContainer,
	CustomSelected,
	CustomSelectedEmpty,
} from './styledComponents';

class TemplateBox extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			template: '',
			preview: '',
			customUniKey: '',
			// REFACTOR: 整理 connector 重新匯入的顯示邏輯
			githubRepo: false,
			behanceRepo: false,
		};
	}

	_lightboxHandleOpen = () => {
		this.props.lightboxOpen();
	};

	_lightboxHandleCancel = () => {
		this.setState({
			template: '',
			preview: '',
		});
		this.props.lightboxClose();
	};

	_handleChoose = (template, notYetImport, targetUniKey, blockType) => {
		const { changeTemplate, dataEntity } = this.props;
		const templateType = template.templateType
			? template.templateType
			: template.get('templateType');
		const preview = template.preview
			? template.preview
			: template.get('preview');

		// 有匯入，click 直接切換主題
		if (!notYetImport && blockType !== 'custom') {
			changeTemplate(targetUniKey, templateType, blockType);
		} else {
			// 沒有匯入，click 會跳出 lightbox 預覽視窗
			const snapshotFileUrlMap =
				dataEntity.getIn([targetUniKey, 'snapshotFileUrlMap']) &&
				dataEntity.getIn([targetUniKey, 'snapshotFileUrlMap']).toJS();
			this.setState({
				template: template,
				preview:
					(snapshotFileUrlMap &&
						(snapshotFileUrlMap.w1920 ||
							snapshotFileUrlMap.w960 ||
							snapshotFileUrlMap.w600)) ||
					preview ||
					defaultTemplatePreview,
				customUniKey: targetUniKey,
				githubRepo: false,
				behanceRepo: false,
			});
			this._lightboxHandleOpen();
		}

		this.props.scrollToAnchor(targetUniKey);
	};

	_handleImport = (template, targetUniKey) => {
		const { blockType, blocksList, addCard, config } = this.props;
		const insertIndex = blocksList.toJS().length;
		const templateType = template.get('templateType');
		const targetConfig = config.get(targetUniKey);
		addCard(blockType, targetUniKey, insertIndex, templateType, !targetConfig);
		this.props.scrollToAnchor(targetUniKey);
		this._lightboxHandleCancel();
	};

	_handleReImportOpen = connector => {
		this.props.lightboxOpen();
		this.setState({ [connector]: true });
	};

	// REFACTOR: 合併這三個 connector fn
	_closeGithubRepo = () => {
		this.setState({ githubRepo: false });
		this.props.lightboxClose();
	};

	_closeBehanceRepo = () => {
		this.setState({ behanceRepo: false });
		this.props.lightboxClose();
	};

	render() {
		const { preview, template, githubRepo, behanceRepo } = this.state;
		const { blockType, templates, config, dataEntity, user } = this.props;
		const targetConfig = config.find(
			data => data.get('blockType') === blockType
		);
		const targetUniKey =
			blockType !== 'custom'
				? targetConfig
					? targetConfig.get('uniKey')
					: uuidv4()
				: uuidv4();
		const blockTemplates = templates.get(blockType).toArray();
		const currentTemplate = targetConfig
			? targetConfig.get('templateType')
			: '';
		const notYetImport = targetConfig ? !targetConfig.get('visibility') : true;
		const customConfig = config
			.filter(data => data.get('blockType') === 'custom')
			.toArray();

		return (
			<Fragment>
				<TemplateContainer>
					<CategoryTitle
						title={nameMap[blockType].name}
						icon="icon-arrow_back"
						blockType={''}
						fontSize="20"
					/>
					{blockType === 'github' && (
						<div
							className="re-import"
							onClick={this._handleReImportOpen.bind(this, 'githubRepo')}
						>
							重新匯入GitHub
						</div>
					)}
					{blockType === 'behance' && (
						<div
							className="re-import"
							onClick={this._handleReImportOpen.bind(this, 'behanceRepo')}
						>
							重新匯入Behance
						</div>
					)}
					{blockTemplates.map((obj, index) => {
						const active =
							!notYetImport && currentTemplate === obj.get('templateType');
						return (
							<BorderBox key={index}>
								<TemplateDnD
									uniKey={targetUniKey}
									{...obj.toJS()}
									canDrag={notYetImport}
									needCreate={!targetConfig}
								>
									<Template
										image={isMobile ? obj.get('mobileThumb') : obj.get('thumb')}
									/>
									<BorderBoxHover
										onClick={this._handleChoose.bind(
											this,
											obj,
											notYetImport,
											targetUniKey,
											blockType
										)}
									/>
								</TemplateDnD>
								{active && blockType !== 'custom' && (
									<BorderBoxSelect>
										<img
											src={isMobile ? mobileBorder_a : border_a}
											alt={targetUniKey}
											onClick={this.props.scrollToAnchor.bind(
												this,
												targetUniKey
											)}
										/>
									</BorderBoxSelect>
								)}
							</BorderBox>
						);
					})}
				</TemplateContainer>
				{blockType === 'custom' && (
					<TemplateContainer>
						<CustomSelected>已新增的客製化專區</CustomSelected>
						{customConfig.length > 0 ? (
							customConfig.map((obj, index) => {
								const customTemplates = templates
									.get('custom')
									.get(obj.toJS().templateType);
								const snapshotFileUrlMap =
									dataEntity.getIn([obj.get('uniKey'), 'snapshotFileUrlMap']) &&
									dataEntity
										.getIn([obj.get('uniKey'), 'snapshotFileUrlMap'])
										.toJS();
								const active = obj.get('visibility');
								return (
									<BorderBox key={index}>
										<TemplateDnD
											uniKey={obj.get('uniKey')}
											{...obj.toJS()}
											canDrag={notYetImport}
											needCreate={!customConfig}
										>
											<Template
												image={
													(snapshotFileUrlMap &&
														(snapshotFileUrlMap.w600 ||
															snapshotFileUrlMap.w960 ||
															snapshotFileUrlMap.w1920)) ||
													customTemplates.get('thumb')
												}
											/>
											<BorderBoxHover
												onClick={this._handleChoose.bind(
													this,
													customTemplates,
													!active,
													obj.get('uniKey'),
													blockType
												)}
											/>
										</TemplateDnD>
										{active && (
											<BorderBoxSelect>
												<img
													src={isMobile ? mobileBorder_a : border_a}
													alt={obj.get('uniKey')}
													onClick={this.props.scrollToAnchor.bind(
														this,
														obj.get('uniKey')
													)}
												/>
											</BorderBoxSelect>
										)}
									</BorderBox>
								);
							})
						) : (
							<CustomSelectedEmpty>目前沒有任何資料喔</CustomSelectedEmpty>
						)}
					</TemplateContainer>
				)}
				{preview && (
					<Lightbox
						title="模板預覽"
						width="60%"
						onCancel={this._lightboxHandleCancel}
						cssClassName="templatePreview"
					>
						<PreviewContainer>
							<TemplatePreview src={preview} />
							<SubmitButtonSmallSquare
								style={{ marginTop: '20px' }}
								onClick={this._handleImport.bind(
									this,
									template,
									blockType === 'custom'
										? this.state.customUniKey
										: targetUniKey
								)}
							>
								新增到畫面上
							</SubmitButtonSmallSquare>
						</PreviewContainer>
					</Lightbox>
				)}
				{/* REFACTOR: 整理 connector 重新匯入的顯示邏輯 */}
				{/* githubRepo lightbox */
				githubRepo && (
					<GithubRepo
						closeGithubRepo={this._closeGithubRepo}
						user={user.toJS()}
					/>
				)}
				{/* behanceRepo lightbox */
				behanceRepo && (
					<BehanceRepo
						closeBehanceRepo={this._closeBehanceRepo}
						user={user.toJS()}
						reImportBehance={true}
					/>
				)}
			</Fragment>
		);
	}
}

const mapStateToPorps = state => ({
	dataEntity: state.get('data'),
	templates: state.get('templates'),
	blocksList: state.get('blocksList'),
	config: state.get('config'),
	user: state.get('user'),
});

export default compose(
	connect(
		mapStateToPorps,
		{ changeTemplate, addCard, lightboxOpen, lightboxClose }
	),
	withScrollAnchor
)(TemplateBox);
