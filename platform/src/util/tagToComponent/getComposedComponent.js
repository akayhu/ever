import React from 'react';
import * as PC from './plusComponents';

// getComposedComponent: return array of components
function getComposedComponent(structuralObj, key) {

	return Object.keys(structuralObj).map(tagName =>
		transToComponent(tagName, structuralObj[tagName], key)
	);
}

function transToComponent(tagName, attrs, key) {
	let {_content, _startWords} = attrs;
	delete attrs._content;
	delete attrs._startWords;
	let subComponents;

	if (existComponents(_content)) {
		subComponents = getComposedComponent(_content);
		Object.assign(attrs, {subComponents}, key);
	} else {
		Object.assign(attrs, {content: _content}, key);
	}
	if (_startWords) {
		Object.assign(attrs, {startWords: _startWords}, key);
	}
	
	const type = tagName.match(/([a-zA-Z]+)_?/)[1];
	switch (type) {
		case 'user':
			return <PC.PlusUser {...attrs} key={tagName} />
		case 'activity':
		case 'activitytag':
		case 'activitylike':
			return <PC.PlusActivity {...attrs} key={tagName} />
		case 'commentlike':
			return <PC.PlusComment {...attrs} key={tagName} />
		case 'approve':
			return <PC.PlusApprove {...attrs} key={tagName} />
		case 'company':
			return <PC.PlusCompany {...attrs} key={tagName} />
		case 'group':
			return <PC.PlusGroup {...attrs} key={tagName} />
		case 'invitegroup':
			return <PC.PlusGroup {...attrs} key={tagName} />
		case 'channel':
			return <PC.PlusChannel {...attrs} key={tagName} />
		case 'applypublicgroup':
			return <PC.PlusApplypublicgroup {...attrs} key={tagName} />
		case 'activitycomment':
		case 'activitycommentlike':
			return <PC.PlusActivitycomment {...attrs} key={tagName} />
		case 'hyperlink':
			return <PC.PlusHyperlink {...attrs} key={tagName} />
		case 'space':
			return <PC.PlusSpace {...attrs} key={tagName} />
		case 'link':
			return <PC.PlusLink {...attrs} key={tagName} />
		case 'rejectapplygroup':
			return <PC.PlusRejectApplyGroup {...attrs} key={tagName} />
		case 'class':
			return <PC.PlusClass {...attrs} key={tagName} />
		case 'appraise':
			return <PC.PlusAppraise {...attrs} key={tagName} />
		case 'applynotificationgroup':
			return <PC.PlusApplyNotificationGroup {...attrs} key={tagName} />
		case 'joinpublicgroup':
			return <PC.PlusJoinPublicGroup {...attrs} key={tagName} />
		case 'p':
			return attrs.content && attrs.content.length > 20 ? attrs.content.substr(0, 20)+"..." : attrs.content;
		case 'start':
			return attrs;
		default: {
			return <div key={tagName}>{tagName}:no this component</div>
		}
	}
}

function existComponents(content) {
	return Object.prototype.toString.call(content) === '[object Object]';
}

export default getComposedComponent;
