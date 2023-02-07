import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { has } from 'lodash/object';

// components
import { DropList } from 'c_wap_module';
import PrivacyItem from './privacyItem';
import PrivacyItemLightbox from './privacyItemLightbox';
import SwtichButton from 'src/client/component_common/switchButton';

class PrivacyForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openEdit: false
		};
	}
	handleEditOpen(value, event) {
		event.preventDefault();
		this.setState({
			openEdit: value
		});
	}
	handleDropListPrivacy(index, { value }) {
		// 因為dropList會直接return value回來
		const { arrayIndex, handleTogglePrivacy } = this.props;
		handleTogglePrivacy(value, arrayIndex, index, 'droplist');
	}
	actionType(data, index) {
		// 依照config的type去選擇要顯示的項元件
		const { arrayIndex, handleTogglePrivacy, useLightbox } = this.props;
		const dropListContent = [
			{ label: '只限本人', value: 0, iconFont: 'lock icon'},
			{ label: '公開', value: 1, iconFont: 'world icon'},
			{ label: '朋友', value: 2, iconFont: 'friends icon'},
		];

		if (data.type === 'switch') {
			return (
				<SwtichButton
					name={ `personal${arrayIndex}${index}${useLightbox}` }
					checked={ data.status === 1 ? 'checked' : '' }
					defaultChecked={ data.status === 1 ? 'checked' : '' }
					onChange={ handleTogglePrivacy.bind(this, data.status, arrayIndex, index, 'switch') }
				/>
			);
		} else if (data.type === 'droplist') {
			return (
				<DropList
					listContent={ dropListContent }
					onSelected={ this.handleDropListPrivacy.bind(this, index) }
					defaultIndex={ data.status + 1 }
					className={ css.dropList }
					disabled={ false }
					width="128px"
				/>
			);
		}
		return null;
	}
	render() {
		const { useLightbox, nav, navList, makeUpdatePrivacyData, loading } = this.props;
		const { openEdit } = this.state;
		return (
			<div>
				{
					!useLightbox &&
					<div styleName="privacy_form">
						<div styleName="privacy_form_head">
							<PrivacyItem
								title={ nav.title }
								desc={ nav.desc }
							>
								{
									!openEdit
									?
										<button
											styleName="edit"
											onClick={ event => this.handleEditOpen(true, event) }
										>
										編輯
									</button>
									:
									null
								}
							</PrivacyItem>
						</div>
						{	openEdit &&
							<form styleName="privacy_form_container">
								{
									navList.map((data, index) => (
										<div
											key={ index }
											styleName="privacy_data"
										>
											<PrivacyItem
												title={ data.title }
												desc={ data.desc }
											>
												{ this.actionType(data, index) }
											</PrivacyItem>
										</div>
									))
								}
								<div styleName="footer">
									<button
										className={ `ui primary button ${loading ? 'loading' : ''}` }
										onClick={ event => makeUpdatePrivacyData(event) }
									>
										儲存變更
									</button>
									<button
										className="ui normal button"
										onClick={ event => this.handleEditOpen(false, event) }
									>
										取消
									</button>
								</div>
							</form>
						}
					</div>
				}
				{
					useLightbox &&
					<div>
						{
							nav.show &&
							<div styleName="form_title_lb">
								<h4>{ nav.title }</h4>
							</div>
						}
						<div>
							{
								navList.map((data, index) => {
									if (!data.show) return null;
									return (
										<PrivacyItemLightbox
											key={ index }
											title={ data.title }
										>
											{ this.actionType(data, index) }
										</PrivacyItemLightbox>
									);
								})
							}
						</div>
					</div>
				}
			</div>
		);
	}
}

PrivacyForm.propTypes = {
	useLightbox: PropTypes.bool,
	arrayIndex: PropTypes.number,
	nav: PropTypes.object,
	navList: PropTypes.array,
	makeUpdatePrivacyData: PropTypes.func,
	handleTogglePrivacy: PropTypes.func,
	loading: PropTypes.bool
};


export default compose(
	[CSSModules, '_', css, { allowMultiple: true }]
)(PrivacyForm);
