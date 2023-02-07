import _client from 'src/configs/client.js';
import moment from 'moment-timezone';
import DOMPurify from 'dompurify';

// interface
const GTMDataLayer = {
	// 僅接受傳入單一物件
	sendToDataLayer(type, item) {
		if (!window || !window.dataLayer) return;

		const dataLayer = window.dataLayer;
		const appendData = convertFormat(type, item);
		if (!appendData) return;

		// dataLayer雖然是Array，但push的方法在GTM初始化時被覆寫了，只能透過dataLayer.push()傳遞資料
		// 若未來要改成傳入 {activity: [...]}，改這邊
		dataLayer.push(appendData);
	}
};

const convertFormat = (type, data) => {
	switch (type) {
		case 'Activity':
			return activity(data);
		default:
			return false;
	}
};

/**
 * Represents a book.
 * @param {object} activity ActivityWrapModel（完整文章物件）
 *
 * 參閱 https://s3-ap-northeast-1.amazonaws.com/104plus/opengine/apidoc/index.html#api-Activity-getActivity
 */
const activity = (activity) => {
	/*
		只傳送以下四種文章：
		1. 一般發文：公開 (privacySetting = 0)
		2. 展示櫥窗：公開 (privacySetting = 0)
		3. 媒體頻道：一律公開 (privacySetting = 0、channelInfo.type = 10)
		4. 社團：公開社團（一律公開） (privacySetting = 0、channelInfo.type = 8)
	*/
	// 僅接受 activity 為 object
	if (!activity || !Object.keys(activity).length) return false;
	if (activity.privacySetting !== 0) return false;

	if (activity.channelId && activity.channelInfo) {
		switch (activity.channelInfo.type) {
			case 8: break;
			case 10: break;
			default: return false;
		}
	}

	/*
		擷取文章中的圖片預覽
	    	包含：上傳圖片、影片、文件預覽圖、直接貼含有圖片的文章連結
			不包含：直接貼圖片連結、youtube影片預覽

		content-type (參考 src/client/component_activities/activity/activityUnit)
			0: YOUTUBE,
			1: TEXT,
			2: IMAGE,
			3: VIDEO,
			4: DOCUMENT,
			5: AUDIO,
			6: HYPERLINK & LINK,
	*/
	const imageUrls = activity.extraInfo.attachmentList
		.map((attachment) => {
			if (!location || !attachment.activityFileUrl) return false;

			switch (attachment.contentType) {
				case 2:
				case 3:
				case 4:
				case 6:
					return `${location.protocol}${attachment.activityFileUrl}`;
				default:
					return false;
			}
		})
		.filter(url => url);

	// JSON-LD可接受null、""，但undefined、''會錯、false會被當作字串處理
	const item = {
		articleUrl: `${location.protocol}${_client.params.staticWapUrl}/activity/${activity.aid}`,
		headline: activity.title || null,
		image: imageUrls,
		// publisher 由GTM那邊做，方便未來換圖
		// 會自動偵測當前時區，createDate為1970/1/1 UTC至今的累積秒數，時區為格林威治，需再做時區轉換
		datePublished: moment(activity.createDate).tz(moment.tz.guess()).format(),
		author: {
			name: activity.userInfo.userName,
		},
		description: DOMPurify.sanitize(activity.content, {ALLOWED_TAGS: []}) || null
	};
	return item;
};


export default GTMDataLayer;
