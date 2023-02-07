import React from 'react';
import DefaultCover from 'components/defaultImage/coverDefault.png';
import DefaultAvatar from 'components/defaultSmallImage/avatarDef.png';
import { Image } from 'share/styledComponents';
import './style.scss';

const SearchNewBlock = (...args) => {
	const renderSearchNewBlock = () => {
		const itemData = { ...args[0].data };
		return (
			<div className="searchNewBlock-main">
				<a
					href={`/profile/${itemData.pid}`}
					target="_blank"
					title={`${itemData.userName}`}
					rel="noopener noreferrer"
				>
					<div className="searchNewBlock-main--bg">
						<Image
							src={
								(itemData.coverFileUrls && itemData.coverFileUrls.w600) ||
								DefaultCover
							}
							onError={e => {
								e.target.src = DefaultCover;
							}}
							alt="cover"
						/>
						<div className="searchAvatar">
							<Image
								src={
									(itemData.avatarFileUrls &&
										(itemData.avatarFileUrls.avatarWeb ||
											itemData.avatarFileUrls.w600)) ||
									DefaultAvatar
								}
								onError={e => {
									e.target.src = DefaultAvatar;
								}}
								alt="Avatar"
							/>
						</div>
					</div>
					<div className="searchNewBlock-main--content">
						<div className="username">{itemData.userName || '使用者名稱'}</div>
						<div className="jobTitle">{itemData.title || '職稱'}</div>
						<hr className="top" />
						<p
							className="summary"
							dangerouslySetInnerHTML={{ __html: itemData.introduction }}
						/>
					</div>
				</a>
			</div>
		);
	};

	if (!{ ...args[0].data }) return null;
	return renderSearchNewBlock();
};

export default SearchNewBlock;
