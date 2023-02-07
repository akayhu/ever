import React from 'react';
import MessageItem from './messageItem';
const MessageList = ({ data, logo }) =>
  <dl>
    { data.map(( item, key ) =>
        <MessageItem
          { ...item }
          logo={ logo }
          key={ key }
        />
      )
    }
  </dl>

export default MessageList;
