import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { createFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

// 新增區塊
class Create extends React.Component {
	constructor() {
		super();
	}
	create(promotion) {
		this.props.createFromPromotion({ promotion });
	}
	render() {

		if( !this.props.profile || !this.props.profile.hasOwnProperty('pid')) return null;

		const { completeStatus } = this.props.profile;
		return (
			<div>
				<ul styleName="create_ul_main">
					{
						itemMsg.map((obj, index) => {
							if (completeStatus.hasOwnProperty(obj.name) && (completeStatus[obj.name] === null || completeStatus[obj.name] === 0)) {
								return (
									<CreateItem
										textMsg={ obj.textMsg }
										gtmValue={ obj.gtmValue }
										key={ index }
										action={ this.create.bind(this, obj.name) }
										componentstyle={ `${obj.name}_circle icon` }
									/>
								);
							}
						})
					}
				</ul>
				<div styleName="create_bottom_hr" />
			</div>
		);
	}
}

const Item = ({action, componentstyle, gtmValue, textMsg}) =>
	<li onClick={ action }>
		<i className={ componentstyle } data-gtm-profile={ gtmValue } />
		<div styleName="create_line_height">
			<div styleName="create_text" data-gtm-profile={ gtmValue }>{ textMsg }</div>
		</div>
	</li>;

const CreateItem = CSSModules(Item, css, { allowMultiple: true });

const itemMsg = [
	// { name: 'experience', textMsg: '完整經歷讓你脫穎而出', gtmValue: '區塊新增-經歷' },
	// { name: 'education', textMsg: '完整學歷讓你更容易增加人氣', gtmValue: '區塊新增-學歷' },
	// { name: 'honor', textMsg: '職涯成就讓你更容易獲得青睞', gtmValue: '區塊新增-職涯成就' },
	// { name: 'gallery', textMsg: '上傳作品展現你的專業能力', gtmValue: '區塊新增-展示櫥窗' },
	// { name: 'endorse', textMsg: '讓你的專業與特質被他人肯定', gtmValue: '區塊新增-肯定' }
];

export default compose(
	connect(null, { createFromPromotion }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Create);
