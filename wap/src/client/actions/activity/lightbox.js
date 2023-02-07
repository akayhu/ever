/**
 * 開啟lightbox
 */
export const OPEN_ACTIVITY_LIGHTBOX = 'OPEN_ACTIVITY_LIGHTBOX';
export function activityLightboxOpen(activity) {
	return {
		type: OPEN_ACTIVITY_LIGHTBOX,
		aid: activity.aid
	};
}

/**
 * 關閉lightbox
 */
export const COLSE_ACTIVITY_LIGHTBOX = 'COLSE_ACTIVITY_LIGHTBOX';
export function activityLightboxClose() {
	return {
		type: COLSE_ACTIVITY_LIGHTBOX,
		aid: null
	};
}