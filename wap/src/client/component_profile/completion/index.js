import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Cropper from 'src/client/component_common/avatar/crop';
import { LightBox } from 'c_wap_module';
import { createFromPromotion } from 'src/client/actions/global';
import { uploadAvatar } from 'src/client/component_common/avatar/upload';
import { updateAvatarImage, loadProfile } from 'src/client/actions/profile';
import compose from 'src/util/compose';
// 完成度
class Completion extends React.Component {
	constructor() {
		super();
		this.state = {
			showCropper: false,
			fileError: '',
			ori_file: {}
		};
		this.uploadImageaction = this.uploadImage.bind(this);
	}
	create(name) {
		switch (name) {
			case 'experience':
				this.props.createFromPromotion({ promotion: 'experience' });
				break;
			case 'education':
				this.props.createFromPromotion({ promotion: 'education' });
				break;
			case 'endorse':
				this.props.createFromPromotion({ promotion: 'endorse' });
				break;
			case 'gallery':
				this.props.createFromPromotion({ promotion: 'gallery' });
				break;
			case 'introduction':
				this.props.createFromPromotion({ promotion: 'introduction' });
				break;
			case 'honor':
				this.props.createFromPromotion({ promotion: 'honor' });
				break;
			case 'activity': {
				const url = `/profile/${this.props.params.pid}/activity?create=true`;
				this.props.router.push(url);
				break;
			}
			default:
				console.log(`oops!${name}has something wrong.`);
		}
	}
	uploadImage() {
		const file = document.getElementById('avatarfile').files[0];
		const fileType = /^image\//;

		if (!file || !fileType.test(file.type)) {
			this.setState({	fileError: '請選擇檔案格式為 jpg，gif，png，jpeg，bmp 的圖片' });
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			const tempImg = new Image();
			tempImg.src = e.target.result;
			tempImg.onload = () => {
				if (tempImg.width < 150 || tempImg.height < 150) {
					this.setState({	fileError: '請選擇長寬至少150*150的圖片' });
					return;
				}
				this.setState({	ori_file: file,	showCropper: true	});
			};
		};
	}
	submitAvatar(params) {
		uploadAvatar('avatarfile', params).then((msg) => {
			this.props.updateAvatarImage({
				pid: this.props.user.pid,
				fileId: msg.fileId,
				ltx: params.ltx,
				lty: params.lty,
				rbx: params.rbx,
				rby: params.rby
			},
				/*
					第二個參數為coverIsDefault，用此來判斷是否原本就存在大頭貼
					若是true值則個人檔案完成度需增加
					若是false則個人檔案完成度不做變更
					（新增大頭貼及調整大頭貼是走同一套流程，所以用此判斷）
				
					此位置為個人檔案完成度，當出現「為自己挑張滿意的照片 新增」時
					代表使用者是沒有大頭貼，所以coverIsDefault設為true
				*/
				true
			);
			this.closeLightBox();
		});
	}
	closeLightBox() {
		document.getElementById('avatarfile').value = '';
		this.setState({showCropper: false, fileError: ''});
		document.body.style.cursor = 'default';
	}
	
	render() {

		const rate = this.props.hasOwnProperty('profile') ? this.props.profile.completeRate : 100;
		const completionpercentage = this.props.hasOwnProperty('profile') ? { width: `${this.props.profile.completeRate}%` } : { width: 0 };
		const	complete = this.props.profile.completeStatus || {};
		const hintMsgContent = hintMsg(rate);
		let completeItemList = [];
		hintTextMsg.map((obj, index) => {
			if (complete.hasOwnProperty(obj.name) &&
				(complete[obj.name] === null || complete[obj.name] === 0) &&
				completeItemList.length < 3) {
				if (obj.name === 'avatar') {
					completeItemList.push(<CompletionItemForm text={ obj.msg } key={ index } action={ this.uploadImageaction } />);
				} else {
					completeItemList.push(<CompletionItem text={ obj.msg } key={ index } action={ this.create.bind(this, obj.name) } />);
				}
			}
		});
		return (
			<div styleName="completionAll">
				{
					(rate > 0 && rate < 100) &&
					<div styleName="completion_main">
						<div styleName="completion_main_title">
							<span styleName="completion_main_title_left">個人檔案完成度</span>
							<span styleName="completion_main_title_right">{rate}%</span>
						</div>
						<div styleName="completion_percentage">
							<div styleName="completion_percentage_main">
								<div styleName="completion_percentage_bar" style={ completionpercentage } />
							</div>
						</div>
						<div styleName="intermediate_copywriter">{hintMsgContent}</div>
						<ul>
							{completeItemList}
						</ul>
					</div>
				}
				{/* {
					this.state.showCropper &&
					<LightBox option={ { title: '調整個人圖片', closeIcon: true } } onClose={ this.closeLightBox.bind(this) }>
						<Cropper
							aspect
							file={ this.state.ori_file }
							baseWidth={ 534 }
							baseHeight={ 300 }
							minCropWidth={ 150 }
							minCropHeight={ 150 }
							completeCrop={ this.submitAvatar.bind(this) }
							cancelCrop={ this.closeLightBox.bind(this) }
						/>
					</LightBox>
				} */}
				{
					this.state.fileError !== '' &&
					<LightBox option={ { closeIcon: true } } onClose={ this.closeLightBox.bind(this) }>
						{ this.state.fileError }
					</LightBox>
				}
			</div>
		);
	}
}

const hintTextMsg = [
		// { name: 'experience', msg: '填寫最近一筆經歷'},
		// { name: 'education', msg: '填寫最近一筆學歷'},
		// { name: 'endorse', msg: '新增一筆專長特質'},
		// { name: 'gallery', msg: '上傳一個展示櫥窗作品'},
		// { name: 'introduction', msg: '簡單介紹你自己'},
		// { name: 'honor', msg: '分享職涯或求學上的成就'},
		// { name: 'avatar', msg: '為自己挑張滿意的照片'},
		// { name: 'activity', msg: '試試看發表一篇文章'}
];

const CompletionItemUnit = ({text, action}) =>
	<li className="body_text">
		<span styleName="name_link">{text}</span>
		<button className="ui normal button" onClick={ action }>新增</button>
	</li>;
const CompletionItem = CSSModules(CompletionItemUnit, css, { allowMultiple: true });

const CompletionItemFormUnit = ({ text, action }) =>
	<li className="body_text">
		<span styleName="name_link">{text}</span>
		<button className="ui normal button" styleName="inputformbtn">
			新增<input
				id="avatarfile"
				type="file"
				name="avatarfile"
				accept="image/*"
				styleName="inputform"
				onChange={ action }
			/>
		</button>
	</li>;
const CompletionItemForm = CSSModules(CompletionItemFormUnit, css);

function hintMsg(rate) {
	const completeRate = (typeof (rate) === 'number') ? rate : parseInt(rate, 10);
	if (completeRate < 40) {
		return `你的個人檔案完成度不是很高…只有${completeRate}%，需要加點油了！`;
	} else if (completeRate >= 40 && completeRate < 60) {
		return `你的個人檔案完成度差強人意，只有${completeRate}%，需要再努力一點點！`;
	} else if (completeRate >= 60 && completeRate < 80) {
		return `你的個人檔案完成度尚可，已經達到${completeRate}%，再加把勁兒，目標100%！`;
	} else if (completeRate >= 80 && completeRate < 100) {
		return `你的個人檔案完成度很高，已經來到${completeRate}%，達到100%對你來說不是問題！`;
	}
	return '';
}

export default compose(
	connect(null, { createFromPromotion, updateAvatarImage, loadProfile }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Completion);
