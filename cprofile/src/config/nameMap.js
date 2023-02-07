import {
	requestUpdateProfileBasic,
	RECIEVE_UPDATE_PROFILE_BASIC,
	FAILURE_UPDATE_PROFILE_BASIC,
} from 'actions/blocks/basic';
import {
	requestCreateHonor,
	requestUpdateHonor,
	requestDeleteHonor,
	RECIEVE_CREATE_HONOR,
	FAILURE_CREATE_HONOR,
	RECIEVE_UPDATE_HONOR,
	FAILURE_UPDATE_HONOR,
	RECIEVE_DELETE_HONOR,
	FAILURE_DELETE_HONOR,
} from 'actions/blocks/honor';
import {
	requestCreateTalent,
	requestUpdateTalent,
	requestDeleteTalent,
	RECIEVE_CREATE_TALENT,
	FAILURE_CREATE_TALENT,
	RECIEVE_UPDATE_TALENT,
	FAILURE_UPDATE_TALENT,
	RECIEVE_DELETE_TALENT,
	FAILURE_DELETE_TALENT,
} from 'actions/blocks/talent';
import {
	requestCreateGallery,
	requestUpdateGallery,
	requestDeleteGallery,
	RECIEVE_CREATE_GALLERY,
	FAILURE_CREATE_GALLERY,
	RECIEVE_UPDATE_GALLERY,
	FAILURE_UPDATE_GALLERY,
	RECIEVE_DELETE_GALLERY,
	FAILURE_DELETE_GALLERY,
} from 'actions/blocks/gallery';
import {
	requestCreateExperience,
	requestUpdateExperience,
	requestDeleteExperience,
	RECIEVE_CREATE_EXPERIENCE,
	FAILURE_CREATE_EXPERIENCE,
	RECIEVE_UPDATE_EXPERIENCE,
	FAILURE_UPDATE_EXPERIENCE,
	RECIEVE_DELETE_EXPERIENCE,
	FAILURE_DELETE_EXPERIENCE,
} from 'actions/blocks/experience';
import {
	requestCreateEducation,
	requestUpdateEducation,
	requestDeleteEducation,
	RECIEVE_CREATE_EDUCATION,
	FAILURE_CREATE_EDUCATION,
	RECIEVE_UPDATE_EDUCATION,
	FAILURE_UPDATE_EDUCATION,
	RECIEVE_DELETE_EDUCATION,
	FAILURE_DELETE_EDUCATION,
} from 'actions/blocks/education';
import {
	requestCreateCustom,
	requestUpdateCustom,
	requestDeleteCustom,
	RECIEVE_CREATE_CUSTOM,
	FAILURE_CREATE_CUSTOM,
	RECIEVE_UPDATE_CUSTOM,
	FAILURE_UPDATE_CUSTOM,
	RECIEVE_DELETE_CUSTOM,
	FAILURE_DELETE_CUSTOM,
} from 'actions/blocks/custom';
import {
	requestDeletePlusActivity,
	RECIEVE_FETCH_DELETE_PLUS_ACTIVITY,
	FAILURE_FETCH_DELETE_PLUS_ACTIVITY,
} from 'actions/blocks/plusActivity';

const typeConfig = {
	basic: {
		name: '基本資料',
		uniKey: 'basic',
		type: 'basic',
		icon: 'icon_profile',
		uidName: 'pid',
		multiRecords: false,
		metadata: {
			updater: {
				update: requestUpdateProfileBasic,
				successConsts: [RECIEVE_UPDATE_PROFILE_BASIC],
				failConsts: [FAILURE_UPDATE_PROFILE_BASIC],
			},
		},
		endpoint: 'basic',
	},
	experience: {
		name: '經歷',
		uniKey: 'experience',
		type: 'experience',
		icon: 'icon_experience',
		uidName: 'expId',
		multiRecords: true,
		metadata: {
			updater: {
				create: requestCreateExperience,
				update: requestUpdateExperience,
				successConsts: [RECIEVE_CREATE_EXPERIENCE, RECIEVE_UPDATE_EXPERIENCE],
				failConsts: [FAILURE_CREATE_EXPERIENCE, FAILURE_UPDATE_EXPERIENCE],
			},
			deleter: {
				delete: requestDeleteExperience,
				successConsts: [RECIEVE_DELETE_EXPERIENCE],
				failConsts: [FAILURE_DELETE_EXPERIENCE],
			},
		},
		endpoint: 'experiences',
	},
	education: {
		name: '學歷',
		uniKey: 'education',
		type: 'education',
		icon: 'icon_Education',
		uidName: 'eduId',
		multiRecords: true,
		endpoint: 'educations',
		metadata: {
			updater: {
				create: requestCreateEducation,
				update: requestUpdateEducation,
				successConsts: [RECIEVE_CREATE_EDUCATION, RECIEVE_UPDATE_EDUCATION],
				failConsts: [FAILURE_CREATE_EDUCATION, FAILURE_UPDATE_EDUCATION],
			},
			deleter: {
				delete: requestDeleteEducation,
				successConsts: [RECIEVE_DELETE_EDUCATION],
				failConsts: [FAILURE_DELETE_EDUCATION],
			},
		},
	},
	honor: {
		name: '專案成就',
		uniKey: 'honor',
		type: 'honor',
		icon: 'icon_achievement',
		uidName: 'honorId',
		multiRecords: true,
		sortType: 'HONOR',
		metadata: {
			updater: {
				create: requestCreateHonor,
				update: requestUpdateHonor,
				successConsts: [RECIEVE_CREATE_HONOR, RECIEVE_UPDATE_HONOR],
				failConsts: [FAILURE_CREATE_HONOR, FAILURE_UPDATE_HONOR],
			},
			deleter: {
				delete: requestDeleteHonor,
				successConsts: [RECIEVE_DELETE_HONOR],
				failConsts: [FAILURE_DELETE_HONOR],
			},
		},
		endpoint: 'honors',
	},
	talent: {
		name: '技能專長',
		uniKey: 'talent',
		type: 'talent',
		icon: 'icon_Expertise',
		uidName: 'tagId', // 忽略大小寫、utf8 encode
		multiRecords: true,
		sortType: 'TALENT',
		metadata: {
			updater: {
				create: requestCreateTalent,
				update: requestUpdateTalent,
				successConsts: [RECIEVE_CREATE_TALENT, RECIEVE_UPDATE_TALENT],
				failConsts: [FAILURE_CREATE_TALENT, FAILURE_UPDATE_TALENT],
			},
			deleter: {
				delete: requestDeleteTalent,
				successConsts: [RECIEVE_DELETE_TALENT],
				failConsts: [FAILURE_DELETE_TALENT],
			},
		},
		endpoint: 'talents',
	},
	gallery: {
		name: '作品集',
		uniKey: 'gallery',
		type: 'gallery',
		icon: 'icon_works',
		uidName: 'galleryId',
		multiRecords: true,
		sortType: 'GALLERY',
		endpoint: 'galleries',
		metadata: {
			updater: {
				create: requestCreateGallery,
				update: requestUpdateGallery,
				successConsts: [RECIEVE_CREATE_GALLERY, RECIEVE_UPDATE_GALLERY],
				failConsts: [FAILURE_CREATE_GALLERY, FAILURE_UPDATE_GALLERY],
			},
			deleter: {
				delete: requestDeleteGallery,
				successConsts: [RECIEVE_DELETE_GALLERY],
				failConsts: [FAILURE_DELETE_GALLERY],
			},
		},
	},
	github: {
		name: 'GitHub',
		uniKey: 'github',
		type: 'github',
		icon: 'icon_github',
		uidName: 'pid',
		multiRecords: false,
		endpoint: 'connectors/github/snapshot',
	},
	behance: {
		name: 'Behance',
		uniKey: 'behance',
		type: 'behance',
		icon: 'icon_behance',
		uidName: 'pid',
		multiRecords: false,
		endpoint: 'connectors/behance/snapshot',
	},
	plus_activity: {
		name: '職涯社群文章',
		uniKey: 'plus_activity',
		type: 'plus_activity',
		icon: 'icon_104plus',
		uidName: 'aid',
		multiRecords: true,
		endpoint: 'plus-activity',
		metadata: {
			deleter: {
				delete: requestDeletePlusActivity,
				successConsts: [RECIEVE_FETCH_DELETE_PLUS_ACTIVITY],
				failConsts: [FAILURE_FETCH_DELETE_PLUS_ACTIVITY],
			},
		},
	},
	custom: {
		name: '客製化專區',
		uniKey: '',
		type: 'custom',
		icon: 'icon_customize',
		uidName: 'customId',
		multiRecords: false,
		metadata: {
			updater: {
				create: requestCreateCustom,
				update: requestUpdateCustom,
				successConsts: [RECIEVE_CREATE_CUSTOM, RECIEVE_UPDATE_CUSTOM],
				failConsts: [FAILURE_CREATE_CUSTOM, FAILURE_UPDATE_CUSTOM],
			},
			deleter: {
				delete: requestDeleteCustom,
				successConsts: [RECIEVE_DELETE_CUSTOM],
				failConsts: [FAILURE_DELETE_CUSTOM],
			},
		},
		endpoint: 'customs',
	},
	placeHolder: {
		name: '',
		uniKey: 'placeHolder',
		type: 'placeHolder',
		icon: '',
		multiRecords: false,
	},
	remove: {
		name: '收回區塊',
		icon: 'delete',
	},
};

export default typeConfig;
