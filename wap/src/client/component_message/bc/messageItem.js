import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Image from 'src/client/component_common/image';
import clientConfig from "src/configs/client";
import css from './index.css';

const MessageItem = ({ msgId, custNo, source, content, attachmentId, attachmentList, inputDate, logo }) => {
  return(
    <dd>
      { 
        source === 0 &&
          <img
            src={ logo || `${clientConfig.params.staticWapUrl}/images/avatar/avatar_hr_150.png` }
            onError={(e) => e.target.src = `${clientConfig.params.staticWapUrl}/images/avatar/avatar_hr_150.png` }
          />
      }
      <div styleName={ source === 0 ? 'bccommunication_message_content_left' : 'bccommunication_message_content_right' }>
        <div styleName="message_content" dangerouslySetInnerHTML={{ __html: content }}></div>
        { 
          (attachmentId && attachmentId !== null) &&
          <div styleName="message_down">
            {
              attachmentList.map((item, index) =>
              <span key={index}>
                <i className="attach icon"></i>
                <a href={ getUrl(index, custNo, msgId) } target="_blank">{ item }</a>
              </span>
            )}
          </div>
        }
      </div>
      <div styleName={ source === 0 ? 'bccommunication_message_time_left' : 'bccommunication_message_time_right' }>
        { inputDate }
      </div>
    </dd>
  )
}

function getUrl(index, custNo, msgId) {
  return `//${clientConfig.params.wapUrl}/ajax/bcCommunication/getAttachFile?attachNum=${index + 1}&custNo=${custNo}&msgId=${msgId}`;
}

export default CSSModules( MessageItem, css, { allowMultiple: true } )
