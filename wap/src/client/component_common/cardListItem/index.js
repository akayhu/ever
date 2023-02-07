import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import css from './index.css';
import compose from 'src/util/compose';
import Image from 'src/client/component_common/image';
import Tags from './tags';
import { NameCard } from 'src/client/component_common/card';
import clientConfig from 'src/configs/client';

const CardListItem = ({
	id,
	domain,
	cover,
	title,
	description,
	statCount,
	avatarList,
	children,
	subCategory,
	tagList
}) => {
	if (domain !== 'channel' && domain !== 'group') {
		return null;
	}
	return (
		<div styleName="item_box">
			<div styleName="item_cover">
				<Link to={ `/${domain}/${id}` }>
					<Image
						src={ cover }
						alt={ title }
						type="cover"
						domain={ domain }
					/>
				</Link>
			</div>
			<div styleName="item_main">
				<div styleName="title">
					<Link styleName="title_link" to={ `/${domain}/${id}` }>
						{ title }
					</Link>
					{
						subCategory
						? <a href={ idToCategoryLink(subCategory, domain) } styleName="title_category">{ idToCategoryChinese(subCategory) }</a>
						: null
					}
				</div>
				<div styleName="description_block">
					<div styleName="description_text">{ description }</div>
				</div>
				<div styleName="tags">
					{ tagList && tagList.length > 0 && <Tags tagList={ tagList.slice(0, 3) } /> }
				</div>
				<div styleName="item_bot">
					<div styleName="avatar_list">
						{
							avatarList && avatarList.slice(0, 3).map(data => (
								<NameCard
									targetPid={ data.pid }
									key={ data.pid }
									href={ `/profile/${data.pid}` }
									imgSrc={ data.avatarWebUrl }
									name={ data.userName }
								/>
							))
						}
					</div>
					<div styleName="stat_info">
						{
							domain === 'channel' &&
							<div>等 { statCount } 人已加入此頻道</div>
						}
						{
							domain === 'group' &&
							<div styleName="group_stat_info">
								<div>{ statCount.activityCount } 篇文章 </div>
								<div>{ statCount.memberCount } 位成員 </div>
							</div>
						}
					</div>
					{ children }
				</div>
			</div>
		</div>
	);
};

function idToCategoryChinese(id) {
	switch (id) {
		case 1: return '知識技術';
		case 2: return '品味生活';
		case 3: return '健康休閒';
		case 4: return '藝術設計';
		default:
			throw Error(`no such categary ID, ${id}`);
	}
}

function idToCategoryLink(id, domain) {
	const url = `${clientConfig.params.wapUrl}/${domain}`;
	if (['channel', 'group'].indexOf(domain) === -1) {
		throw Error(`no such domain , ${domain}`);
	}
	switch (id) {
		case 1: return `${url}?category=knowAndTech`;
		case 2: return `${url}?category=lifestyle`;
		case 3: return `${url}?category=healthAndLeisure`;
		case 4: return `${url}?category=artAndDesign`;
		default:
			throw Error(`no such categary ID, ${id}`);
	}
}

CardListItem.defaultProps = {
	subCategory: 0,
	cover: '',
	tagList: [],
	avatarList: []
};

CardListItem.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	domain: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	statCount: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
	children: PropTypes.element.isRequired,
	cover: PropTypes.string,
	subCategory: PropTypes.number,
	avatarList: PropTypes.array,
	tagList: PropTypes.array
};

export default compose(
	[CSSModules, '_', css, { allowMultiple: true }]
)(CardListItem);
