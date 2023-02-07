// REGEX
const RE_start_words = /(^[^<]+)/;
const RE_tag_string_sets = /<((?:plus:)?([\w]+))\s?([^>]*)>(.*?)(<\/\1>)([^<>]{0,})/g;
const RE_tag_string_set = /<((?:plus:)?([\w]+))\s?([^>]*)>(.*?)(<\/\1>)([^<>]{0,})/;
const RE_attr_pairs = /([\w\d\-]+)="?([\w\-\:\?\/\.]+)/g;
const RE_type = /plus:([\w\d]+)/;

function getTagStringList(text) {
	return text.match(RE_tag_string_sets);
}

function parseTextToObj(text) {
	const [_startWords] = text.match(RE_start_words) || [];

	var newText = getTagStringList(text);

	return newText.reduce((structuralObj, tagString) => {
			let { type, attrPairs } = getSubObj(tagString);
			type = setTypeName(structuralObj, type);
			
			// 這邊強制把startWord 搬出 objList ，算是先解決問題的權宜之計	
			if (_startWords) structuralObj['start'] = _startWords;
			
			structuralObj[type] = attrPairs;
			return structuralObj;
		}, {});
}

function getSubObj(tagString) {
	let attrPairs = {};
	const [all, head, type, attrTexts, _content, tail, _followed] = tagString.match(RE_tag_string_set);

	if (attrTexts) { // 有可能會沒有attribute

		const matchResult = attrTexts.match(RE_attr_pairs);

		matchResult && matchResult.forEach(attrText => {
			const [key, value] = attrText.split('="');
			attrPairs[key] = value;
		})
	}
	attrPairs['_followed'] = _followed;
	attrPairs['_content'] = parseContent(_content);

	return { type, attrPairs }
}

function parseContent(_content) {
	//不是巢狀回傳_content，否則回傳解析結果
	if (!_content.startsWith('<')) {
		return _content;
	} else {
		if(/<plus\:/g.test(_content)){
			return parseTextToObj(_content);
		}else if(/<p/g.test(_content)){
			return parseTextToObj(_content);
		}else{
			return _content;
		}
	}
}

function setTypeName(structuralObj, type) {
	const keys = Object.keys(structuralObj);
	if (keys.includes(type)) {
		return getNewKeyName(keys, type);
	}
	return type;
}

function getNewKeyName(keys, key, n = 1) {
	if (keys.includes(`${key}_${n}`)) {
		return getNewKeyName(keys, key, n + 1);
	}
	return `${key}_${n}`;
}

export default parseTextToObj;
