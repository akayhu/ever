import compose from './compose';
import n12br from './nl2br';
import ReactHtmlParser from 'components/react-html-parser';

// HTML String 轉成 React Elements
const parseStrToElements = str => {
	if (!str || typeof str !== 'string') return null;

	return compose(
		ReactHtmlParser,
		n12br
	)(str);
};

export default parseStrToElements;
