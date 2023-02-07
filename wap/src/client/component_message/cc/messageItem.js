import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Image from 'src/client/component_common/image';
import { NameCard } from 'src/client/component_common/card';
import css from './index.css';

const MessageItem = ({ sid, sname, pid, text, spicture, inputDate, isRead, error, attachmentList = [] }) => {
	const myOwnMsg = (sid == pid);
	const msgDirection = (sid != pid) ? 'left' : 'right';
	return (
		<dd>
			{ !myOwnMsg &&
				<NameCard
					hide
					targetPid={ sid }
					href={ `/profile/${sid}` }
					imgSrc={ spicture }
					name={ sname }
				/>
			}
			<div styleName={ sid != pid ? 'bccommunication_message_content_left' : 'bccommunication_message_content_right' }>
				<div styleName="message_content">{/* error ? 'Someting Error...sorry...' : */text}</div>
				{
					attachmentList.length > 0 &&
					<div styleName="message_down">
						{
							attachmentList.map((item, index) => {
								if (item.url) {
									return (<span key={ index }>
										<i className="attach icon" />
										<a href={ item.url[0] } target="_blank" rel="noopener noreferrer">附件</a>
									</span>);
								}
							})
						}
					</div>
				}
			</div>
			<div styleName={ sid != pid ? 'bccommunication_message_time_left' : 'bccommunication_message_time_right' }>
				{
					(myOwnMsg === true && isRead === 1) && <i className="checkmark icon" />
				}
				{inputDate}
			</div>
		</dd>
	);
};

export default CSSModules(MessageItem, css, { allowMultiple: true });
