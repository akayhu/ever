import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import clientConfig from 'src/configs/client';
import {components as CPlatformComponents} from 'c_platform';
import $ from "jquery";

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Welcome extends Component {
	constructor( props, context ){
		super( props, context );
	}
	componentDidMount() {
		// require('jquery');
		// require('jquery-ui');
		// require('src/client/component_common/ui/transition.js');
		// require('src/client/component_common/ui/dimmer.js');
		require('src/util/jquery.mb.YTPlayer.js');

    var $bgplayer = $('.'+css.player);

    $bgplayer.YTPlayer();
    
    $bgplayer.on('YTPStart', function(e) {
         $(this).removeClass(css.temp_image);
         $(this).css('background-color', '#CBCCCE');
    });
    
    $bgplayer.on('YTPEnd', function(e) {
      
    });
    
    setTimeout(function () {
      $bgplayer.YTPPlay();
    }, 2500)

    var d1 = $('.'+css.d1).offset().top;
    
	  $("."+css.lazy).hide();
    
    $(window).scroll(function() {
      var that = this;
      
      if (d1 <= ($(that).scrollTop()+550)) {
        $('.'+css.d1).show(1000);
        
        setTimeout(function () {
          $('.'+css.d2).show(1000);
        }, 1000);
        
        setTimeout(function () {
          $('.'+css.d3).show(1000);
        }, 2000);
        
        setTimeout(function () {
          $('.'+css.d4).show(1000);
        }, 3000);
      }
    });
    // $('body').dimmer('hide');
	}
	render() {
    return (
  		<div>
        <div styleName="header_bar">
          <div styleName="header_box">
            <div styleName="logo">
              <a
                 href="/"
                 target="_self" />
            </div>
            <div styleName="login">
              <a
                 styleName="login_txt"
                 href={"/sso/saml-login?r="+this.props.history.prevUrl}>??????</a>
            </div>
          </div>
        </div>
        <div styleName="main_wrapper">
          <div styleName="screen_1">
            <div styleName="player temp_image video_wrapper"
                 data-property="{videoURL:'//youtu.be/NkZX4xz_vko',containment:'self',mute:true,autoPlay:true,loop:true,opacity:.8,showControls:false,stopMovieOnBlur:false}">
              <div style={ { display: 'table', width: '100%', height: '100%', margin: '0 auto' } }>
                <div style={ { height: 300, paddingTop: 20, display: 'table-cell', margin: '0 auto', verticalAlign: 'middle' } }>
                  <div styleName="chance">
                    ????????????????????????????????????????
                  </div>
                  <div styleName="reason">
                    <div styleName="reason_title">
                      ??????????????????104???????????????????????????
                    </div>
                    <div styleName="reason_1">
                      ???????????????????????????<span styleName="highlight">??????</span>
                    </div>
                    <div styleName="reason_2">
                      ???????????????????????????<span styleName="highlight">??????</span>
                    </div>
                    <div styleName="reason_3">
                      ???????????????????????????<span styleName="highlight">??????</span>
                    </div>
                    <a
                       id="btn-login"
                       styleName="login_txt join_now"
                       onClick=""
                       href={"/sso/saml-login?r=/me"}>???????????????????????????</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div styleName="screen_2">
            <div styleName="bg_2">
              <div styleName="promote">
                <img
                     alt
                     src={clientConfig.params.staticWapUrl+"/images/welcome/icon_social.png"} />
                <div styleName="promote_title">
                  ???????????????????????????<span styleName="highlight">??????</span>
                </div>
                <p>
                  ??????????????????????????????????????????
                  <br /> ??????????????????????????????
                </p>
              </div>
              <div styleName="promote">
                <img
                     alt
                     src={clientConfig.params.staticWapUrl+"/images/welcome/icon_contacts.png"} />
                <div styleName="promote_title">
                  ???????????????????????????<span styleName="highlight">??????</span>
                </div>
                <p>
                  ????????????????????????????????????????????????
                  <br /> ?????????????????????!
                </p>
              </div>
              <div styleName="promote">
                <img
                     alt
                     src={clientConfig.params.staticWapUrl+"/images/welcome/icon_record.png"} />
                <div styleName="promote_title">
                  ?????????????????????<span styleName="highlight">??????</span>
                </div>
                <p>
                  ?????????????????????????????????
                  <br />???????????????????????????
                  <br />????????????????????????????????????
                </p>
              </div>
              <a
                 id="btn-login"
                 styleName="login_txt join_now"
                 href={"/sso/saml-login?r=/me"}>????????????104????????????</a>
            </div>
          </div>
          <div styleName="screen_3">
            <div styleName="title">
              104??????????????????x104????????????
            </div>
            <div styleName="title_2">
              ?????????????????????<span styleName="highlight">???</span>???
            </div>
            <div styleName="detail">
              <img
                   styleName="d1 lazy"
                   src={clientConfig.params.staticWapUrl+"/images/welcome/plus_01.png"}
                   width={ 326 }
                   height={ 370 } />
              <img
                   styleName="d2 lazy"
                   src={clientConfig.params.staticWapUrl+"/images/welcome/plus_02.png"}
                   width={ 311 }
                   height={ 365 } />
              <img
                   styleName="d3 lazy"
                   src={clientConfig.params.staticWapUrl+"/images/welcome/plus_03.png"}
                   width={ 394 }
                   height={ 257 } />
              <img
                   styleName="d4 lazy"
                   src={clientConfig.params.staticWapUrl+"/images/welcome/plus_04.png"}
                   width={ 367 }
                   height={ 231 } />
              <img
                   styleName="d5 "
                   src={clientConfig.params.staticWapUrl+"/images/welcome/ill_computer.png"} />
            </div>
            <a
               id="btn-login-2"
               styleName="login_txt join_now"
               href={"/sso/saml-login?r="+this.props.history.prevUrl}>????????????104????????????</a>
          </div>
          <div styleName="copyright">
            ???????????????????????????????????????
          </div>
        </div>
      </div>
		);
	}
}

function mapStateToProps(state) {
  return {
    history: state.history,
  };
}

export default compose(
    connect(mapStateToProps),
    //translate([]),
    [CSSModules, '_', css, { allowMultiple: true }]
  )(Welcome);
