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
                 href={"/sso/saml-login?r="+this.props.history.prevUrl}>登入</a>
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
                    當機會來臨時，你準備好了嗎?
                  </div>
                  <div styleName="reason">
                    <div styleName="reason_title">
                      你該立即啟用104職涯社群的三大理由
                    </div>
                    <div styleName="reason_1">
                      發現多元適性的潛在<span styleName="highlight">機會</span>
                    </div>
                    <div styleName="reason_2">
                      輕鬆建立完整的職涯<span styleName="highlight">紀錄</span>
                    </div>
                    <div styleName="reason_3">
                      快速累積同業／跨業<span styleName="highlight">人脈</span>
                    </div>
                    <a
                       id="btn-login"
                       styleName="login_txt join_now"
                       onClick=""
                       href={"/sso/saml-login?r=/me"}>事不宜遲，立即加入</a>
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
                  發現多元適性的潛在<span styleName="highlight">機會</span>
                </div>
                <p>
                  加入知識技術、品味生活等社團
                  <br /> 與各類職人交流情報。
                </p>
              </div>
              <div styleName="promote">
                <img
                     alt
                     src={clientConfig.params.staticWapUrl+"/images/welcome/icon_contacts.png"} />
                <div styleName="promote_title">
                  快速累積同業／跨業<span styleName="highlight">人脈</span>
                </div>
                <p>
                  各行業職人在這等你交流，解惑獻策
                  <br /> 成為你的智囊團!
                </p>
              </div>
              <div styleName="promote">
                <img
                     alt
                     src={clientConfig.params.staticWapUrl+"/images/welcome/icon_record.png"} />
                <div styleName="promote_title">
                  建立完整的職涯<span styleName="highlight">紀錄</span>
                </div>
                <p>
                  用職涯成就、職涯路徑、
                  <br />展示櫥窗、文章分享
                  <br />完整呈現你的職涯發展歷程
                </p>
              </div>
              <a
                 id="btn-login"
                 styleName="login_txt join_now"
                 href={"/sso/saml-login?r=/me"}>立即加入104職涯社群</a>
            </div>
          </div>
          <div styleName="screen_3">
            <div styleName="title">
              104人力銀行履歷x104職涯社群
            </div>
            <div styleName="title_2">
              搭配使用職涯更<span styleName="highlight">加</span>分
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
               href={"/sso/saml-login?r="+this.props.history.prevUrl}>立即加入104職涯社群</a>
          </div>
          <div styleName="copyright">
            一零四資訊科技股份有限公司
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
