import { connect } from 'react-redux';
import React, {Component} from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import ChronicleEditFormExp from './editformExp';
import ChronicleEditFormEdu from './editformEdu';
import chronicleUtil from './chronicleUtil';
import { createFromPromotion } from 'src/client/actions/global';
import { loadChronicleHonor, updateChronicleExp, updateChronicleEdu, deleteChronicleExp, deleteChronicleEdu, updateEventPrivacySetting, removeTitleRelatedToExp } from 'src/client/actions/chronicle';
import { loadProfile } from 'src/client/actions/profile';
import compose from 'src/util/compose';


class ChronicleItem extends Component {
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
		}
	}
	componentWillMount() {
		this.state.view = chronicleUtil.viewDataProcessing(this.props.itemData);
	}
	componentDidMount() {
		if (this.props.itemData.type === 'exp') {
			this.setState({ seeMoreBtn: (this.refs.jobNoteDesc.clientHeight > this.refs.jobNote.clientHeight) });
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({view: chronicleUtil.viewDataProcessing(nextProps.itemData)});
	}
	changePrivacySetting(e) {
		if (this.props.itemData.privacySetting !== e) {
			this.state.data = chronicleUtil.mapping(this.props.itemData.type, this.props.itemData, this.props.user.pid);
			this.state.data.privacySetting = e;
			this.props.itemData.type === 'exp' ?
				this.props.updateChronicleExp(this.state.data)
				:
				this.props.updateChronicleEdu(this.state.data);
		}
	}
	jobNoteMore() {
		this.setState({ seeMoreBtn: false });
		this.refs.jobNote.classList.add(css.showAllJobNote);
	}
	editTrigger() {
		const promotiontype = this.props.itemData.type + this.props.index;
		this.props.createFromPromotion({promotion: promotiontype});
	}
	deleteTrigger() {
		switch (this.props.itemData.type) {
			case 'exp':
			case 'exp-temp': {
				const companyName = this.props.itemData.companyName;
				this.props.deleteChronicleExp({pid: this.props.user.pid, eventId: this.props.itemData.eventId, returnType: 2})
				.then(() => {
					this.props.removeTitleRelatedToExp(companyName);
					this.props.loadProfile({pid: this.props.user.pid});
					this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.params.pid});
					this.setState({lightbox: false});
				});
				break;
			}
			case 'edu':
			case 'edu-temp': {
				this.props.deleteChronicleEdu({pid: this.props.user.pid, eventId: this.props.itemData.eventId, returnType: 2})
				.then(() => {
					this.props.loadProfile({pid: this.props.user.pid});
					this.props.loadChronicleHonor({pid: this.props.user.pid, targetPid: this.props.params.pid});
					this.setState({lightbox: false});
				});
				break;
			}
		}
	}
	toggleOpen(key, open) {
		this.state.ui[key].targetStyle = open ? { color: 'rgb( 38, 151, 185 )' } : null;
		this.setState({ui: this.state.ui});
	}
	handleLightBoxOpen() {
		this.setState({ lightbox: true });
	}
	handleLightBoxCancel() {
		this.setState({	lightbox: false	});
	}
	render() {
		let chronicleEditForm;
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
		const tempData = (this.props.itemData.type === 'exp-temp' || this.props.itemData.type === 'edu-temp');
		switch (this.props.itemData.type) {
			case 'exp':
			case 'exp-temp': {
				chronicleEditForm = <ChronicleEditFormExp params={ this.props.params } itemData={ this.props.itemData } user={ this.props.user } editformClass="edit" />;
				break;
			}
			case 'edu':
			case 'edu-temp': {
				chronicleEditForm = <ChronicleEditFormEdu params={ this.props.params } itemData={ this.props.itemData } user={ this.props.user } editformClass="edit" />;
				break;
			}
		}
		const promotiontype = this.props.itemData.type + this.props.index;
		return (
			<div styleName="chronicleItem">
				{
				this.props.promotion === promotiontype &&
				<div>
					{chronicleEditForm}
				</div>
				||
				<div>
					<div styleName="itemTop">
						<div styleName="line" />
						{
							this.props.showCircle &&
							<div styleName="orange_circle" />
						}
						{
							this.props.showCircle &&
							<div styleName="endTime">
								<div styleName="dashLine" />
								<div styleName="endTimeText">
									{
										this.props.isFirst ? <span>Now</span> : <span>{this.props.itemData.startYear}</span>
									}
								</div>
							</div>
						}
					</div>
					<div styleName="itemContent">
						<div styleName="titleBlock">
							<div styleName="title" className="h5">
								{ this.props.itemData.schoolName }{ this.state.view.eduArea }
								{ this.props.itemData.jobTitle }
								{/* {
									this.props.viewas === 'self' &&
									<DropdownMenu toggleOpen={ this.toggleOpen.bind(this, 'edit') }>
										<DropdownTarget>
											<i styleName="itemEdit" className="edit icon" />
										</DropdownTarget>
										<DropdownList>
											<ul className="dropdown">
												<li onClick={ this.editTrigger.bind(this) }><i />編輯</li>
												<li onClick={ this.handleLightBoxOpen.bind(this) }><i />刪除</li>
											</ul>
										</DropdownList>
									</DropdownMenu>
								} */}
								{/*
									this.props.viewas === 'self' &&
									<DropdownMenu toggleOpen={ this.toggleOpen.bind( this, 'privacySetting' ) }>
										<DropdownTarget>
											<i styleName="itemSetting" className={ this.state.view.privacySettingIcon }></i>
										</DropdownTarget>
										<DropdownList>
										{
											!tempData&&
											<ul className='dropdown'>
												<li onClick={this.changePrivacySetting.bind(this, 1)}><i className="world icon"></i> 公開	</li>
												<li onClick={this.changePrivacySetting.bind(this, 0)}><i className="lock icon"></i> 只限本人 </li>
											</ul>
										}
										{
											tempData&&
											<ul className='dropdown'>
												<li style={{textAlign: 'center'}}>資訊填寫不完整<br />公開預設只限本人</li>
											</ul>
										}
										</DropdownList>
									</DropdownMenu>
								*/}
							</div>
							<div styleName="title" className="h5">{this.props.itemData.companyName}{this.state.view.expArea}</div>
						</div>
						<div styleName="descBlock">
							<div>{this.props.itemData.major}</div>
							<div styleName="viewAll">
								{!tempData &&
									this.state.view.startTime}
								{!tempData &&
									this.state.view.endTime}
								{this.state.view.desc}
							</div>
							{
								this.props.itemData.type === 'exp' &&
								<div ref="jobNote" styleName="jobNote">
									<div ref="jobNoteDesc" styleName="jobNoteDesc">
										{
											this.props.itemData.jobNote !== null &&
											this.props.itemData.jobNote.split("\n").map((item, index) => {
												return (<span key={ index }>{item}<br /></span>)
											})
										}
										{
											this.state.seeMoreBtn &&
											<div styleName="bottom_shadow"></div>
										}
									</div>
								</div>
							}
							{
								this.state.seeMoreBtn && this.props.itemData.type === 'exp' &&
								<div styleName="jobNoteMore">
									<a onClick={ this.jobNoteMore.bind(this) }>看詳細</a>
								</div>
							}
						</div>
						{
							tempData &&
							<div styleName="tempData_hint">資訊不完整，無法公開</div>
						}
					</div>
				</div>
			}
				<div styleName="itemBottom">
					<div styleName="line"></div>
				</div>
				{
					this.state.lightbox &&
					<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.handleLightBoxCancel.bind(this) }>
						<h3>{ (this.props.itemData.type === 'exp' || this.props.itemData.type === 'exp-temp') ? '確定要刪除這筆工作經歷？？' : '確定要刪除這筆學歷？'}</h3>
					</LightBox>
				}
			</div>
		);
	}
}

const action = {
	loadChronicleHonor,
	updateChronicleExp,
	updateChronicleEdu,
	deleteChronicleExp,
	deleteChronicleEdu,
	updateEventPrivacySetting,
	loadProfile,
	removeTitleRelatedToExp,
	createFromPromotion
};

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ChronicleItem);
