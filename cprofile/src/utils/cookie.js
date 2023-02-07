// https://www.npmjs.com/package/js-cookie
import Cookies from 'js-cookie';

// 讀取所有 cookie
export const getAllCookie = () => {
	return Cookies.get();
};

// 用 js-cookie library 寫入 cookie
// example: Cookies.set('name', 'value');
// example: Cookies.set('name', 'value', { expires: 7 });
// example: Cookies.set('name', 'value', { expires: 7, path: '' });
// effective 為物件
export const setCookie = (name, value, effective = {}) => {
	effective ? Cookies.set(name, value, effective) : Cookies.set(name, value);
};

// 寫入 cookie
export const setCookieFunc = (name, value, expires, path) => {
	document.cookie = `${name}=${value};expires=${expires};path=${path}`;
};

// 用 js-cookie library 讀取 cookie
export const getCookie = name => {
	return Cookies.get(name);
};

// 讀取 cookie
export const getCookieFunc = name => {
	const arr = document.cookie.match(
		new RegExp('(^| )' + name + '=([^;]*)(;|$)')
	);
	if (arr != null) return unescape(arr[2]);
	return null;
};

// 刪除 cookie
export const delCookie = name => {
	return Cookies.remove(name);
};
