import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const RejectView = () =>
  <div styleName="bccommunication_reply reject_view">
    你已婉拒該職務的邀約，無法再透過站內訊息回復
  </div>

export default CSSModules( RejectView, css, { allowMultiple: true } )
