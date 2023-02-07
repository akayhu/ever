/**
 * 先不要看這隻，這是預定重構項目
 * 目前沒有引入也沒有作用
 * 進入這隻檔案請右轉回去
 */

import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const MessageBlock = ({
    chatRoomData,
    chatData,
    blockMsg,
    memberInfo,
    loading
}) => {
    return(
        <div>
            <div styleName="bccommunication_title_main">
                <Gear
                    { ...chatRoomData }
                    handleClearData={ this.clearData }
                    blockMsg={ blockMsg }
                />
                <div styleName="bccommunication_right_job_title">
                    {memberInfo.length === 1 && memberInfo.join(',')}&nbsp;&nbsp;
                    {memberInfo.length > 1 && `你、${memberInfo.join(',')}`}&nbsp;&nbsp;
                    {memberInfo.length > 1 && `共${memberInfo.length + 1}人`}
                </div>
                {memberInfo.length > 1 &&
                    <div
                        styleName="bccommunication_right_people_title"
                        onClick={ this.openLightBox }
                    >
                        {`${memberInfo.length + 1}個成員`}
                    </div>
                }
            </div>
            <LazyLoading reverseMode loadingAct={ this.loadMore }>
                <div ref={ _ref => (this.content_main = _ref) } styleName="bccommunication_message bccommunication_message_cc" >
                    {
                        chatData && chatData.length > 0 &&
                        <div styleName="bccommunication_invite"> 對話開始於 { chatData[0].inputDate } </div>
                    }
                    { loading &&
                        <div style={ {width: '100%', height: '25px', marginBottom: '15px'} }>
                            <div className="ui loading" />
                        </div>
                    }
                    <MessageList
                        data={ chatData } // .slice(Math.max(msgDetailData.length - this.actionParameters.count, 0)) }
                        pid={ user.pid }
                    />
                </div>
            </LazyLoading>
            <ReplyPanel
                user={ this.props.user }
                handleSendMsg={ this.sendMsg }
                disableAction={ disableAction || blockMsg }
            />
        </div>
    );
}

export default CSSModules(MessageBlock, css, { allowMultiple: true });