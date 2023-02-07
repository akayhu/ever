const normalBlock = ['followed', 'gallery', 'honor', 'channel', 'group'];
const nestedBlock = ['news', 'endorse', 'related'];
const special = ['initialEndorse', 'initialRelated', 'initialHonor'];
const allBlockName = [...normalBlock, ...nestedBlock, ...special];

export function isNestedBlock(key) {
	if (nestedBlock.indexOf(key) !== -1)
		return true;
	return false;
}

export function isErrorInput(key, subkey) {
	if (allBlockName.indexOf(key) === -1) {
		console.error(`Invalid key: ${key}`);
		return true;
	}
	if (nestedBlock.indexOf(key) !== -1 && !subkey) {
		console.error(`${key} should has a subKey name`);
		return true;
	}
	return false;
}

// 根據key回傳'activity' or 'person' or 'channel' or 'honor'
export function mapStateKeyToIdtype(key) {
	if (['news', 'gallery'].indexOf(key) !== -1) return 'activity';

	if (['followed', 'endorse', 'related', 'initialEndorse', 'initialRelated'].indexOf(key) !== -1) return 'person';

	if (['group', 'channel'].indexOf(key) !== -1) return 'channel';

	if (['honor'].indexOf(key) !== -1) return 'honor';

	return 'error';
}
