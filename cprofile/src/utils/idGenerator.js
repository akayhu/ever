// class IDG {
//     constructor() {
//         this.record = {};
//     }
//     getID(num) {
//         const ID =  this._createRandom(num);
//         if( this.record[ID] ) return this.getID(num);

//         this.record[ID] = true;
//         return ID;
//     }
//     _createRandom(num) {
//         return '_' + Math.random().toString(36).substr(2, 2 + num);
//     }
// }
const _createRandom = num => {
	return Math.random()
		.toString(36)
		.substr(2, num);
};
const genKey = (string, num, checkList) => {
	const ID = `${string}_${_createRandom(num)}`;
	if (checkList[ID]) return genKey(string, num, checkList);
	return ID;
};

export default genKey;

export const generateId = (prefix = '') => {
	const hash = Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);

	return prefix ? `${prefix}-${Date.now()}-${hash}` : `${Date.now()}-${hash}`;
};
