import React from 'react';
import { Card } from 'antd';
import QRCode from 'qrcode.react';
import DefaultBg from 'components/defaultSmallImage/coverDefault.png';
import avatarDef from 'components/defaultSmallImage/avatarDef.png';
import generalConfig from 'config/general';
import { Image } from 'share/styledComponents';
import './style.scss';

const BusinessCard = props => {
	const { data, pid } = props;
	const dataAnalysis = data.toJS();
	return (
		<Card style={{ width: 300 }}>
			<div className="business-card-main">
				<Image
					src={
						(dataAnalysis.coverFileUrls &&
							(dataAnalysis.coverFileUrls.w1920 ||
								dataAnalysis.coverFileUrls.w960 ||
								dataAnalysis.coverFileUrls.w600)) ||
						DefaultBg
					}
					alt={dataAnalysis.userName}
					width="300"
					height="168"
				/>
				<div className="business-card-avatar">
					<Image
						src={
							dataAnalysis.avatarFileUrls && dataAnalysis.avatarFileUrls.w600
								? dataAnalysis.avatarFileUrls.w600
								: avatarDef
						}
						alt={dataAnalysis.userName}
						width={98}
						height={98}
					/>
				</div>
			</div>
			<div className="business-card-content">
				<div className="business-card-user-name">{dataAnalysis.userName}</div>
				<div className="business-card-user-jobTitle">{dataAnalysis.title}</div>
				<span className="business-card-user-dash" />
				<div className="business-card-user-companyName">
					{dataAnalysis.organization}
				</div>
				<div className="business-card-user-location">
					{dataAnalysis.location}
				</div>
				<div className="business-card-user-QRCode">
					<QRCode value={`https:${generalConfig.siteUrl}/profile/${pid}`} />
				</div>
			</div>
		</Card>
	);
};

export default BusinessCard;
