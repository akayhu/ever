import HtmlAttributesToReact from './HtmlAttributesToReact';
import InlineStyleToObject from './InlineStyleToObject';

/**
 * Generates props for a React element from an object of HTML attributes
 *
 * @param {Object} attributes The HTML attributes
 * @param {String} key The key to give the react element
 */
const GeneratePropsFromAttributes = (attributes, key) => {
	// generate props
	const props = Object.assign({}, HtmlAttributesToReact(attributes), { key });

	// if there is a style prop then convert it to a React style object
	if (props.style) {
		props.style = InlineStyleToObject(props.style);
	}

	return props;
};

export default GeneratePropsFromAttributes;
