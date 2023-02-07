// todo
// 完全沒字元 (length < 0)
// 輸入 1 個以上半型空白 (沒有任何其他字元)
// 輸入 1 個以上全型空白 (沒有任何其他字元)
// 輸入 1 個以上的換行字完 (enter) (沒有任何其他字元)
// 輸入畫面上看不到的任何字完 (沒有任何其他字元)
const Validates = {
	// 檢查是否為空值 ，空值回傳 true
	checkIsEmpty(val) {
		let isEmpty = true;
		isEmpty = val.length === 0;
		return isEmpty;
	},
	// 檢查是否都是空白 ，空白 回傳 true
	checkValueNotBlank(val) {
		if (val === '') { return true; }
		const valCounts = val.length;
		const blanklist = val.match(/[\s]/g);
		if (blanklist === null) { return false; }
		const blanksLength = blanklist.length;
		let isBlank = false;
		if (valCounts === blanksLength) {
			isBlank = true;
		}
		return isBlank;
	}
};

export default Validates;
