import React, { Component } from 'react';
import uuid from 'uuid/v4';
import { Image } from 'share/styledComponents';
import templateSetting from 'templates/setting';
import defaultPlusImg from 'components/defaultSmallImage/defaultTopicGallery.png';
import PlusActivityViewer from 'containers/plusActivityViewer';
import Toolbar from 'containers/toolbar/element';
import './style.scss';

class PlusActivity extends Component {
	static defaultProps = {
		data: {
			type: null,
			createTimestamp: 0,
			dataList: [],
			pid: -3,
		},
	};

	// 列表縮圖
	renderImage = (image, width, height) => {
		return (
			<Image
				key={uuid()}
				src={image || defaultPlusImg}
				onError={e => {
					e.target.src = defaultPlusImg;
				}}
				width={width}
				height={height}
			/>
		);
	};

	// 列表文字過濾
	summaryParser = summary => {
		if (typeof summary === 'string') {
			summary = summary
				.replace(/&lt;/g, '＜')
				.replace(/&gt;/g, '＞')
				.replace(/&nbsp;/g, ' ')
				.replace(/&#xa0;/g, ' ')
				.replace(/&amp;/g, '&')
				.replace(/&quot;/g, '"');
			return summary;
		}
		return summary;
	};

	// 第一個模板
	renderDefTemplate = (index, title, content, image, summary) => {
		const { editable } = this.props.meta;
		return (
			<PlusActivityViewer
				key={index}
				classNameContent={
					editable
						? 'plus_activity-def-main'
						: 'plus_activity-def-main plus_activity-preview'
				}
				articleTitle={title}
				data={content}
				link
			>
				<div className="plus_activity-def-img">
					{this.renderImage(image, 278, 156)}
				</div>
				<p className="plus_activity-def-title">{title}</p>
				<p className="plus_activity-def-description">{summary}</p>
			</PlusActivityViewer>
		);
	};

	// 第二個模板
	renderDarkTemplate = (index, title, content, image, summary) => {
		return (
			<PlusActivityViewer
				key={index}
				classNameContent="plus_activity-dark-main plus_activity-preview"
				articleTitle={title}
				data={content}
				link
			>
				<div className="plus_activity-dark-img">
					{this.renderImage(image, 350, 188)}
				</div>
				<div className="plus_activity-dark-content">
					<p className="plus_activity-dark-title">{title}</p>
					<div className="plus_activity-dark-bottom">{summary}</div>
				</div>
			</PlusActivityViewer>
		);
	};

	// 第三個模板
	renderNewTemplate = (index, title, content, image, summary) => {
		return (
			<PlusActivityViewer
				key={index}
				classNameContent="plus_activity-new-main plus_activity-preview"
				articleTitle={title}
				data={content}
				link
			>
				<div className="plus_activity-new-content">
					<p className="plus_activity-new-title">{title}</p>
					<div className="plus_activity-new-bottom">{summary}</div>
				</div>
				<div className="plus_activity-new-img">
					{this.renderImage(image, 350, 180)}
				</div>
			</PlusActivityViewer>
		);
	};

	// 呈現模板
	renderTemplate = (
		{ image, title, summary, content },
		templateType = 'def',
		index
	) => {
		if (!(templateType in templateSetting['plus_activity'])) return null;
		summary = this.summaryParser(summary);
		const template = {
			imageLeft: this.renderDarkTemplate(index, title, content, image, summary),
			imageRight: this.renderNewTemplate(index, title, content, image, summary),
			def: this.renderDefTemplate(index, title, content, image, summary),
		};
		return template[templateType] || template['def'];
	};

	render() {
		const { data, config, meta, commonMode } = this.props;
		const { editable } = meta;
		const { blockType, uniKey, templateType } = config;
		const dataLength = data.length;
		const list = data || [];

		if (!list || !list.length) return null;

		return (
			<div className="plus_activity-container">
				{// REFACTOR: 考慮如何讓 connectorPanel 能共用 template (list render 位置)
				list.map((elm, index) => {
					const isUnSaved = /tmp-/.test(elm.aid);
					return editable ? (
						<Toolbar
							toolBarType="blockElem"
							key={`${uniKey}-${index}`}
							dataLength={dataLength}
							displayFlex={true}
							editable={editable}
							isUnSaved={isUnSaved}
							{...{ blockType, uniKey, elm, templateType }}
							index={index}
							commonMode={commonMode}
							// changeSwitchTransition={this.changeSwitchTransition}
						>
							{this.renderTemplate(elm, config.templateType, index)}
						</Toolbar>
					) : (
						this.renderTemplate(elm, config.templateType, index)
					);
				})}
			</div>
		);
	}
}

// REFACTOR: 拔掉
export default {
	def: PlusActivity,
	imageLeft: PlusActivity,
	imageRight: PlusActivity,
};
