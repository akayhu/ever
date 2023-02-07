import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { updateUsernameDisplay } from 'src/client/actions/profile';
import Tooltip from 'src/client/component_common/tooltip';
import clientConfig from 'src/configs/client';
import { LightBox } from 'c_wap_module';
import compose from 'src/util/compose';

class UserInfo extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			name: this.props.profile.userName,
			nameEdit: false,
			errorMsg: false,
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.profile && nextProps.profile.userName !== this.state.name) {
			this.setState({
				name: nextProps.profile.userName
			});
		}
	}
	editName() {
		this.setState({ nameEdit: true });
	}
	handleClose() {
		this.setState({
			nameEdit: false,
			name: this.props.profile.userName
		});
	}
	changeNameValue(e) {
		this.setState({name: e.target.value});
	}
	handleSubmit() {
		if (this.state.name.length === 0 || this.state.name.trim() === '') {
			this.setState({ errorMsg: true });
			return false;
		}
		this.props.updateUsernameDisplay({ userName: this.state.name }).then(() => {
			this.setState({ nameEdit: false });
		});
	}
	handleErrorClose() {
		this.setState({ errorMsg: false });
	}
	getTitle() {
		const { companyName, jobTitle, schoolName, major} = this.props.profile;
		if (companyName && jobTitle !== null) {
			return (`${jobTitle} 　 ${companyName}`);
		} else if (schoolName && major !== null) {
			return (`${major} 　 ${schoolName}`);
		}
		return ('');
	}
	render() {
		const lightboxOption = {
			closeIcon: true,
			title: '錯誤訊息'
		};
		return (
			<div styleName="user_infos">
				{
					this.state.nameEdit === false &&
					<div>
						<div>
							<h1 styleName="name">{ this.state.name }</h1>
							{/* {
								this.props.viewas === 'self' &&
								<div styleName="edit_icon" onClick={ this.editName.bind(this) }>
									<i className="edit icon" />
								</div>
							} */}
						</div>
						{/*
						
						因應隱私需求變更，居住地不顯示
						
						{
							this.props.profile.locationPrivacy === 1
							? <div className="" styleName="location">{ this.props.profile.location }</div>
							: ''
						}*/}
						<div className="" styleName="title">
							{ this.getTitle() }
						</div>
					</div>
				}
				{
					this.state.nameEdit &&
					<div>
						<input
							maxLength="50"
							autoFocus
							styleName="name_edit_input"
							defaultValue={ this.state.name }
							onChange={ this.changeNameValue.bind(this) }
						/>
						{/*
						
						因應隱私需求更改，居住地不顯示
						
						{
							this.props.profile.location !== null
							?
								<div>
									<div styleName="location">
										{ this.props.profile.location }
										<label>
											&nbsp;(居住地修改請至
												<a href={ clientConfig.params.accountsUrl + '/hello?p=' + this.props.user.aesPid } target="_blank" rel="noopener noreferrer">帳號設定</a>
												<Tooltip
													icon = "help circle icon"
													content="帳號設定的居住地完成後，<br/>需重新整理此頁面居住地才會更新。"
												/>)
										</label>
									</div>
									<div className="" styleName="title">
										{ this.getTitle() }
									</div>
								</div>
							:
								<div styleName="location">
									居住地請至 <a href={ clientConfig.params.accountsUrl + '/hello?p=' + this.props.user.aesPid } target="_blank" rel="noopener noreferrer">帳號設定</a> 新增
									<Tooltip
										icon="help circle icon"
										content="帳號設定的居住地完成後，需重新整理此頁面居住地才會更新。"
									/>
								</div>
						}*/}
						<div styleName="button">
							<button styleName="save" onClick={ this.handleSubmit.bind(this) } className="ui primary button">儲存</button>
							<button onClick={ this.handleClose.bind(this) } className="ui normal button">取消</button>
						</div>
					</div>
				}
				{
					this.state.errorMsg &&
					<LightBox option={ lightboxOption } onClose={ this.handleErrorClose.bind(this) }>
						<h2>顯示名稱不能為空值</h2>
					</LightBox>
				}
			</div>
		);
	}
}

export default compose(
	connect(null, { updateUsernameDisplay }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(UserInfo);
