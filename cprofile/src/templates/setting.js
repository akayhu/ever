/**
 * 模板預覽圖
 */
// 基本資料
import userDef from './images/user_def.png';
import userDefPreview from './images/user_def_preview.png';
import mobileUserDef from './images/mobileUserDef.png';
import userNew from './images/user_new.png';
import userNewPreview from './images/user_new_preview.png';
import mobileUserNew from './images/mobileUserNew.png';
import userCom from './images/user_com.png';
import userComPreview from './images/user_com_preview.png';
import mobileUserCom from './images/mobileUserCom.png';
import userDark from './images/user_dark.png';
import userDarkPreview from './images/user_dark_preview.png';
import mobileUserDark from './images/mobileUserDark.png';
// 經歷
import expDef from './images/exp_def.png';
import expDefPreview from './images/exp_def_preview.png';
import mobileExpDef from './images/mobileExpDef.png';
import expList from './images/exp_list.png';
import expListPreview from './images/exp_list_preview.png';
import mobileExpList from './images/mobileExpList.png';
import expDark from './images/exp_dark.jpg';
import expDarkPreview from './images/exp_dark_preview.jpg';
import mobileExpDark from './images/mobileExpDark.png';
import expNew from './images/exp_new.jpg';
import expNewPreview from './images/exp_new_preview.jpg';
import mobileExpNew from './images/mobileExpNew.png';
// 專案成就
import honorDef from './images/honor_def.png';
import honorDefPreview from './images/honor_def_preview.png';
import mobileHonorDef from './images/mobileHonorDef.png';
import honorCard from './images/honor_card.png';
import honorCardPreview from './images/honor_card_preview.png';
import mobileHonorCard from './images/mobileHonorCard.png';
import honorDou from './images/honor_dou.png';
import honorDouPreview from './images/honor_dou_preview.png';
import mobileHonorDou from './images/mobileHonorDou.png';
import honorDark from './images/honor_dark.png';
import honorDarkPreview from './images/honor_dark_preview.png';
import mobileHonorDark from './images/mobileHonorDark.png';
import honorText from './images/honor_text.png';
import honorTextPreview from './images/honor_text_preview.png';
import mobileHonorText from './images/mobileHonorText.png';
// 技能專長
import talentDef from './images/talent_def.png';
import talentDefPreview from './images/talent_def_preview.png';
import mobileTalentDef from './images/mobileTalentDef.png';
import talentDark from './images/talent_dark.png';
import talentDarkPreview from './images/talent_dark_preview.png';
import mobileTalentDark from './images/mobileTalentDark.png';
// github
import githubDef from './images/github_def.png';
import githubDefPreview from './images/github_def_preview.png';
import mobileGithubDef from './images/mobileGithubDef.png';
import githubDark from './images/github_dark.png';
import githubDarkPreview from './images/github_dark_preview.png';
import mobileGithubDark from './images/mobileGithubDark.png';
// behance
import behanceDef from './images/behance_def.png';
import behanceDefPreview from './images/behance_def_preview.png';
import mobileBehanceDef from './images/mobileBehanceDef.png';
// Plus 文章
import plusActivityThreeColumn from './images/plus_activity_three_column.jpg';
import plusActivityThreeColumnPreview from './images/plus_activity_three_column_preview.jpg';
import mobilePlusActivityThreeColumn from './images/mobilePlusActivityThreeColumn.png';
import plusActivityImageLeft from './images/plus_activity_image_left.jpg';
import plusActivityImageLeftPreview from './images/plus_activity_image_left_preview.jpg';
import mobilePlusActivityImageLeft from './images/mobilePlusActivityImageLeft.png';
import plusActivityImageRight from './images/plus_activity_image_right.jpg';
import plusActivityImageRightPreview from './images/plus_activity_image_right_preview.jpg';
import mobilePlusActivityImageRight from './images/mobilePlusActivityImageRight.png';
// 作品集
import galleryDef from './images/gallery_def.png';
import galleryDefPreview from './images/gallery_def_preview.png';
import mobileGalleryDef from './images/mobileGalleryDef.png';
import galleryNew from './images/gallery_new.png';
import galleryNewPreview from './images/gallery_new_preview.png';
import mobileGalleryNew from './images/mobileGalleryNew.png';
import galleryDark from './images/gallery_dark.png';
import galleryDarkPreview from './images/gallery_dark_preview.png';
import mobileGalleryDark from './images/mobileGalleryDark.png';
// 學歷
import eduDef from './images/edu_def.png';
import eduDefPreview from './images/edu_def_preview.png';
import mobileEduDef from './images/mobileEduDef.png';
import eduRaw from './images/edu_raw.png';
import eduRawPreview from './images/edu_raw_preview.png';
import mobileEduRaw from './images/mobileEduRaw.png';
import eduDark from './images/edu_dark.png';
import eduDarkPreview from './images/edu_dark_preview.png';
import mobileEduDark from './images/mobileEduDark.png';
import eduNew from './images/edu_new.png';
import eduNewPreview from './images/edu_new_preview.png';
import mobileEduNew from './images/mobileEduNew.png';
// 客製化區塊
import customDef from './images/custom_def.png';
import customDefPreview from './images/custom_def_preview.png';
import mobileCustomDef from './images/mobileCustomDef.png';
import customNew from './images/custom_new.png';
import customNewPreview from './images/custom_new_preview.png';
import mobileCustomNew from './images/mobileCustomNew.png';
import customNewContrary from './images/custom_new_contrary.png';
import customNewContraryPreview from './images/custom_new_contrary_preview.png';
import mobileCustomNewContrary from './images/mobileCustomNewContrary.png';
import customDark from './images/custom_dark.png';
import customDarkPreview from './images/custom_dark_preview.png';
import mobileCustomDark from './images/mobileCustomDark.png';
import customPai from './images/custom_pai.png';
import customPaikPreview from './images/custom_pai_preview.png';
import mobileCustomPai from './images/mobileCustomPai.png';

/**
 * 模板設定
 *
 * 每個區塊至少有 def 模板，這是和後端約定好匯入資料時預設採用的模板
 */
const templates = {
	basic: {
		// 基本資料
		def: {
			blockType: 'basic',
			templateType: 'def',
			thumb: userDef,
			preview: userDefPreview,
			mobileThumb: mobileUserDef,
			sampleCount: 1,
		},
		new: {
			blockType: 'basic',
			templateType: 'new',
			thumb: userNew,
			preview: userNewPreview,
			mobileThumb: mobileUserNew,
			sampleCount: 1,
		},
		com: {
			blockType: 'basic',
			templateType: 'com',
			thumb: userCom,
			preview: userComPreview,
			mobileThumb: mobileUserCom,
			sampleCount: 1,
		},
		dark: {
			blockType: 'basic',
			templateType: 'dark',
			thumb: userDark,
			preview: userDarkPreview,
			mobileThumb: mobileUserDark,
			sampleCount: 1,
		},
	},
	experience: {
		// 經歷
		dark: {
			blockType: 'experience',
			templateType: 'dark',
			thumb: expDark,
			preview: expDarkPreview,
			mobileThumb: mobileExpDark,
			sampleCount: 3,
		},
		def: {
			blockType: 'experience',
			templateType: 'def',
			thumb: expDef,
			preview: expDefPreview,
			mobileThumb: mobileExpDef,
			sampleCount: 3,
		},
		new: {
			blockType: 'experience',
			templateType: 'new',
			thumb: expNew,
			preview: expNewPreview,
			mobileThumb: mobileExpNew,
			sampleCount: 3,
		},
		list: {
			blockType: 'experience',
			templateType: 'list',
			thumb: expList,
			preview: expListPreview,
			mobileThumb: mobileExpList,
			sampleCount: 3,
		},
	},
	honor: {
		// 專案成就
		def: {
			blockType: 'honor',
			templateType: 'def',
			thumb: honorDef,
			preview: honorDefPreview,
			mobileThumb: mobileHonorDef,
			sampleCount: 3,
		},
		card: {
			blockType: 'honor',
			templateType: 'card',
			thumb: honorCard,
			preview: honorCardPreview,
			mobileThumb: mobileHonorCard,
			sampleCount: 3,
		},
		dou: {
			blockType: 'honor',
			templateType: 'dou',
			thumb: honorDou,
			preview: honorDouPreview,
			mobileThumb: mobileHonorDou,
			sampleCount: 2,
		},
		dark: {
			blockType: 'honor',
			templateType: 'dark',
			thumb: honorDark,
			preview: honorDarkPreview,
			mobileThumb: mobileHonorDark,
			sampleCount: 2,
		},
		text: {
			blockType: 'honor',
			templateType: 'text',
			thumb: honorText,
			preview: honorTextPreview,
			mobileThumb: mobileHonorText,
			sampleCount: 1,
		},
	},
	talent: {
		// 技能專長
		def: {
			blockType: 'talent',
			templateType: 'def',
			thumb: talentDef,
			preview: talentDefPreview,
			mobileThumb: mobileTalentDef,
			sampleCount: 3,
		},
		dark: {
			blockType: 'talent',
			templateType: 'dark',
			thumb: talentDark,
			preview: talentDarkPreview,
			mobileThumb: mobileTalentDark,
			sampleCount: 3,
		},
	},
	github: {
		// github
		def: {
			blockType: 'github',
			templateType: 'def',
			thumb: githubDef,
			preview: githubDefPreview,
			mobileThumb: mobileGithubDef,
			sampleCount: 1,
		},
		dark: {
			blockType: 'github',
			templateType: 'dark',
			thumb: githubDark,
			preview: githubDarkPreview,
			mobileThumb: mobileGithubDark,
			sampleCount: 1,
		},
	},
	behance: {
		// behance
		def: {
			blockType: 'behance',
			templateType: 'def',
			thumb: behanceDef,
			preview: behanceDefPreview,
			mobileThumb: mobileBehanceDef,
			sampleCount: 1,
		},
	},
	plus_activity: {
		// 職涯社群文章
		def: {
			blockType: 'plus_activity',
			templateType: 'def',
			thumb: plusActivityThreeColumn,
			preview: plusActivityThreeColumnPreview,
			mobileThumb: mobilePlusActivityThreeColumn,
			sampleCount: 3,
		},
		imageLeft: {
			blockType: 'plus_activity',
			templateType: 'imageLeft',
			thumb: plusActivityImageLeft,
			preview: plusActivityImageLeftPreview,
			mobileThumb: mobilePlusActivityImageLeft,
			sampleCount: 2,
		},
		imageRight: {
			blockType: 'plus_activity',
			templateType: 'imageRight',
			thumb: plusActivityImageRight,
			preview: plusActivityImageRightPreview,
			mobileThumb: mobilePlusActivityImageRight,
			sampleCount: 2,
		},
	},
	gallery: {
		// 作品集
		def: {
			blockType: 'gallery',
			templateType: 'def',
			thumb: galleryDef,
			preview: galleryDefPreview,
			mobileThumb: mobileGalleryDef,
			sampleCount: 3,
		},
		new: {
			blockType: 'gallery',
			templateType: 'new',
			thumb: galleryNew,
			preview: galleryNewPreview,
			mobileThumb: mobileGalleryNew,
			sampleCount: 2,
		},
		dark: {
			blockType: 'gallery',
			templateType: 'dark',
			thumb: galleryDark,
			preview: galleryDarkPreview,
			mobileThumb: mobileGalleryDark,
			sampleCount: 2,
		},
	},
	education: {
		// 學歷
		def: {
			blockType: 'education',
			templateType: 'def',
			thumb: eduDef,
			preview: eduDefPreview,
			mobileThumb: mobileEduDef,
			sampleCount: 3,
		},
		raw: {
			blockType: 'education',
			templateType: 'raw',
			thumb: eduRaw,
			preview: eduRawPreview,
			mobileThumb: mobileEduRaw,
			sampleCount: 1,
		},
		dark: {
			blockType: 'education',
			templateType: 'dark',
			thumb: eduDark,
			preview: eduDarkPreview,
			mobileThumb: mobileEduDark,
			sampleCount: 1,
		},
		new: {
			blockType: 'education',
			templateType: 'new',
			thumb: eduNew,
			preview: eduNewPreview,
			mobileThumb: mobileEduNew,
			sampleCount: 1,
		},
	},
	custom: {
		// 客製化區塊
		def: {
			blockType: 'custom',
			templateType: 'def',
			thumb: customDef,
			preview: customDefPreview,
			mobileThumb: mobileCustomDef,
			sampleCount: 1,
		},
		new: {
			blockType: 'custom',
			templateType: 'new',
			thumb: customNew,
			preview: customNewPreview,
			mobileThumb: mobileCustomNew,
			sampleCount: 1,
		},
		newContrary: {
			blockType: 'custom',
			templateType: 'newContrary',
			thumb: customNewContrary,
			preview: customNewContraryPreview,
			mobileThumb: mobileCustomNewContrary,
			sampleCount: 1,
		},
		dark: {
			blockType: 'custom',
			templateType: 'dark',
			thumb: customDark,
			preview: customDarkPreview,
			mobileThumb: mobileCustomDark,
			sampleCount: 1,
		},
		pai: {
			blockType: 'custom',
			templateType: 'pai',
			thumb: customPai,
			preview: customPaikPreview,
			mobileThumb: mobileCustomPai,
			sampleCount: 1,
		},
	},
};

export default templates;
