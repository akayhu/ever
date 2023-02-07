import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { MobileView } from 'react-device-detect';
import behanceLogo from 'components/defaultSmallImage/PbyBehance-horizontal.png';
import './style.scss';

// -webkit-box-orient: vertical 在 class 裡不會出現，改用 styled-components 解決
const BehanceBlockTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	line-height: 1.35;
	color: #484848;
	padding: 10px;
	font-family: PingFangTC;
	overflow: hidden;
	display: -webkit-box;
	line-height: 1.5;
	-webkit-line-clamp: 2;
	max-height: 55px;
	-webkit-box-orient: vertical;
`;

const BehanceBlockDescription = styled.div`
	font-size: 12px;
	margin: 0 10px 10px;
	overflow: hidden;
	display: -webkit-box;
	line-height: 1.5;
	-webkit-line-clamp: 2;
	max-height: 34px;
	-webkit-box-orient: vertical;
	color: #7e7e7e;
`;

class BehanceAch extends Component {
	_behanceDefTemplate = () => {
		const { data, meta } = this.props;
		const { editable } = meta;
		const projectsList = data && data.projectList ? data.projectList : '';
		return (
			<div className="default_behance_outer_layer">
				{projectsList &&
					projectsList.map((elm, index) => {
						return (
							<div
								key={index}
								className={
									editable
										? 'default_behance-block-main-three'
										: 'default_behance-block-main-three behance-preview'
								}
							>
								<a
									href={elm.projectURL}
									target="_blank"
									title={elm.projectName}
									rel="noopener noreferrer"
								>
									<img
										src={elm.projectCover_404}
										className="default_behance-block-img"
										alt={elm.projectName}
									/>
									<BehanceBlockTitle>{elm.projectName}</BehanceBlockTitle>
									<BehanceBlockDescription>
										{elm.projectFields[0]}
									</BehanceBlockDescription>
									<div className="default_behance-block-hide-footer" />
									<div className="default_behance-block-footer">
										<span>
											<i className="icon-icon_favorite" />{' '}
											{elm.projectAppreciations}
										</span>
										<span>
											<i className="icon-icon_dialogue" /> {elm.projectComments}
										</span>
										<span>
											<i className="icon-icon-icon_watching" />{' '}
											{elm.projectViews}
										</span>
									</div>
								</a>
							</div>
						);
					})}
				<MobileView>
					<img src={behanceLogo} className="behance-banner" alt="Behance" />
				</MobileView>
			</div>
		);
	};

	_behanceDarkTemplate = () => {
		return <Fragment>behance第二個模板</Fragment>;
	};

	render() {
		const { templateType } = this.props.config;
		const template = {
			dark: this._behanceDarkTemplate(),
			def: this._behanceDefTemplate(),
		};
		return template[templateType] || template['def'];
	}
}

export default {
	def: BehanceAch,
	dark: BehanceAch,
};
