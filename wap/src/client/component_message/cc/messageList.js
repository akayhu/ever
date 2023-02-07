import React from 'react';
import MessageItem from './messageItem';
const MessageList = ({ data, pid }) => (
  <dl>
    {
      data.map(( item, key ) => {
      return (
          <MessageItem
            { ...item }
            key={ key }
            index={ key }
            pid={ pid }
          />
        );
      })
    }
  </dl>
)


export default MessageList;
