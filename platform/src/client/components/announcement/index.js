import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import { LightBox } from 'c_wap_module';
import css from './index.css';

// announcement_data 資料位置：//static.104.com.tw/plus/js/announcementContent.js

class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnnouncementLightBox: false,
      lightboxContent: '',
      announcement_data: ''
    };
  }
  componentDidMount() {
    if (window.announcement_data) {
      this.setState({
        announcement_data: window.announcement_data
      });
    }
  }
  showAnnouncement(content) {
    this.setState({
      showAnnouncementLightBox: true,
      lightboxContent: content
    });
  }
  hideAnnouncement() {
    this.setState({
      showAnnouncementLightBox: false,
      lightboxContent: ''
    });
  }
  render() {
    let announceLightboxOption = {
			onClose: this.hideAnnouncement,
			closeIcon: true
    };
    const { announcement_data } = this.state;
		return (
      <div>
        {
          this.props.user.isLogin &&
          <div styleName="announcement">
            <div id="announcement" styleName="announcement_main">
              {
                announcement_data &&
                announcement_data.map(item => (
                  <div key={ item.id } styleName="announcement_div">
                  <span dangerouslySetInnerHTML={{ __html: item.title }}></span>
                  {
                    item.openLightbox && item.content &&
                    <a href="#" onClick={ () => this.showAnnouncement(item.content) }>{ item.openLightboxTitle }</a>
                  }
                  </div>
                ))
              }
            </div>
          </div>
        }
        {
          this.state.showAnnouncementLightBox &&
          <LightBox
            option={ announceLightboxOption }
            onClose={ () => this.hideAnnouncement() }>
            <div styleName="lightboxContentStyle" dangerouslySetInnerHTML={ { __html: this.state.lightboxContent } }></div>
          </LightBox>
        }
      </div>
		);
	}
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

const AnnouncementCss = CSSModules(Announcement, css, { allowMultiple: true })
//const AnnouncementTranslate = translate( [] )( AnnouncementCss );
export default connect(mapStateToProps, null)(AnnouncementCss);
