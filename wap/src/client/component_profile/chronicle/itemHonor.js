import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import ChronicleEditFormHonor from './editformHonor';
import chronicleUtil from './chronicleUtil';
import { updateChronicleHonor, deleteChronicleHonor, updateEventPrivacySetting } from 'src/client/actions/chronicle';
import { loadProfile } from 'src/client/actions/profile';
import { createFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

class ChronicleItemHonor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lightbox: false,
			data: {},
			view: {},
			ui: {
				edit: {
					targetStyle: null
				},
				privacySetting: {
					index: 1,
					targetStyle: null
				}
			},
			seeMoreBtn: false
		};
	}
	componentWillMount(){
		this.state.view = chronicleUtil.viewDataProcessing(this.props.itemData, this.props.viewas);
	}
	componentDidMount() {
		this.state.seeMoreBtn = (this.refs.jobNoteDesc.clientHeight > this.refs.jobNote.clientHeight);
		this.setState({seeMoreBtn: this.state.seeMoreBtn});
	}
	changePrivacySetting(e){
		if (this.props.itemData.privacySetting !== e) {
			this.state.data = chronicleUtil.mapping(this.props.itemData.type, this.props.itemData, this.props.user.pid);
			this.state.data.privacySetting = e;
			this.props.updateChronicleHonor(this.state.data);
		}
	}
	editTrigger() {
		const promotiontype = this.props.itemData.type + this.props.index;
		this.props.createFromPromotion({promotion: promotiontype});
	}
	deleteTrigger() {
		this.props.deleteChronicleHonor({pid: this.props.user.pid, eventId: this.props.itemData.eventId, returnType: 2})
		.then(() => {
			this.props.loadProfile({pid: this.props.user.pid});
			this.setState({lightbox: false});
		});
	}
	handleLightBoxOpen() {
		this.setState({ lightbox: true });
	}
	handleLightBoxCancel() {
		this.setState({	lightbox: false	});
	}
	toggleOpen(key, open) {
		this.state.ui[key].targetStyle = open ? { color: 'rgb( 38, 151, 185 )' } : null;
		this.setState({
			ui: this.state.ui
		})
	}
	jobNoteMore() {
		this.setState({ seeMoreBtn: false });
		this.refs.jobNote.classList.add(css.showAllJobNote);
	}
	render() {
		const lightboxOption = {
			closeIcon: true,  // 有無close ICON,
			submit: {
				text: '確定',
				action: this.deleteTrigger.bind(this)
			},
			cancel: {
				text: '取消'
			}
		};
		const promotiontype = this.props.itemData.type + this.props.index;
		return (
			<div>
				{
				this.props.promotion === promotiontype &&
				<div>
					<ChronicleEditFormHonor
						params={ this.props.params }
						itemData={ this.props.itemData }
						editformClass="edit"
						chronicle={ this.props.chronicle }
						user={ this.props.user }
					/>
				</div>
				||
				<div>
					<div styleName="itemContentHonor">
						<div styleName="tag">{this.props.itemData.tagList[0]}</div>
						<div styleName="titleBlock">
							<div styleName="title" className="h1">
								{this.props.itemData.title}
								{/* {
									this.props.viewas === 'self' &&
									<DropdownMenu toggleOpen={ this.toggleOpen.bind(this, 'edit') }>
										<DropdownTarget>
											<i className="edit icon"/>
										</DropdownTarget>
										<div className="dropdownList">
											<DropdownList>
												<ul className="dropdown">
													<li onClick={ this.editTrigger.bind(this) }><i/>編輯</li>
													<li onClick={ this.handleLightBoxOpen.bind(this) }><i/>刪除</li>
												</ul>
											</DropdownList>
										</div>
									</DropdownMenu>
								} */}
								{/*
									this.props.viewas === 'self' &&
									<DropdownMenu toggleOpen={ this.toggleOpen.bind( this, 'privacySetting' ) }>
										<DropdownTarget>
											<i className={ this.state.view.privacySettingIcon }></i>
										</DropdownTarget>
										<div className="dropdownList">
											<DropdownList>
												<ul className='dropdown'>
													<li onClick={this.changePrivacySetting.bind(this, 1)}><i className="world icon"></i> 公開	</li>
													<li onClick={this.changePrivacySetting.bind(this, 0)}><i className="lock icon"></i> 只限本人 </li>
												</ul>
											</DropdownList>
										</div>
									</DropdownMenu>
								*/}
							</div>
						</div>
						<div styleName="descBlock">
							<div styleName="relation">
								{ this.state.view.relationDesc }
							</div>
							<div styleName="viewAll">{this.state.view.startTime}{this.state.view.endTime}</div>
							<div ref="jobNote" styleName="jobNote">
								<div ref="jobNoteDesc" styleName="jobNoteDesc">
									{this.props.itemData.description}
								</div>
							</div>
						</div>
						{
							this.state.seeMoreBtn &&
							<div ref="jobNoteMore" styleName="jobNoteMore">
								<a onClick={ this.jobNoteMore.bind(this) }>看更多</a>
							</div>
						}
					</div>
					{
						this.state.lightbox &&
						<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.handleLightBoxCancel.bind(this) }>
							<h3>確定刪除此筆資料</h3>
						</LightBox>
					}
				</div>
			}

			</div>
		);
	}
}

ChronicleItemHonor.propTypes = {
	viewas: PropTypes.string,
};

ChronicleItemHonor.defaultProps = {
	viewas: 'other'
};

const action = { updateChronicleHonor, deleteChronicleHonor, updateEventPrivacySetting, loadProfile, createFromPromotion };

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ChronicleItemHonor);
