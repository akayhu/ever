/**
 * 
 * (Universal) 此script的功能為去掉HTML內的tags，不限定在client side 可用但相對效能較差
 * 如果是純client side 的情境請使用 DOMPurify
 * 
 * @param {any} input HTML string
 * @param {any} allowed 允許的tags
 * @returns 
 */

function stripTags(input, allowed) {
	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
	const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(tags, ($0, $1) =>
        allowed.indexOf(`<${$1.toLowerCase()}>`) > -1 ? $0 : ''
    );
}

export default stripTags;
