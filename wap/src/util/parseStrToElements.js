import compose from 'src/util/compose';
import n12br from 'src/util/n12br';
// import DOMPurify from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
// import { canUseDOM } from 'exenv';

// HTML String 轉成 React Elements
const parseStrToElements = (str) => {
	if (!str || typeof str !== 'string') return null;

	// 因為 DOMPurify 會移除非正規的自訂 attribute，考量到要盤點眾多可能性（尤其是轉貼連結的顯示），決定暫且移除
	/* if (!canUseDOM) {
		const { JSDOM } = require('jsdom');
		const window = (new JSDOM('')).window;
		const ServerSideDOMPurify = DOMPurify(window);
		return compose(ReactHtmlParser, n12br, ServerSideDOMPurify.sanitize)(str);
	} */

	return compose(ReactHtmlParser, n12br/* , DOMPurify.sanitize */)(str);
};

export default parseStrToElements;
