import htmlparser2 from 'htmlparser2';
import ProcessNodes from './utils/ProcessNodes';

/**
 * Parses a HTML string and returns a list of React components generated from it
 *
 * @param {String} html The HTML to convert into React components
 * @returns {Array} List of top level React elements
 */

const HtmlParser = html => {
	const htmlReplace = html
		.replace(/&lt;/g, '＜')
		.replace(/&gt;/g, '＞')
		.replace(/&nbsp;/g, ' ')
		.replace(/&#xa0;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"');
	const nodes = htmlparser2.parseDOM(htmlReplace);
	return ProcessNodes(nodes);
};

export default HtmlParser;
