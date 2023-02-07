import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// data
import { degreeData, joinSetUpRadioData, joinSetUpRadioPrivateData, privacyRadioData } from './data';
import clientConfig from 'src/configs/client';

// components
import { RadioGroup } from 'c_wap_module';

class Step2 extends Component {
	render() {
		const { applyGroupData, userName, emailInfo } = this.props;
		const joinData = applyGroupData.type === 7 ? joinSetUpRadioPrivateData : joinSetUpRadioData;

		return (
			<div>
				<div styleName="bg_img">
					<img src={ `${clientConfig.params.staticWapUrl}/images/group/step2.png` } />
				</div>
				<div styleName="step_main">
					<div styleName="management_audit">社團申請資料已送出，請靜候管理者審核。</div>
					<table>
						<tbody>
							<tr>
								<td>姓名：</td>
								<td>{ applyGroupData.userName || userName }</td>
							</tr>
							<tr>
								<td>聯絡E-mail：</td>
								<td>
									{emailInfo.map((item, index) => (
										<div key={ index }>
											{ item.email }
											{item.isVerified === 'true'
												? <span styleName="verified">已驗證</span>
												: <span styleName="notVerified">未驗證</span>
											}
										</div>
									))}
								</td>
							</tr>
							<tr>
								<td />
								<td style={ {paddingLeft: 0} }>
									<div styleName="radioGroup_style">
										<RadioGroup
											group={ [{ label: '本人已經詳細閱讀', value: true, checked: true }] }
											checkBox
											disabled
										/>
									</div>
									<a
										href={ `${clientConfig.params.staticWapUrl}/html/groupStatute/` }
										target="_blank"
										rel="noopener noreferrer"
									>
										社團規約
									</a>
									及
									<a
										href={ `${clientConfig.params.staticWapUrl}/html/groupOperation/` }
										target="_blank"
										rel="noopener noreferrer"
									>
										社團經營秘訣
									</a>
								</td>
							</tr>
							<tr>
								<td><span styleName="need">*</span> 社團名稱：</td>
								<td>{ applyGroupData.name }</td>
							</tr>
							<tr>
								<td><span styleName="need">*</span> 社團分類：</td>
								<td>{ degreeData[applyGroupData.category - 1].label }</td>
							</tr>
							<tr>
								<td>職務類別：</td>
								<td>{ applyGroupData.function }</td>
							</tr>
							<tr>
								<td><span styleName="need">*</span> 社團簡介：</td>
								<td>{ applyGroupData.description }</td>
							</tr>
							<tr>
								<td>社團標籤：</td>
								<td>{ applyGroupData.tags }</td>
							</tr>
							<tr>
								<td><span styleName="need">*</span> 社團隱私設定：</td>
								<td>
									{ applyGroupData.type === 8 ? '公開社團' : '私人社團'}
								</td>
							</tr>
							<tr>
								<td><span styleName="need">*</span> 新成員加入設定：</td>
								<td>
									<RadioGroup
										group={
											joinData.map((item, index) => item.value === applyGroupData.joinSetting ? {...item, checked: true} : item)
										}
										name="radio"
										disabled
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default compose(
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Step2);
