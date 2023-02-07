var webdriverio = require('webdriverio');
var options = {
	desiredCapabilities: {
		browserName: 'firefox'
	}
};
var options_chrome = {
	desiredCapabilities: {
		browserName: 'chrome'
	}
};
var options_ie = {
	desiredCapabilities: {
		browserName: 'internet explorer'
	}
};

webdriverio
	.remote(options)
	.init().then(function(){
		console.log('開啟firefox瀏覽器');
	})
	.url('http://127.0.0.1:8080/').then(function(){
		console.log('到指定網址');
	})
	.click('a[title="Internet Explorer"]').then(function(){
		console.log('開啟IE連結');
	})
	.click('a[title=Chrome]').then(function(){
		console.log('開啟Chrome連結');
	})
	.click('a[title=Safari]').then(function(){
		console.log('開啟Safari連結');
	})
	.click('a[title=Firefox]').then(function(){
		console.log('開啟Firefox連結');
	})
	.click('#browserSupportClose').then(function(){
		console.log('關閉browser視窗');
	})
	.end().then(function(){
		console.log('關閉firefox瀏覽器');
	})
	.catch(function(err) {
		console.log(err);
	});

webdriverio
	.remote(options_chrome)
	.init().then(function(){
		console.log('開啟chrome瀏覽器');
	})
	.url('http://127.0.0.1:8080/').then(function(){
		console.log('到指定網址');
	})
	.click('a[title="Internet Explorer"]').then(function(){
		console.log('開啟IE連結');
	})
	.click('a[title=Chrome]').then(function(){
		console.log('開啟Chrome連結');
	})
	.click('a[title=Safari]').then(function(){
		console.log('開啟Safari連結');
	})
	.click('a[title=Firefox]').then(function(){
		console.log('開啟Firefox連結');
	})
	.click('#browserSupportClose').then(function(){
		console.log('關閉browser視窗');
	})
	.end().then(function(){
		console.log('關閉chrome瀏覽器');
	})
	.catch(function(err) {
		console.log(err);
	});

webdriverio
	.remote(options_ie)
	.init().then(function(){
		console.log('開啟瀏覽器');
	})
	.url('http://127.0.0.1:8080/').then(function(){
		console.log('到指定網指');
	})
	.click('a[title="Internet Explorer"]').then(function(){
		console.log('開啟IE連結');
	})
	.click('a[title=Chrome]').then(function(){
		console.log('開啟Chrome連結');
	})
	.click('a[title=Safari]').then(function(){
		console.log('開啟Safari連結');
	})
	.click('a[title=Firefox]').then(function(){
		console.log('開啟Firefox連結');
	})
	.click('#browserSupportClose').then(function(){
		console.log('關閉browser視窗');
	})
	// .end().then(function(){
	// 	console.log('關閉瀏覽器');
	// })
	.catch(function(err) {
		console.log(err);
	});