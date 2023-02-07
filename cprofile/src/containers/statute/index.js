import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Lightbox from 'components/lightbox';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { SubmitButton, DisabledSubmitButton } from 'share/styledComponents';
import { Checkbox } from 'antd';
import './style.css';

const Statute = props => {
	const { handleStatuteRead, handleCancel, statuteRead } = props;
	const [statuteButton, setStatuteButton] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(lightboxOpen());
	}, []);

	const _handleSubmit = () => {
		handleStatuteRead();
		dispatch(lightboxClose());
	};

	const _handleCancel = () => {
		setStatuteButton(false);
		handleCancel();
	};

	const _handleChange = () => {
		setStatuteButton(!statuteButton);
	};

	return (
		<Fragment>
			{!statuteRead && (
				<Lightbox
					title="104個人檔案 服務條款"
					afterClose={_handleCancel}
					cssClassName="statuteLightbox"
				>
					<div className="statute-conditions">
						歡迎您成為104個人檔案 用戶，104個人檔案為「104
						資訊科技集團」提供之服務之一，當您選擇加入「104
						資訊科技集團」平台成為會員時，即視為您已閱讀、瞭解並同意接受「104
						資訊科技集團」平台會員規約之全部內容。 104個人檔案服務條款依
						<a
							href="https://accounts.104.com.tw/terms?lang=zh"
							target="_blank"
							rel="noopener noreferrer"
							title="104資訊科技集團」網站會員規約"
						>
							「104資訊科技集團」網站會員規約」
						</a>
						為補充條款。
						<br />
						<br />
						1. 服務內容
						<br />
						<br />
						1.1 個人檔案頁編輯器
						<br />
						<br />
						本產品係一全新服務方式，其主要提供會員可以建立展現自己專長跟特色的個人檔案頁。您可以依照您的需求與喜好編輯資料跟拖曳模版，例如學經歷、個人摘要等，一旦編輯完成發佈後，所有人都能看見您公開的資訊，或者您也可以直接下載列印您的個人檔案頁使用。
						<br />
						<br />
						個人檔案頁不包含您註冊會員時所提供的基本資料，如聯絡電話、Email，在您未同意之前，本產品不會將您的聯絡資訊提供給其他會員或企業。
						<br />
						<br />
						{/* 1.2 匯入104資料
						<br />
						<br />
						如果您有使用『104個人檔案』或『my104履歷』等產品，104個人檔案
						提供幫助您匯入這些產品資料的功能，以方便您快速填寫，匯入後的資料您可以自由的編輯，不會影響到您匯入來源產品的資料內容。
						<br />
						<br /> */}
						1.2 匯入GitHub 資料
						<br />
						<br />
						如果您有使用『GitHub』服務，您可以透過 GitHub Oauth API 將您在Github
						的資料匯進
						104個人檔案，匯入後的資料無法編輯，惟您可以選擇要不要呈現。
						<br />
						匯入過程中請確保您在GitHub
						的帳號為您本人使用，若有發現冒用的情形，本平台有權直接刪除您匯入的資料。
						<br />
						<br />
						1.3 匯入 Behance 資料
						<br />
						<br />
						如果您有使用『Behance』服務，您可以透過本平台提供的功能將您在Behance的資料匯進
						104個人檔案，匯入後的資料無法編輯，惟您可以選擇要不要呈現。
						<br />
						匯入過程中請確保您匯入的Behance帳號為您本人使用，若有發現冒用的情形，則本平台有權直接刪除您匯入的資料。
						<br />
						<br />
						1.4 探索檔案
						<br />
						<br />
						本產品提供搜尋、檢視他人檔案頁的功能，惟不得以瀏覽以外之方式取得、重置他人檔案頁，如有違反，本網站將依法追訴並請求相關之損害賠償責任，任何自本網站取得的資料皆必須遵守「104資訊科技集團」網站會員規約的相關規定。
						<br />
						<br />
						2. 選擇與義務
						<br />
						<br />
						2.1 使用守則
						<br />
						<br />
						A. 您在使用104個人檔案
						的任何功能時，需遵守「104資訊科技集團」網站會員規約之規範
						<br />
						B. 您所產生的任何內容如果違反規定時，依情節104個人檔案
						有權進行刪除、取消散佈、發佈及停權等處分。
						<br />
						<br />
						2.2 停用服務
						<br />
						<br />
						如果您確定不再使用104個人檔案，請與客服聯繫，協助您處理。
						<br />
						<br />
						在您停用服務或將資訊從您自己的個人檔案刪除之後，我們無法控制其他會員將您的資訊複製到104個人檔案以外的資料，或者第三方服務（例如搜尋引擎結果）更新快取之前，仍然可能會繼續顯示您的相關資訊。
						<br />
						<br />
						3. 智慧財產權
						<br />
						<br />
						本網站上所有內容，包含文字、圖形、影音、程式、畫面安排及資料編輯等，其著作權、專利權、商標及其他智慧財產權，均屬於本網站或授權本網站使用之正當權利人所有，任何人於未經本網站或正當權利人合法授權前，不得擅自以任何形式複製、改作、編輯、散布、公開傳播或其他非法使用，否則本網站將依法追訴並請求相關之損害賠償責任。
						<br />
						<br />
						任何您因使用本服務所提供之分享內容，一經您上載傳送至本網站時，即視為您已同意無償授權予本網站及104相關企業集團，不受任何條件限制進行散布、公開展示、公開播送、公開傳輸等相關行為，並得將分享內容收錄於資料庫中，或再授權其他人為前述利用之權利。
						<br />
						<br />
						4.隱私權保護政策
						<br />
						<br />
						本網站之隱私權保護政策準用104人力銀行隱私權保護政策辦理，本人明瞭該
						<a
							href="https://www.104.com.tw/info/104service/private.cfm"
							target="_blank"
							rel="noopener noreferrer"
							title="隱私權保護政策"
						>
							隱私權保護政策
						</a>
						亦構成本會員服務條款之一部份
						<br />
					</div>
					<div className="statute-line">
						<div className="statute-read-conditions">
							<Checkbox onChange={_handleChange}>已詳細閱讀條款</Checkbox>
						</div>
						<div>
							{statuteButton ? (
								<SubmitButton onClick={_handleSubmit}>接受</SubmitButton>
							) : (
								<DisabledSubmitButton disabled>接受</DisabledSubmitButton>
							)}
						</div>
					</div>
				</Lightbox>
			)}
		</Fragment>
	);
};

export default Statute;
