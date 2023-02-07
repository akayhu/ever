import React, { Component } from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import More from 'src/client/component_topic/more';
import Headline from '../title/headline';

class Devlop extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      devlopData: [
        {
          title:'產品企劃開發人員',
          titleList: [
            '經營管理'
          ]
        },
        {
          title:'遊戲企劃人員',
          titleList: [
            '經營管理',
            '資訊科技',
            '影視傳媒',
            '產品管理'
          ]
        },
        {
          title:'產品管理師',
          titleList: [
            '經營管理',
            '客戶服務',
            '專案管理',
            '工程開發'
          ]
        }
      ]
    };
  }
  render() {
    return (
      <div>
        <Headline headline="產品管理的未來發展" />
        <div styleName="devlopMain">
          <div styleName="devlopList">
          {
            this.state.devlopData.map((item,index1) =>
              <dl key={index1}>
                <dt>
                  { item.title }
                </dt>
                {
                  item.titleList.map((obj,index2) =>
                    <dd key={index2}>
                      <a href="javascript: void(0);">{obj}</a>
                    </dd>
                  )
                }
              </dl>
            )
          }
          </div>
          <div styleName="source">
            資料來源：<a href="javascript: void(0);">職務大百科</a>
          </div>
        </div>
      </div>
    )
  }
}


const DevlopCss = CSSModules(Devlop,css,{allowMultiple: true})
const DevlopTranslate = translate([])(DevlopCss);

export default DevlopTranslate;
