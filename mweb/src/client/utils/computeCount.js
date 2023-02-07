export default function (count) {
    if (!count || count === 0) return '';
	return count > 1000
    ? `${parseInt(count / 1000, 10)}k+`
    : count;
}
