export default shallowCompare
function shallowCompare(a, b) {
  if (!compareType(a, b)) return false;
  switch (getType(a)) {
    case 'Array':
      return compareArray(a, b);
    case 'Object':
      return compareObject(a, b);
    default:
      return new Error("you should pass two Array or Object");
  }
}

function getType(obj) {
  const raw = Object.prototype.toString.call(obj);
  return raw.match(/[A-Z][\w]*/)[0];
}

function compareType(a, b) {
  if (getType(a) !== getType(b)) return false;
  return true;
}

function compareArray(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((item, index) => item === b[index]);
}

function compareObject(a, b) {
  const keysOfA = Object.getOwnPropertyNames(a);
  const keysOfB = Object.getOwnPropertyNames(b);

  if (keysOfA.length !== keysOfB.length) {
    return false;
  }
  return keysOfA.every((item, index) => a[item] === b[keysOfB[index]]);
}
