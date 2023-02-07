import React from 'react';
import Star from '../star';
import { Popover } from 'antd';
import './style.scss';

const TalentRatingDescription = () => (
	<Popover
		placement="bottomLeft"
		content={
			<div className="talentRating-description--main">
				<div className="talentRating-description--title">評量分數代表</div>
				<div className="talentRating-description--content">
					<Star disabled={true} grade={5} />
					<div className="talentRating-description--item">
						其他人認為我是這個技能的專家，我已經開發了方法論或發表演講。
					</div>
				</div>
				<div className="talentRating-description--content">
					<Star disabled={true} grade={4} />
					<div className="talentRating-description--item">
						我可以分享這個技能的知識並監督和訓練他人。
					</div>
				</div>
				<div className="talentRating-description--content">
					<Star disabled={true} grade={3} />
					<div className="talentRating-description--item">
						我精通這項技能，我對自己做這件事感到自信。
					</div>
				</div>
				<div className="talentRating-description--content">
					<Star disabled={true} grade={2} />
					<div className="talentRating-description--item">
						我以前做過，但如果沒有幫助，我將無法做到。
					</div>
				</div>
				<div className="talentRating-description--content">
					<Star disabled={true} grade={1} />
					<div className="talentRating-description--item">
						我知道這個技能，但我從來沒有做過。
					</div>
				</div>
			</div>
		}
		trigger="hover"
	>
		<span className="talentRating-description">評分說明</span>
	</Popover>
);

export default TalentRatingDescription;
