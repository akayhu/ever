var request = require('superagent');
var appConfig = require('src/configs/client');

var encryptParam = 'c2hvdyBtZSBtb25leV9fX197ImFwbnVtIjoiMTA0MDAiLCJhY3Rpb25UaW1lc3RhbXAiOjE0NTY5OTA5NDMyMTEsInBpZCI6IjEwODMzNiJ9';
/**
 * 104+ 專用的 Extra 常數: 使用者頭像
 */
export const COVER_EDIT_CONST = "ab866ga6-7edf-1134-9e3f46bb7d9e03t68",
	/**
	 * 104+ 專用的 Extra 常數: 大名片(個人頁)頭像
	 */
	AVATAR_EDIT_CONST = "586h4ga6-bgt1-m864-9e3f4ht91d9ej8067";
	/**
	 * 104+ 專用的 Extra 常數: One Button 圖片
	 */


/**
 * 上傳檔案
 * 
 * @param extra	{String}  (required) 上傳檔案時要額外處理的指令，此參數已被 Doc API 封裝成固定的 ID，共有 9 種情境，請參閱 Doc API 或 plusFileuploadService 的 EXTRA_* 常數
 * @param formId   {String}  (required) 要上傳的 input file tag 所在的 form 的 id，要特別注意的是，Doc API 要求該 form 之內只能有要上傳的 input file tag (也只能有一筆)，不能參有其他的 input tag。
 * @param callback {Function}(required) 成功/失敗時回呼的方法。此方法會被傳入一個 Object，該 Object 為上傳中/結束 Doc API 返回的狀態/結果物件。
 * @param interval {Integer} (optional) 上傳後，要每隔多少時間去取得上傳的進度。單位為毫秒。預設是 500。
 */

function getEncrypt() {
	
	
}

export function doc_api_upload(extra, formId, callback, pid, interval) {
	// 先取得加密字串
	//$log.log("get encryptParam is : " + encryptParam);
	let encryptURL = appConfig.rootPath + '/ajax/doc/encrypt-param';
	request
		.get(encryptURL)
		.end(function(err, res) {
			if (err) {
				do_upload(extra, formId, callback, interval, encryptParam);
			} else if (typeof res.body !== 'undefined') {
				do_upload(extra, formId, callback, interval, res.body[0]);
			}
		});
}


function do_upload (extra, formId, callback, interval, encryptParam) {
	if (encryptParam) {
		// 因為 Doc API 用 JSONP，所以 random 一個 function 來接返回結果
		var randomFunction = "PlusFileuploadCallback_" + (new Date().getTime()),
			plus104DocManager = new E104DocumentManagement({
				"form": formId,
				"t": encryptParam,
				"extra": extra
			});

		// random 的 function，放在全域(window)，專門來接此次上代 Doc API 回傳的結果
		window[randomFunction] = function(result) {
			// 如果沒收到結果，或回傳的狀態不為 2 (完成)、3 (失敗)，則持續去問上傳的進度。
			if (result === null || (result.status !== 2 && result.status !== 3)) {
				setTimeout(function() {
					plus104DocManager.getStatus(randomFunction);
				}, interval || 500);
			}

			callback(result);

			// 若上傳結束(完成/失敗)，則將此 random 的方法刪除
			if (result && (result.status === 2 || result.status === 3)) {
				delete window[randomFunction];
			}

		};
		plus104DocManager.sendForm(); // 上傳檔案開始
		plus104DocManager.getStatus(randomFunction); // 查詢上傳進度
	} else {
		/* todo: 取不到 encrypt 值的處理 */
		//$log.log("encryptParam is null");
		//$log.log(encryptParam);
		//$log.log(callback);
		setTimeout(function() {
			callback({ 'progress': '0', 'status': '3', 'msg': 'encrypt parameters is null', 'errorCode': 'upload_001' });
		}, 0);
	}
}