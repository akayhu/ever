"use strict";

export default {
	"name"  : "plus_rest",
	"port" : 8080,
	"env" : "test",
	"params": {
		"e104Url" : "//www.104-dev.com.tw",
		"wspJbUrl": "//wsp-jb.104-dev.com.tw",
		"documentApiUrl" : "http://api.doc.104dc-dev.com/docapi/v0/",
		"staticPlatformUrl" : '//static.104-dev.com.tw/bigc/c_platform',
		"staticWapUrl" : '//static.104-dev.com.tw/bigc/c_wap',
		"apiUrl" : {
			"esb" : 'http://api.104-dev.com.tw/services',
			"intesb" : 'http://in.api.104-dev.com.tw/services',
			"test_bank": "http://172.19.1.42/testing_bank/apis/private/wbs"
		},
		"apnum" : 10400,
		"tokenCid" : "b5ae2975b5fdfc7f4c3084daaa3b57c1"
	}
};