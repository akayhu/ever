import parseTextToObj from './parseTextToObj'
import getComposedComponent from './getComposedComponent'

export default function tagToComponent(tag_text, key) {
  const structural_obj = parseTextToObj(tag_text);
  return getComposedComponent(structural_obj, key);
}

export {parseTextToObj}
