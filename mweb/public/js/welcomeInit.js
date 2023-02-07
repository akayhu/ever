function initGA(){
	// Google Analytics
	(function(i,s,o,g,r,a,m){
		i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	var ga_id = window.GAID;
	var searchAction = "artSearch";
	ga('create', ga_id, 'auto');
	ga('send', 'pageview', '/m/welcome/landing');
}

function initAlexa(){
	_atrk_opts = { atrk_acct: 'lRlHh1awVK00wf', domain: '104.com.tw', dynamic: true };
	(function() {
		var as = document.createElement('script');
		as.async = true;
		as.src = 'https://d31qbv1cthcecs.cloudfront.net/atrk.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(as, s);
	})();
}

function bindEvent(){
	var $body = $('body, html'),
			$window = $(window),
			isScroll = true;

	$('nav a').click(function() {
		isScroll = false;
		var idName = '#' + $(this).data('changename');
		$('nav a').removeClass('focus');
		$(this).addClass('focus');
		// console.log($(idName).offset().top - 150);
		$body.animate({
			scrollTop: $(idName).offset().top - 150
		}, 500, function() {
			isScroll = true;
		});
	});

	$window.scroll(function() {
		if (isScroll === true) {
			$('nav a').removeClass('focus');
			// console.log($window.scrollTop());
			if ($window.scrollTop() >= 3215) {
				$("a[data-changename='about']").addClass('focus');
			}	else if ($window.scrollTop() >= 2755) {
				$("a[data-changename='beagiver']").addClass('focus');
			}	else if ($window.scrollTop() >= 2030) {
				$("a[data-changename='channel']").addClass('focus');
			} else if ($window.scrollTop() >= 1400) {
				$("a[data-changename='group']").addClass('focus');
			} else if ($window.scrollTop() >= 995) {
				$("a[data-changename='talent']").addClass('focus');
			} else if ($window.scrollTop() >= 0) {
				$("a[data-changename='workplace']").addClass('focus');
			}
		}
	});

	var talentCounter = 0, // 一開始要顯示的文，0 的話就是顯示第一篇
			talentSlide = document.querySelector('#talent_slider'),
			talentItems = talentSlide.querySelectorAll('li'), // 抓取所有 li
			talentItemsCount = talentItems.length, // 推薦總數
			$talentControlLi = document.querySelector('.talentControl').querySelectorAll('li');

	function showCurrent(){
		var talentItemToShow = Math.abs(talentCounter % talentItemsCount); // 取餘數才能無限循環
		[].forEach.call(talentItems, function(el) {
			el.classList.remove('talent_show'); // 將所有 #talent_slider li 的 class="talent_show" 移除
		});
		[].forEach.call($talentControlLi, function(el) {
			el.classList.remove('current'); // 將所有 .talentControl li 的 class="current" 移除
		});
		talentItems[talentItemToShow].classList.add('talent_show'); // 將要顯示的 #talent_slider li 加入 class="talent_show"
		$talentControlLi[talentItemToShow].classList.add('current'); // 將要顯示的 li 加入 class="current"
	}

	$('.pere').click(function() {
		talentCounter--; // 將 counter-1 指定上一篇
		showCurrent();
	});

	$('.next').click(function() {
		talentCounter++; // 將 counter+1 指定下一篇
		showCurrent();
	});
}

function sendGa(gaName) {
	ga('send', 'event', '/m/welcome834', 'click', gaName);
	if (gaName === 'login') {
		ga('send', 'event', '/m/login', 'click', 'welcomeLogin');
	}
};

function getParameter(variable) {
	var queryString = window.location.search.split('?').join('');
	var vars = queryString.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair[0] === variable) {
			return pair[1];
		}
	}
	return '';
}

function close_lightbox() {
	$('.m-lightboxDiv').fadeOut(500);
	$('body').css('overflow', 'auto');
	window.location.href = '/m';
}

function cancelEmail() {
	var actionType = 'privacyUpdate';
	if (window.location.toString().indexOf('setMTS') !== -1) {
		actionType = "removeMTS";
	}
	$.ajax({
		type: 'POST',
		url: '/' + actionType + '',
		data: {
			np: getParameter('np'),
			type: getParameter('type')
		},
		dataType: 'json',
		success: function(response) {
			if (response.result && response.result.updateResult) {
				$('.m-lightboxDiv div.title').html('取消訂閱成功');
			} else {
				$('.m-lightboxDiv div.title').html('取消訂閱失敗');
			}
			setTimeout(function() {
				window.location.href = '/m';
			}, 1000);
		}
	});
}

window.welcomeInit = function welcomeInit() {
	initGA();
	// bindEvent();
	initAlexa();
	if (getParameter('np') !== '') {
		$('body').css('overflow', 'hidden');
		$('.m-lightboxDiv').show();
	}
};
