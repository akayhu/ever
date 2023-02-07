import rs from 'jsrsasign';

const KEYUTIL = rs.KEYUTIL;
const KJUR = rs.KJUR;

// check base64 encoded
const checkBase64 = (text) => {
    // include base64, url safe base64
	if (!text) return false;
	const regBase64Encoded = /^[\w\+\-\/\_\=\|]+$/i;
	return regBase64Encoded.test(text);
};

// 取得當前文章的 update 時間，檢查是否大於設定的期間
const isNeedRescrape = (aUrl, duration) => {
	const urlReg = /(((http|https)\:\/\/))*[\w\.\/\?\:@\-_=#]+\.([\w\&\.\/\?\:@\-_=#])*/g;
    // input check
	if (!aUrl || !duration) {
		console.log('incomplete input in isNeedRescrape()', aUrl, duration);
		return false;
	}
	if (typeof duration !== 'number') {
		console.log('invalid input in isNeedRescrape(): duration need to be number');
		return false;
	}
	if (!urlReg.test(aUrl)) {
		console.log('invalid input in isNeedRescrape(): aUrl need to be base64 url string', aUrl);
		return false;
	}

	const checkUrl = `https://graph.facebook.com/?id=${aUrl}`;
	return fetch(checkUrl)
		.then(res => (res.ok ? res.json() : Promise.reject(res)))
		.then((data) => {
			if ((data.og_object && !data.og_object.updated_time) || (!data.og_object && !data.updated_time)) {
				console.log('This url is never shared and cached');
				return false;
			}
			const updatedTime = new Date(data.og_object.updated_time).getTime();
			const now = Date.now();
			return now > (updatedTime + duration);
		})
		.catch((e) => {
			console.error('isNeedRescrape() error', e);
			return false;
		});
};

  // RSA decrypt token
const decryptToken = (eToken, prvKeyPem) => {
	if (!eToken || !prvKeyPem) {
		console.log('incomplete input in decryptToken()', eToken, prvKeyPem);
		return false;
	}

	// check base64 format
	if (!checkBase64(eToken)) {
		console.log('invalid input in decryptToken(): invalid base64 encoded in token');
		return false;
	}

	let result = false;
	try {
        // check jsrsasign is be include
		if (!KEYUTIL || !KJUR) throw 'cannot find module jsrsasign';

        // private plain PEM to KeyObject
		const prvKeyObj = KEYUTIL.getKeyFromPlainPrivatePKCS8PEM(prvKeyPem);
		result = KJUR.crypto.Cipher.decrypt(eToken, prvKeyObj, 'RSA');
	} catch (e) {
		console.error('decryptToken() error', e);
	}
	return result;
};

  // RSA encrypt token
const encryptToken = (token) => {
	if (!token) {
		console.log('incomplete input in encryptToken()', token);
		return false;
	}

    // check base64 format
	if (!checkBase64(token)) {
		console.log('invalid input in decryptToken(): invalid base64 encoded in token');
		return false;
	}

	let result = false;
	try {
		// check jsrsasign is be include
		if (!KEYUTIL || !KJUR) throw 'cannot find module jsrsasign';

		// private plain PEM to KeyObject
		const keypair = KEYUTIL.generateKeypair('RSA', 2048);
		const eToken = KJUR.crypto.Cipher.encrypt(token, keypair.pubKeyObj, 'RSA');
		const prvKeyPem = KEYUTIL.getPEM(keypair.prvKeyObj, "PKCS8PRV")
		result = { eToken, prvKeyPem };
	} catch (e) {
		console.error('encryptToken() error:', e);
	}
	return result;
};

// POST Graph API to rescrape
const rescrape = (aUrl, dToken, duration) => {
	if (!aUrl || !dToken || !duration) {
		console.error('incomplete input in rescrape():', 'aUrl:', aUrl, 'dToken', dToken, 'duration', duration);
		return false;
	}

    // check base64 format
	if (!checkBase64(dToken)) {
		console.error('invalid input in rescrape():','invalid base64 encoded in dToken');
		return false;
	}

	const rescrapeUrl = `https://graph.facebook.com/?id=${aUrl}&scrape=true&access_token=${dToken}`;
	return fetch(rescrapeUrl, { method: 'POST' })
		.then(res => (res.ok ? res.json() : Promise.reject(res)))
		.then((data) => {
			let newUpdatedTime = (data.og_object && data.og_object.updated_time) || data.updated_time || null;
			if (!newUpdatedTime) return Promise.reject(data);
			const now = Date.now();
			newUpdatedTime = new Date(newUpdatedTime).getTime();

			// 若更新時間 + 下次區間比 now 還大，表示更新成功
			return (now < newUpdatedTime + duration) ? console.log('rescrape success!') : Promise.reject(data);
		})
		.catch((e) => {
			console.error('rescrape() error:', e);
			return false;
		});
};

// main
const checkRescrape = (aUrl, eToken, prvKeyPem, duration) => {
    // check jsrsasign is be include
	if (!KEYUTIL || !KJUR) return console.error('cannot find module jsrsasign');

	return isNeedRescrape(aUrl, duration).then((res) => {
		if (!res) {
			console.log('No need to rescrape');
			return false;
		}

		const dToken = decryptToken(eToken, prvKeyPem);
		return (!dToken) ? Promise.reject('decrypt error') : rescrape(aUrl, dToken, duration);
	})
    .catch(e => console.log(e));
};

export default checkRescrape;
