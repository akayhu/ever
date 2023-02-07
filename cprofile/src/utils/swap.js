/**
 * For Immutable.js sort() method，簡化判斷 return 1, -1, 0 (官方文件部分是錯誤的)
 *
 * ex: Collection.sort((prev, next) => swap(prev.p, next.p, 'desc'));
 *
 * https://facebook.github.io/immutable-js/docs/#/List/sort
 */

const swap = (prevValue, nextValue, order = 'asc') => {
	// 0: 不換, -1: prev - next, 1: next - prev

	// 遞減 5, 4, 3
	if (order === 'desc') return prevValue > nextValue ? -1 : 1;

	// 遞增 3, 4, 5
	if (order === 'asc') return prevValue < nextValue ? -1 : 1;

	// tmp 往後放
	if (order === 'tmp-backward') {
		const isPrevTmp = /tmp-/.test(prevValue);
		const isNextTmp = /tmp-/.test(nextValue);
		if (isPrevTmp && isNextTmp) return 0; // tmp- , tmp-
		if (!isPrevTmp && !isNextTmp) return 0; // <id> , <id>
		if (isPrevTmp && !isNextTmp) return 1; // tmp- , <id>
		if (!isPrevTmp && isNextTmp) return -1; // <id> , tmp-
	}

	// tmp 往前放
	if (order === 'tmp-forward') {
		const isPrevTmp = /tmp-/.test(prevValue);
		const isNextTmp = /tmp-/.test(nextValue);
		if (isPrevTmp && isNextTmp) return 0; // tmp- , tmp-
		if (!isPrevTmp && !isNextTmp) return 0; // <id> , <id>
		if (isPrevTmp && !isNextTmp) return -1; // tmp- , <id>
		if (!isPrevTmp && isNextTmp) return 1; // <id> , tmp-
	}

	console.error('不合法的排序設定, 僅接受 asc, desc', order);
	return 0;
};

export default swap;
