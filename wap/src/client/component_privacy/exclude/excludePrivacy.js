import { connect } from 'react-redux';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import { viewAs, getUserInfo } from 'src/client/actions/profile';
import { exclude, getExcludeList} from 'src/client/actions/connection';
//TextField
import Validators from 'src/util/validator';
import { TextField, LightBox } from 'c_wap_module';
import ExcludeList from './excludeList';
import RemoveExcludeList from './removeExcludeList';

import clientConfig from 'src/configs/client';
import $ from "jquery";

var config = {
    'data': {
      // 'editor' : [ 'notEmpty', {maxLength: 6}]
      'editor' :[]
    }
}
let val = new Validators(config);

class ExcludePrivacy extends Component {
	constructor( props, context ){
		super( props, context );
		this.state                    = {};
		this.state.editor             = "";
		this.state.blockadeSetUp      = 'blockadeData';
		this.state.blockList          = 'blockListOpen';
		this.state.lightbox           = false;
		this.state.lightboxSet        = '';
		this.state.lightboxStatus     = '';
		this.state.lightboxTitle      = '';
		this.state.lightboxName       = '';
		this.state.lightboxPid        = '';
		this.state.lightboxConnection = '';
		this.state.closeIcon          = '';
		this.state.excludeItem          = {};
		this.state.errorMessage       = '';
	}
	componentDidMount() {
		let excludeList    = {};
		excludeList.pid    = this.props.user.pid;
		this.props.getExcludeList( excludeList );
	}

	onChange( key, value ) {
		this.state.editor = value;
		this.setState({
			editor: this.state.editor
		});
	}
	onBlur( key, value ) {
		this.state.editor = value;
		this.setState({
			editor: this.state.editor
		});
	}
	handleBlockadeSetUp( type ) {
    if (this.props.privacy.hasOwnProperty(this.props.privacy.pid) && this.props.privacy[this.props.privacy.pid].identity.code === 201) {
			this.props.handleStealthLockShow();
			return;
		}
		this.state.blockadeSetUp = type;
		this.setState( this.state );
    this.refs.excludeEditSection.scrollIntoView();
	}
	openMore( e, type ) {
		e.preventDefault();
		this.state.blockList = type;
		this.setState( this.state );
	}
	excludeSet(){
    let connectionStatus = $.get('/ajax/connection/getConnectionStatus?&targetPid='+this.state.editor, function(res){
      this.state.excludeItem.excludeStatus = res.response;
    }.bind(this)),
    nameCard = $.get('/ajax/profile/profileNameCard/getNameCard?pid='+this.props.user.pid+'&targetPid='+this.state.editor, function(res){
      this.state.excludeItem.nameCard = res.response;
    }.bind(this)),
    userInfo = $.get('/ajax/profile/profilePersonal/getUserInfo?pid='+this.props.user.pid+'&targetPid='+this.state.editor, function(res){
      this.state.excludeItem.userInfo = res.response;
    }.bind(this));
    $.when(connectionStatus, userInfo, nameCard).then(function() {
      this.setState({
        lightboxPid: this.state.editor,
        lightbox: true,
        closeIcon: false,
      });
      if (this.state.excludeItem.userInfo !== null) {
        if (!this.state.excludeItem.excludeStatus[this.state.editor]['excludeStatus']) {
          // ??????????????????
          this.setState({
            lightboxTitle: '???????????????' + this.state.excludeItem.nameCard.userName + '????????????????????????',
            lightboxSet: 'addBlock'
          })
        } else {
          // ??????????????????
          this.setState({
            lightboxTitle: null,
            lightboxSet: 'joinBlock'
          })
        }
      } else {
        //???????????????Pid
        this.setState({
          lightboxTitle: null,
          lightboxSet: 'notFound'
        })
      }
    }.bind(this));
	}
	handleLightBoxOpen( title, name, pid ) {
		switch( title ){
			case 'blockListInfo':
        if (!this.state.editor){
          this.setState({errorMessage: '??????????????????'});
          return;
        }
		    this.state.lightboxStatus = title;
		    this.setState({ lightboxStatus: this.state.lightboxStatus });
		    this.excludeSet();
				break;
			case 'removeblockList':
				this.state.lightboxPid    = pid;
				this.state.lightbox       = true;
				this.state.closeIcon      = true;
				this.state.lightboxStatus = title;
				this.state.lightboxName   = name;
				this.state.lightboxTitle  = '????????????' + name + '???????????????????????????';
				this.setState( this.state );
				break;
		}
		// this.state.lightbox = true;
		// this.setState( this.state );
	}
	handleLightBoxCancel() {
		this.state.lightbox = false;
		this.state.errorMessage = '';
		this.state.editor =null;
		this.setState( this.state );
	}
	render() {
		let lightboxOption = {
			closeIcon: this.state.closeIcon, // ??????close ICON
			contentHeight: '600px', // ??????content???????????????????????????????????????????????????scroll bar
			title: this.state.lightboxTitle
		};
		let that = this;
		return (
			<div styleName="editMain">
				<div styleName="editMain_title">
					<div styleName="editMain_left">
						<div styleName={ this.state.blockList === 'blockListOpen' ? '' : 'editMain_copywriter_max_height' }>
							<span styleName="title">????????????</span><br />
							??????????????????????????????????????????????????????????????????????????????<br/>?????????????????????????????????????????????????????????????????????????????????????????????
						</div>
						{
							this.state.blockList === 'haveMore' &&
							<a href="javascript:;" onClick={ ( event )=>this.openMore( event, 'blockListOpen' ) }>??????</a>
						}
					</div>
					{
						this.state.blockadeSetUp !== 'blockadeDataEdit' &&
						<a styleName="edit" onClick={ this.handleBlockadeSetUp.bind( this, 'blockadeDataEdit' ) }>??????</a>
					}
				</div>
        <div ref="excludeEditSection">
				{
					this.state.blockadeSetUp === 'blockadeDataEdit' &&
					<div styleName="editMain_table_div">
						<div styleName="blockade_top">
							<span styleName="title">????????????</span><br />
							<div styleName="inputAll">
								<div styleName="inputWidth">
									<TextField
										name="editor"
										validator={ val }
										allowMultiLine={ false }
										value={ this.state.editor }
										onBlur={ this.onBlur.bind(this) }
										onChange={ this.onChange.bind(this) }
										placeHolder="??????????????????????????????"
                    errorMessage={ this.state.errorMessage }
									/>
								</div>
								<button className="ui primary button" onClick={ ()=>that.handleLightBoxOpen('blockListInfo', `${this.state.lightboxName}`, `${this.state.editor}`) }>??????</button>
							</div>
							<div styleName="membership_number">?????????????????????https:&#47;/plus.104.com.tw/<span styleName="numbering">12345678</span></div>
						</div>
						<div styleName="blockade_bottom">
							<span styleName="title">??????????????????</span><br />
							<div styleName="blockade_content">
								<dl>
									{
										this.props.exclude_list &&
										this.props.exclude_list.map( function ( item, key ) {
											return (
												<dd key={key}>{item.name} <a href="javascript:;" onClick={ ()=>that.handleLightBoxOpen('removeblockList', `${item.name}`, `${item.targetPid}` ) }>??????</a>
												</dd>
											)
										})
									}
								</dl>
							</div>
						</div>
					</div>
				}
        </div>
				{
					this.state.lightbox && this.state.lightboxStatus === 'blockListInfo' &&
					<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.handleLightBoxCancel.bind(this) }>
						{
							this.state.lightboxSet === 'addBlock' &&
							<ExcludeList
                  pid={ this.state.excludeItem.nameCard.pid }
                  user={this.props.user}
									userName={ this.state.excludeItem.nameCard.userName }
									connect={ this.state.excludeItem.nameCard.connectionStatus }
									handleLightBoxCancel={ this.handleLightBoxCancel.bind(this) }
								/>
						}
						{
							this.state.lightboxSet === 'joinBlock' &&
							<div>
								<p>?????????????????????????????????????????????</p>
								<div styleName="blockListSubButton">
									<button className="ui normal button" onClick={ this.handleLightBoxCancel.bind(this) }>??????</button>
								</div>
							</div>
						}
						{
							this.state.lightboxSet === 'notFound' &&
							<div>
								<p>????????????????????? {this.state.lightboxPid}<br/>????????????????????????</p>
								<div styleName="blockListSubButton">
									<button className="ui normal button" onClick={ this.handleLightBoxCancel.bind(this) }>??????</button>
								</div>
							</div>
						}
					</LightBox>
				}
				{/*avatarWebUrl={}*/
					this.state.lightbox && this.state.lightboxStatus === 'removeblockList' &&
					<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.handleLightBoxCancel.bind(this) }>
						<RemoveExcludeList
							pid={ this.state.lightboxPid }
							user={this.props.user}
							userName={ this.state.lightboxName }
							handleLightBoxCancel={ this.handleLightBoxCancel.bind(this) }
						/>
					</LightBox>
				}
			</div>
		);
	}
}


function mapStateToProps ( state, props ) {
	return {
		user: state.user,
    privacy: state.privacy,
		exclude_list: state.connection.exclude_list,
	}
}

const actions = {
	viewAs, getUserInfo, exclude, getExcludeList
}

export default compose(
		connect(mapStateToProps, actions),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(ExcludePrivacy);
