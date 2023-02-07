// 轉換格式
const convertFormat = (type, data) => {
	switch (type) {
		default:
			return false;
	}
};

// 僅接受傳入單一物件
export const sendToDataLayer = (item, convertType) => {
	if (!window || !window.dataLayer) return;

	const dataLayer = window.dataLayer;
	const appendData = convertType ? convertFormat(convertType, item) : item;
	if (!appendData) return;
	if (typeof appendData !== 'object') {
		console.error(
			'item is not a valid object in sendToDataLayer',
			item,
			appendData
		);
		return;
	}

	// dataLayer雖然是Array，但push的方法在GTM初始化時被覆寫了，只能透過dataLayer.push()傳遞資料
	// 若未來要改成傳入 {activity: [...]}，改這邊
	dataLayer.push(appendData);
};
