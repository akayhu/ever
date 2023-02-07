import clientConfig from 'src/configs/client';

// A版 feature 資料
const FeatureDataList = [
	{
		title: '社團',
		imgUrl: '/images/prelogin/feature/group.png',
		description: '超過200個專業社團，解決你的職場困惑疑難雜症，快來與同業過招、切磋。',
		linkUrl: '/group',
		target: '_self'
	},
	{
		title: '文章',
		imgUrl: '/images/prelogin/feature/activity.png',
		description: '100,000+熱門話題，輕鬆了解你所屬產業的最新發展，掌握市場脈動，抓穩趨勢。',
		linkUrl: '/topic/hots/articleList',
		target: '_self'
	},
	{
		title: '活動講座',
		imgUrl: '/images/prelogin/feature/connection.png',
		description: '職涯活動講座，帶你深入了解各專業領域，與其他同好交流互動，加強你的職場人脈力！',
		linkUrl: `https:${clientConfig.params.wapUrl}/event/`,
		target: '_blank',
		eventCss: 'eventP'
	},
];

// B版社團資料
const GroupDataList = {
	lab: [
		{
			gid: 11283,
			name: '隱身者公開社團',
			description: `被譽為搖滾樂先驅的歌手，美國歐曼兄弟樂團（The Allman Brothers）創辦人兼主唱歌手格雷格·奧爾曼（Gregg Allman）在美國逝世，
			享年69歲。 奧爾曼的官方網站表示，格雷格·奧爾曼星期六（5月27日）在喬治亞州薩凡納市家中與世長辭。 格雷格與兄長杜安（Duane Allman）一
			同創立的歐曼兄弟樂團於1960年代末嶄露頭角，其音樂於全盛時期可謂每家廣播電台的必備「糧食」。 歐曼兄弟於1973年發表的單曲《Jessica》後來被BBC《
			瘋狂汽車秀》（Top Gear）採用為主題音樂，雖然其後被重新編曲，但一直沿用至今。`,
			groupUrl: '/group/11283',
			imgUrl: '/images/prelogin/group/1.jpg',
		},
		{
			gid: 11193,
			name: '地下財富公開社團',
			description: `挖!挖!挖!`,
			groupUrl: '/group/11193',
			imgUrl: '/images/prelogin/group/2.jpg',
		},
		{
			gid: 11217,
			name: '做個飽鬼公開社團',
			description: `市警隊與市民交流的場所`,
			groupUrl: '/group/11217',
			imgUrl: '/images/prelogin/group/3.jpg',
		},
		{
			gid: 11437,
			name: 'The Tunnel',
			description: `Season 2`,
			groupUrl: '/group/11437',
			imgUrl: '/images/prelogin/group/4.jpg',
		},
		{
			gid: 6871,
			name: '申請社團加入測試試',
			description: `testDesc`,
			groupUrl: '/group/6871',
			imgUrl: '/images/prelogin/group/5.jpg',
		},
		{
			gid: 6621,
			name: 'JAVA Developer Days',
			description: `JAVA Developer Days`,
			groupUrl: '/group/6621',
			imgUrl: '/images/prelogin/group/6.jpg',
		},
		{
			gid: 6907,
			name: 'Test加入社團Email公開社團',
			description: `測試社團`,
			groupUrl: '/group/6907',
			imgUrl: '/images/prelogin/group/7.jpg',
		},
		{
			gid: 6797,
			name: '人資同學會公開社團',
			description: `111`,
			groupUrl: '/group/6797',
			imgUrl: '/images/prelogin/group/8.jpg',
		},
		{
			gid: 6799,
			name: '職場占星即時talk',
			description: `9898＜ScRipT＞alert(123)＜/ScRipt＞d`,
			groupUrl: '/group/6799',
			imgUrl: '/images/prelogin/group/9.jpg',
		},
		{
			gid: 11187,
			name: '談寫作',
			description: `WOI4RHWRGWHHHHF`,
			groupUrl: '/group/11187',
			imgUrl: '/images/prelogin/group/10.jpg',
		},
	],
	staging: [
		{
			gid: 41145,
			name: 'BeAGiver',
			description: `如果繼續停留在評論對方的階段，我們永遠也前進不了！ 想進步，你我都要退一步；伸出手，攜手向前走！ 有你站出來，他會不一樣，邀你一起 Be A Giver. APP下載 https://jr3j.app.link/LOXt9l3x7v`,
			groupUrl: '/group/41145',
			imgUrl: '/images/prelogin/group/1.jpg',
		},
		{
			gid: 31363,
			name: '百工的一天',
			description: `分享成就夢想！本社團將持續舉辦各項百工系列公益活動，邀您一起為社會環境做些沒有報酬的傻事。還有不定期舉辦的免費百工分享圓夢講座。誠摯的邀請各位朋友們，持續關注，共襄盛舉。【104職涯社群】向每位認真的你致敬。|||||||||| *最新活動出爐【百工故事攝影】你攝影，我捐款https://goo.gl/9B8JbO |||||||||| *【百工的一天 公益徵文】：你寫文，我捐款 https://goo.gl/aUCTui`,
			groupUrl: '/group/31363',
			imgUrl: '/images/prelogin/group/2.jpg',
		},
		{
			gid: 31757,
			name: '電商練功室',
			description: `電商練功室 是一個專為電子商務所設計的(KM)知識管理平台，無論您是電商、微電商、或對電商有興趣者皆歡迎加入! 透過群眾知識的交流讓我們一起成長!`,
			groupUrl: '/group/31757',
			imgUrl: '/images/prelogin/group/3.jpg',
		},
		{
			gid: 14403,
			name: '找工作經驗交流',
			description: `找工作的辛苦，只有找工作的人才知道。不管找工作背後的原因是什麼，重要的是最後一定要找到比現在更好的工作。歡迎大家一起來找工作討論區分享自己找工作過程中發生的問題與心情，在討論自己問題的同時，或許也可以得到突破思考盲點的建議喔！`,
			groupUrl: '/group/14403',
			imgUrl: '/images/prelogin/group/4.jpg',
		},
		{
			gid: 18951,
			name: '上班族工作百味',
			description: `那些微小卻牽動著你一整天情緒、想說卻無法說出口的工作百味，在這個專屬小員工的小樹洞，碎念、取暖、爆卦、耍廢…想分享什麼在這裡都可以！`,
			groupUrl: '/group/18951',
			imgUrl: '/images/prelogin/group/5.jpg',
		},
		{
			gid: 15347,
			name: '中國工作討論區',
			description: `世界最大的經濟體以及內需市場，沒有語言隔閡、文化底蘊相近的中國，一直是台灣人在海外工作選擇上的最優先考慮國家。不管你是現在已經在中國深耕職涯的台灣人，還是正在計劃前近中國掏金尋夢的台灣人，都歡迎你一起來社團討論中國工作的大小事！`,
			groupUrl: '/group/15347',
			imgUrl: '/images/prelogin/group/6.jpg',
		},
		{
			gid: 15725,
			name: '海外工作討論區',
			description: `做為一個海島，台灣人天生就嚮往海洋，充滿探知未知寬廣世界的勇氣。不管你是現在已經在海外工作的台灣人，還是夢想未來前往海外工作的台灣人，歡迎大家一起來分享、討論海外工作的大小事情。`,
			groupUrl: '/group/15725',
			imgUrl: '/images/prelogin/group/7.jpg',
		},
		{
			gid: 28229,
			name: 'Excel大小事',
			description: `
			擅用Excel創造工作效率，將省下來的時間留給自己。 我們是一群熱愛Excel來簡化工作的人! 我們可以： 1.Excel操作問題免費諮詢 2.Excel檔案改善計劃 3.Excel設計解決方案 市面上很多關於Excel的課程，常常在課程上獲得很多啟發，下了課回到工作上卻仍不知道該從何下手及如何應用。 我們的存在，是直接接收您在Excel使用上的問題，根據您的需求改造Excel資料處理的效率，並增加其附加價值。讓您真正學會Excel在工作上的應用、省下更多時間做其他發展、享受Excel帶來的無限可能。 歡迎留言給我們，讓我們將Excel的神奇力量分享給您~~ 如果不便公開，也可以mail到以下信箱給我們喲： sunkuo75@gmail.com 期待您的加入!! 或是回饋您的意見給我們~ http://goo.gl/forms/tCFbjfmT3wYxnngk1`,
			groupUrl: '/group/28229',
			imgUrl: '/images/prelogin/group/8.jpg',
		},
		{
			gid: 21871,
			name: '簡報好好做',
			description: `「簡報好好做」後面這三個字~好好做,，重音不同或說話者不同就有不同意義，一者是指做好簡報一點都不難，另一則是指簡報做得還有努力的空間。 職場何處不簡報啊！相信每位職場人工作中或多或少都會要用到簡報，不論是向客戶推銷或是向上司報告等，怎樣在更短的時間內完成專業的簡報，而在溝通簡報時又能精準打動聽眾，這真是不易的課題。 希望經由大家多多分享及經驗交流，能讓每個人的簡報力都愈來愈好，那個人競爭力就Up囉！`,
			groupUrl: '/group/21871',
			imgUrl: '/images/prelogin/group/9.jpg',
		},
		{
			gid: 22605,
			name: '好想學英文',
			description: `一起來無壓力學ABC，練練商用英文、旅行英文、新聞英文、生活英文, 專業英文, 出國留學英文, 或是用英文莊孝維; 總之這是一個英文的園地...you are more than welcome to join us!`,
			groupUrl: '/group/22605',
			imgUrl: '/images/prelogin/group/10.jpg',
		},
	],
	production: [
		{
			gid: 41145,
			name: 'BeAGiver',
			description: `如果繼續停留在評論對方的階段，我們永遠也前進不了！ 想進步，你我都要退一步；伸出手，攜手向前走！ 有你站出來，他會不一樣，邀你一起 Be A Giver. APP下載 https://jr3j.app.link/LOXt9l3x7v`,
			groupUrl: '/group/41145',
			imgUrl: '/images/prelogin/group/10.jpg',
		},
		{
			gid: 60243,
			name: '104玩數據',
			description: `本社團主要是分享資料工程或資料科學領域的新知或消息，以及市場研究觀察到的求職求才數據。`,
			groupUrl: '/group/60243',
			imgUrl: '/images/prelogin/group/3.jpg',
		},
		{
			gid: 60259,
			name: '百工裡的人類學家',
			description: `在各行各業裡、社會的各個角落裡，都有一群人，做著跟人類學家一樣的事，或是用人類學家的方法來工作，他們不在學術圈裡，卻讓人類學更加貼近社會大眾。 「百工裡的人類學家」，就是要邀請這些人，分享他們的人類學經驗，以及他們如何將自己的工作結合人類學，`,
			groupUrl: '/group/60259',
			imgUrl: '/images/prelogin/group/5.jpg',
		},
		{
			gid: 14403,
			name: '找工作經驗交流',
			description: `找工作的辛苦，只有找工作的人才知道。不管找工作背後的原因是什麼，重要的是最後一定要找到比現在更好的工作。歡迎大家一起來找工作討論區分享自己找工作過程中發生的問題與心情，在討論自己問題的同時，或許也可以得到突破思考盲點的建議喔！`,
			groupUrl: '/group/14403',
			imgUrl: '/images/prelogin/group/1.jpg',
		},
		{
			gid: 18951,
			name: '上班族工作百味',
			description: `那些微小卻牽動著你一整天情緒、想說卻無法說出口的工作百味，在這個專屬小員工的小樹洞，碎念、取暖、爆卦、耍廢…想分享什麼在這裡都可以！`,
			groupUrl: '/group/18951',
			imgUrl: '/images/prelogin/group/2.jpg',
		},
		{
			gid: 13495,
			name: '中國工作討論區',
			description: `世界最大的經濟體以及內需市場，沒有語言隔閡、文化底蘊相近的中國，一直是台灣人在海外工作選擇上的最優先考慮國家。不管你是現在已經在中國深耕職涯的台灣人，還是正在計劃前近中國掏金尋夢的台灣人，都歡迎你一起來社團討論中國工作的大小事！`,
			groupUrl: '/group/13495',
			imgUrl: '/images/prelogin/group/4.jpg',
		},
		{
			gid: 15007,
			name: '海外工作討論區',
			description: `做為一個海島，台灣人天生就嚮往海洋，充滿探知未知寬廣世界的勇氣。不管你是現在已經在海外工作的台灣人，還是夢想未來前往海外工作的台灣人，歡迎大家一起來分享、討論海外工作的大小事情。`,
			groupUrl: '/group/15007',
			imgUrl: '/images/prelogin/group/6.jpg',
		},
		{
			gid: 28229,
			name: 'Excel大小事',
			description: `擅用Excel創造工作效率，將省下來的時間留給自己。 我們是一群熱愛Excel來簡化工作的人! 我們可以： 1.Excel操作問題免費諮詢 2.Excel檔案改善計劃 3.Excel設計解決方案 市面上很多關於Excel的課程，常常在課程上獲得很多啟發，下了課回到工作上卻仍不知道該從何下手及如何應用。 我們的存在，是直接接收您在Excel使用上的問題，根據您的需求改造Excel資料處理的效率，並增加其附加價值。讓您真正學會Excel在工作上的應用、省下更多時間做其他發展、享受Excel帶來的無限可能。 歡迎留言給我們，讓我們將Excel的神奇力量分享給您~~ 如果不便公開，也可以mail到以下信箱給我們喲： sunkuo75@gmail.com 期待您的加入!! 或是回饋您的意見給我們~ http://goo.gl/forms/tCFbjfmT3wYxnngk1`,
			groupUrl: '/group/28229',
			imgUrl: '/images/prelogin/group/7.jpg',
		},
		{
			gid: 21871,
			name: '簡報好好做',
			description: `「簡報好好做」後面這三個字~好好做,，重音不同或說話者不同就有不同意義，一者是指做好簡報一點都不難，另一則是指簡報做得還有努力的空間。 職場何處不簡報啊！相信每位職場人工作中或多或少都會要用到簡報，不論是向客戶推銷或是向上司報告等，怎樣在更短的時間內完成專業的簡報，而在溝通簡報時又能精準打動聽眾，這真是不易的課題。 希望經由大家多多分享及經驗交流，能讓每個人的簡報力都愈來愈好，那個人競爭力就Up囉！`,
			groupUrl: '/group/21871',
			imgUrl: '/images/prelogin/group/8.jpg',
		},
		{
			gid: 22605,
			name: '好想學英文',
			description: `一起來無壓力學ABC，練練商用英文、旅行英文、新聞英文、生活英文, 專業英文, 出國留學英文, 或是用英文莊孝維; 總之這是一個英文的園地...you are more than welcome to join us!`,
			groupUrl: '/group/22605',
			imgUrl: '/images/prelogin/group/9.jpg',
		},
	],
};

// B版文章資料
const ActivityDataList = {
	lab: [
		{
			aid: '924bf0a-7b77-4cda-b766-3beb9a8a9049',
			title: '404',
			content: '404',
			articleUrl: '/activity/8f94fa35-2a93-4ba7-99cd-eded423da07d',
			imgUrl: '/images/prelogin/activity/1.png',
			isHotArticle: true,
		},
		{
			aid: '47415909-12ba-4059-8398-9ced6e4d31ad',
			title: '【流行英語】take something with a grain of salt 是什麼意思？',
			content: 'grain 是指「米粒/麥粒」，而 take something with a grain/pinch of salt 這個片語，原表示食物加一小撮鹽調味會更好下嚥，後來便引申為「不可盡信」、「對某事遲保留的態度」。 例：You have to take every compliment they bestow on you with a pinch of salt because most are complete exaggerations.（這些好聽的話你都得遲保留態度，因為多數都言過其實。） 另一個和 salt 相關的片語是&nbsp;add salt to something ，幫食物調味，所以意思就是「添加…的趣味」，相當於 spice something up。例：Every time the ladies get together at the reunion, you can be sure they’ll add salt tothe&nbsp;party.（每次這些小姐在同學會重聚，他們一定會讓當天增添不少趣味。）',
			articleUrl: '/activity/47415909-12ba-4059-8398-9ced6e4d31ad',
			imgUrl: '/images/prelogin/activity/2.png',
			isHotArticle: false,
		},
		{
			aid: '47335dce-d099-48dd-bef4-6d2d3e510f06',
			title: '旋緊或鬆開，上萬個螺絲釘製作的 3D 立體畫像',
			content: '一顆顆螺絲釘看起來不太起眼，我們多半都用來固定物體，除此之外小小的螺絲釘還能做什麼呢？藝術家 Bruce Mackley 就使用了上千個螺絲，完成一幅幅大規模的 3D 畫像，深淺不一的效果讓作品既是繪畫也是雕塑！要完成一件巨幅螺絲畫作的過程，不但乏味又具挑戰性，因為 Mackley 最大型的作品「Descent」，就使用超過 2 萬個螺絲，一枚一枚親手依照畫面的深淺去固定，這也代表著花費的時間驚人，一件作品通常需要數百個小時的時間去放置和微調螺絲，經過不斷的旋緊和鬆開的精心調整，才能達到作品想要的色調和陰影。近看是一片有深有淺的螺絲，但遠看後螺絲們的組合卻成一幅畫！側面看更能看出畫面的 3D 效果。因為畫作全由螺絲釘完成，重量就重達 350 磅以上，並有 7 英尺高，Mackley 不僅自製一個巨大畫架來展示作品，也打造一個特製的手推車才能移動作品，從製造到完工和展出真的是工程浩大啊！在作品「Descent」之前，Mackley 的第一項作品其實是「Turning Away」，卻也是使用超過 9,000 個螺絲釘完成，並從這項作品開始，發現自己對螺絲做畫的樂趣。同時，高低不平的螺絲畫也能允許觸碰，讓盲人藉由觸摸來欣賞畫作，更讓藝術多了種互動的可能性。螺絲組成的工業馬賽克風畫作雖然是種不常使用的創作素材，但螺絲不再只有單調枯燥，反而充滿張力與活力！Bruce Mackley',
			articleUrl: '/activity/47335dce-d099-48dd-bef4-6d2d3e510f06',
			imgUrl: '/images/prelogin/activity/3.png',
			isHotArticle: false,
		},
		{
			aid: 'fba6dc1e-63a2-48c7-98dd-a309f89bdefa',
			title: '東京體驗京急電鐵卡拉 OK 包廂！連車掌的麥克風都是真的喔！',
			content: '小時候是不是都會很想坐看看日本火車的駕駛座呢？應該不少人都曾搭上第一列車廂，開心的看著駕駛員怎麼駕駛火車吧？為大家介紹一個可以體驗當上駕駛員或是車掌的「京急電鐵卡拉 OK 包廂」！ 而且是和京急電鐵聯名合作的純正電車包廂喔！ 帶大家搶先一步一探究竟。京急電鐵大力協助的聯名包廂進行聯名合作的「JOYSOUND」，提供了附有從駕駛車廂看出去的景色畫面以及駕駛員的指認呼喚應答和廣播字幕的「鐵道卡拉 OK」影片，成功吸引眾人目光。這次聯名的「京急電鐵卡拉 OK 包廂」，就是要讓大家真實地體驗看看什麼是「鐵道卡拉 OK」。位於 JR 品川車站附近的「JOYSOUND 品川港南口電」設有「京急電鐵卡拉 OK 包廂」，於 7 月 20 日開幕，開放限定只有半年，共兩間包廂。內覽會上還特別找來了京急電鐵的官方吉祥物「Keikyun」，而且和車掌一起擺了個帥氣的 POSE。京急電鐵宣傳部的負責人特別告訴我們，聯名車廂內的物品，全部都是京急電車真正所使用的物品呢。「這可是唯有京急電鐵才能辦成的聯名合作喔，當我們看到包廂的時候也都非常驚訝，因為看起來就和真正的電車車廂沒什麼兩樣」聽京急電鐵這麼一說，實在令人非常期待呢。那麼，就速速來介紹包廂吧。完美詮釋駕駛員、車掌的「真實駕駛員、車掌體驗包廂」首先來介紹最多可容納 12 位客人的「真實駕駛員＆車掌體驗包廂」。包廂的門變成了京急電鐵車頭，造型來自最有人氣的 2100 系電車。腳下可看到「乘車目標」的指示，就是月台上常見的那個指示啊。趕緊打開門看看…印入眼簾的真的是電車車廂！而且牆面兩側播放著車窗外景色的影片，完全是正在搭車的感覺嘛！包廂內擺放了長條座椅，這應該也是真正的電車上會使用的座椅吧？大編有坐過的樣子…。再走進包廂內，就是大家最憧憬的駕駛座啦！據說這也是在真正的電車上所使用過的物品喔。當然駕駛座的椅子也是真正電車上的椅子。眼前擺的就是駕駛操縱桿和麥克風。操縱桿好像是模型，不過仿真度很高。來推推看這個平常根本不可能碰到的操縱桿…。駕駛室內用來廣播的麥克風和聯絡用的無線電都是真實使用過的物品。這種復古的感覺真讓人陶醉呢。車掌所使用的車門開關按鈕，當然也是真的喔。試著按按鈕的時候，還被按鈕有點緊的難按給嚇到，據說按鈕設計按起來比較緊是為了安全考量喔。裝飾在包廂中的車站站名看板，也是真正在京急的站內所使用過的喔。桌子上面有電車路線圖！將包廂中的燈光調暗的話，更有臨場感喔。京急地鐵的員工特地穿了制服在內覽會上供大家拍照，感覺好真實喔。包廂裡連帽子都準備好了，歡迎來到「鐵道卡拉OK」變身成駕駛員或是車掌，來一次從未有過的體驗吧！感受旅行的樂趣「KEIKYU 車內體驗包廂」接下來介紹的是限定 4 人的「KEIKYU 車內體驗包廂」。包廂的門上是藍色的 2100 系列車。來打開門看看…。四人對坐的座椅而且還有車窗，感覺就像上了電車車廂！就是平常常看到的車廂光景啊。車廂內的吊環都是真實使用過的吊環，下意識的跑去抓看看。想要唱一下在「真實駕駛員、車掌體驗包廂」裡也有的「鐵道卡拉 OK」的話，拿起車掌所使用的麥克風高歌一曲吧。包廂內除了一般 KTV 都會有的音箱之外，另外設置了電車裡所使用的音箱，如果使用車掌麥克風的話，聲音會從電車用的音箱出來。播放出來的聲音跟電車車廂裡所聽到的廣播聲音一模一樣。拿這個麥克風用用，幻想自己就是車掌吧。大家像照片中的人那樣到電車包廂來玩的話一定會很嗨！進到這個包廂感覺像要出發去旅行一般，想轉換一下心情時就來這吧！暑假帶家人來玩吧！來體驗電車聯名包廂的話，可以獲得「JOYSOUND 特製車票」，是張很有趣又特別的車票。仔細看可以發現上面印著電話號碼呢…。內覽會上提供以京急電鐵的人氣列車顏色為概念所製成的「KEIKYU電車飲品」，分別取名為「Red train」、「Blue train」和「Yellow train」。飲料所附的杯墊上有掃描即可聽到車掌聲音的 QR code。店內提供的「JOYSOUND 特製鐵路便當」採事先預約制，一邊吃著便當一邊唱「鐵道卡拉 OK」的話，更有臨場感吧。幾乎所有的小朋友都會很想坐看看電車的駕駛座，趁著放暑假帶一家大小來體驗吧！一定會玩得很開心的喔！ 即使你不是鐵道迷也可以樂在其中的「京急電鐵卡拉 OK 包廂」，現在開始接受預約！聽說已經有不少人預約了！進入暑假了，建議大家要早點來預約喔！（西門香央里）京急電鐵卡拉 OK 包廂開放期限：2017 年 7 月 20 日（四)～預計開放半年開放分店：JOYSOUND 品川港南口店（東京）地址：東京都港區 港南2−5−12 品川NBS大廈',
			articleUrl: '/activity/fba6dc1e-63a2-48c7-98dd-a309f89bdefa',
			imgUrl: '/images/prelogin/activity/4.png',
			isHotArticle: false,
		},
		{
			aid: 'da02a66c-be47-4044-946d-7b98f21699bb',
			title: '「洪荒之力」、「九牛二虎之力」、「縛雞之力」、「棉薄之力」，這些力量，英文怎麼說？',
			content: '說到這回里約奧運形象最鮮明的焦點之一，莫過於是以一句「我已經使出洪荒之力了」紅遍網路的大陸泳將傅園慧，這句話剎時成為人人爭相討論和模仿的詞彙，而她的搞怪逗趣表情，更被稱為是行動表情包（walking emoji package）。不過，各家外媒報導顯然也相當喜愛這句「洪荒之力」，相關報導一夕間刷遍各大媒體，但翻譯卻各異其趣，小編為各位做了以下整理，您覺得哪種譯法比較接近原意呢？BBC ：prehistoric force（史前之力）CNN：mystic energy（神秘力量）New York Times: primordial powers（太初之力），primordial 指「原始時期就存在的」，所以這個譯法似乎比前面兩種更貼近中文的原意不過，我們知道，這類新聞或文學用語如果用在日常生活中、作文裡，恐怕只會讓人覺得丈二金剛摸不著頭腦或是浮誇，或許我們也可以用傅園慧的原意「用盡全力」，英文我們可以說：I’ve held nothing back.I’ve used up all my energy.I’ve exerted my utmost energy.I’ve gone&nbsp;all out.此外，除了「洪荒之力」外，你知道「縛雞之力」、「九牛二虎之力」、「棉薄之力」、「回天之力」，這些「力」（force / power / energy）要怎麼翻成英文比較貼切嗎？無「縛雞之力」也就是力氣小到連雞都綁不住，英文我們可以說：cannot punch one’s way out of a paper bag（連紙袋都掙脫不了），是不是很貼切的說法呢？e.g. She is so skinny and weak that she&nbsp;&lt;u&gt;can’t even punch her&nbsp;way out of a paper bag&lt;/u&gt;&nbsp;.「棉薄之力」是形容微小的力量或事情不足掛齒，向別人的道謝表示不客氣，英文我們可以說：That’s the least I could do.e.g.&nbsp;You don’t need to worry about a thing. It’s &lt;u&gt;the least I could do&lt;/u&gt;.「九牛二虎之力」英文千萬別翻成 the strength of nine bulls and two tigers，「費了九牛二虎之力」其實是比喻極大的力量，或投入的大量精力，因此我們可以說：put in / make tremendous efforte.g.&nbsp;Every athlete &lt;u&gt;put in tremendous effort&lt;/u&gt; in their training to qualify for the Olympics.「回天之力」是指挽回嚴重頹勢的力量，所以我們可以翻成：the capability to turn around a desperate situatione.g.&nbsp;A strong person is &lt;u&gt;capable of turning around a desperate situation&lt;/u&gt; and come out a winner.最後在學習英文的路上，「願原力與各位同在」（May the force be with you.）喔～ extra extra extra',
			articleUrl: '/activity/da02a66c-be47-4044-946d-7b98f21699bb',
			imgUrl: '/images/prelogin/activity/5.png',
			isHotArticle: false,
		},
	],
	staging: [
		{
			aid: '66d34192-34c8-4081-bb52-e05bdbb80611',
			title: '什麼是懷舊治療呢？－看看你的懷舊指數有多少吧！',
			content: `今天到了台北某護理之家，帶領機構內的阿公阿嬤們來一場『懷舊治療』的活動饗宴，藉由過往的聲音、音樂、照片，在長輩的腦海中勾勒出過去時代的點點滴滴及生命故事。而這樣的活動不僅僅只是懷舊而已喔！還可以刺激長輩們認知思考、社交互動和肢體動作等等，過程中你將會發現，原來他們比想像中還厲害，並且激發長輩們的潛能喔！不過話說回來，這些經歷是他們本來就會的，只是少了一個『機會』，少了一個『引導』，讓他們發揮自己的『能及優勢』罷了。`,
			articleUrl: '/activity/66d34192-34c8-4081-bb52-e05bdbb80611',
			imgUrl: '/images/prelogin/activity/1.png',
			isHotArticle: true,
		},
		{
			aid: '2b94d60c-6738-49e0-8025-bfc70ad6b227',
			title: '【世界職能治療日】-老師，職能治療師是做什麼的呀？',
			content: '不管是在醫院、社區、機構、居家，很多人常常會問我們說，職能治療師是做什麼的呀？尤其對長輩來說，這就好像新的詞彙一般，在腦中充滿了許多問號，很多人會認為職能治療師是不是就是復健師阿？還是跟職業預防保健有相關呢？那和物理治療師有什麼不同呢？ 根據Ann Mosey在著作『職能治療：職業的組成』，有對『職能』做簡單的定義： 職能是指每人每天參與的活動，並根據個人和文化被命名、組織、賦予價值及意義。職能會是占據個人時間的每件事情，包含照顧自己、享受生活、社交和對社區有經濟貢獻的活動等等。 【參考資料：老人職能治療學，華騰文化，2012】 說的那麼複雜，簡單來說，職能治療所關心的範疇和任何人所經驗的領域有相關，包含任何對他們來說有意義、有目的活動及事件，雖然每個人對於職能的解釋或定義會不太一樣...... 有人說職能治療師=復健師 (這稱呼我有點稍稍不喜歡耶XD) 有人說職能治療師=生活設計師 有人說職能治療師=課程活動老師 有人說職能治療師=生活重建師 有人說職能治療師=健康管理師 有人說職能治療師=圓夢小天使 (我很喜歡這個XD) 雖然定義稱呼千百種，但核心的價值及概念仍是不變的，主要著重在於功能及生活的元素及表現，簡單分為三大領域：日常生活活動；工作和生產性活動；玩樂和休閒娛樂活動。 當然最終目標是讓個案可以獨立自主，藉由提升個案的能力、代償表現或提供環境、輔具、資源的支持，促使他們回歸原來的生活，扮演好有意義的角色及生活作息。和大家共同努力是我們職能的初衷及堅持。(中彰投職能治療日微電影連結，裡面有對職能治療的簡單介紹喔！https://goo.gl/3Oc7O7) 2015年10月27日(星期二)是【世界職能治療日】，再各地都有相關的職能治療的活動，歡迎大家的支持及參與，尤其在10月25日台中森林公園(星期天AM 9:00~ PM 14:00)，有大型的中彰投職能治療日活動喔！歡迎大家到場支持一下^^(附上活動微電影的連結https://goo.gl/3Oc7O7) 以下提供一個最簡單的支持方式，在職能治療師中有個優秀的插畫家，在【歐緹小姐 Ms.OT】 插畫粉絲專頁裡 (https://goo.gl/LE6dv2)，提供了一些可愛的臉書大頭貼給大家使用喔！歡迎在10月的這段期間在你的臉書或塗鴉牆，秀出以下可愛的插圖，表達你對職能治療的支持^.^',
			articleUrl: '/activity/2b94d60c-6738-49e0-8025-bfc70ad6b227',
			imgUrl: '/images/prelogin/activity/2.png',
			isHotArticle: false,
		},
		{
			aid: '6fb2d48d-e598-45d7-b248-ba187448c8e0',
			title: '智慧科技體感互動，讓長輩邊玩邊復健。',
			content: '過去在醫院復健科工作的時後，長輩們來到復健室就像進入工作室跑台一樣﹝某些還要預約排隊呢！﹞，如標準作業流程般的，一站接著一站地完成每日的復健工作﹝腳踏車→跑步機→推拉箱→電療熱敷等等﹞，大家無不把握黃金期，希望能得到最好的復原。但過了半年一年後，這樣日復一日到復健室報到的生活，以及重複的復健活動，常常讓長輩們漸漸失去戰鬥力及信心，或對於復健無感、無趣而漸漸失去動力。曾經想利用遊戲和體感互動產品，來增加復健的趣味及長輩參與的動機，所以就想透過現有的產品，再經過治療師的活動分級調整應用在長輩的復健運動上，例如大家耳熟能詳的Wii﹝遙控器+平衡器﹞、Kinect﹝大肢體體感控制，甚至偶然發現的相關科技產品Myo﹝體感偵測手環﹞、Leap Motion﹝手部手指體感控制﹞、豚鼠體感游戲手環等等，但很多因為醫療環境考量及口袋不深的因素，僅能在腦中天馬行空地想像了。',
			articleUrl: '/activity/6fb2d48d-e598-45d7-b248-ba187448c8e0',
			imgUrl: '/images/prelogin/activity/3.png',
			isHotArticle: false,
		},
		{
			aid: 'e92e36c4-fd56-4fd4-b07b-64741b186bf5',
			title: 'greeting',
			content: `What you do in this world is a matter of no consequence. The question is what can you make people believe you have done.
			My mind," he said, "rebels at stagnation. Give me problems, give me work, give me the most abstruse cryptogram or the most intricate analysis, and I am in my own proper atmosphere. I can dispense then with artificial stimulants. But I abhor the dull routine of existence. I crave for mental exaltation. That is why I have chosen my own particular profession, or rather created it, for I am the only one in the world.`,
			articleUrl: '/activity/e92e36c4-fd56-4fd4-b07b-64741b186bf5',
			imgUrl: '/images/prelogin/activity/4.png',
			isHotArticle: false,
		},
		{
			aid: '92792f92-c040-48e3-abed-4affaa157d02',
			title: '大補帖個人文章加影片1',
			content: '大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1大補帖個人文章加影片1',
			articleUrl: '/activity/92792f92-c040-48e3-abed-4affaa157d02',
			imgUrl: '/images/prelogin/activity/5.png',
			isHotArticle: false,
		},
	],
	production: [
		{
			aid: '543d9c3e-61e5-493f-8fda-862082b09bcb',
			title: '大學、研究所畢業，薪水大不同？',
			content: `大學生滿地跑，要唸研究所嗎？
			有人認為讀完研究所薪水會比較高，高多少？二千、一萬、二萬...？
			小編聽聞各方答案後，認為替大家解惑時間到。
			大學、碩士學歷的就任新職薪資
			學歷高低，薪水真的有差嗎？
			以平均薪資統計來說，答案是有的。
			看看下圖，市場上的工作人口，大學與研究所學歷的平均薪資統計，研究所畢業人口平均薪資多了 7 千台幣！但千萬別認為讀完研究所就可以加薪 7千，老闆、面試官可是會覺得你傻傻的呀。
			工作經驗值也是老闆選人的考量要點！
			這裡的 7,700 差額，指職場菜鳥和前輩，在任職(轉換)一份新工作時，研究所學歷人口平均月薪比學士學歷多了 7,700 台幣。我們必須了解，這 7,700 的價值轉換，不單來自於學歷，還包含了過去的工作經驗、工作職務的學歷要求等因素。
			`,
			articleUrl: '/activity/543d9c3e-61e5-493f-8fda-862082b09bcb',
			imgUrl: '/images/prelogin/activity/1.png',
			isHotArticle: true,
		},
		{
			aid: 'b0499932-7624-4c37-8c2e-64ed937647a5 ',
			title: '【我在大陸的日子】求職的世界(上)',
			content: `親愛的大家晚安啊～昨天說完了工作人員，今天來說下＂在大陸求職＂吧！
			在大陸網路業這塊，找工作大概是這樣的過程：
			
			Ps.大陸的簡歷＝台灣的履歷
			●不同人群的求職路線：
			就我所知，剛畢業的應屆畢業生走的校招，與有一定工作經驗走的社招或跳槽，他們面對的境遇是完全不同的。
			
			有一定工作經驗，也就是我大多數的大陸朋友們，很多都是畢業後參加校招，趕上大陸網路業蓬勃發展期進了後來發展比較好的公司（例如網易、完美、盛大、人人、新浪...），他們後來換工作時多半在同領域移動，因此當他們挪動時，多半是＂朋友介紹去了別的公司＂，＂獵頭挖角去別的公司＂或著＂自己創業＂。
			就我所知好像很少自己投簡歷的．雖然看起來體面，但其實他們面臨的挑戰也是很大，是一群令人敬佩的人們。
			而這裡的應屆畢業生呢…我只能說，能在校招進公司的孩子必有過人之處！
			
			我在樂元素那會曾見過校招結束時人資搬回來幾大箱子履歷+他們做的題，一群製作人圍著這些箱子在挑人。我在旁邊翻看了一會，深深覺得…本來能在北京念大學的就是各省學霸，現在一個個卯起勁展示自己，感覺每個都好厲害。
			然而這樣的一堆資料，都是用一種＂挑剔＂的態度來萬裡挑一，這樣被篩出來的人，是怎樣的一群人呢？
			`,
			articleUrl: '/activity/b0499932-7624-4c37-8c2e-64ed937647a5 ',
			imgUrl: '/images/prelogin/activity/2.png',
			isHotArticle: false,
		},
		{
			aid: '472003f3-e0bb-4778-90e5-c5d169540b03',
			title: '【活動策展人的一年】',
			content: `這幾天翻了一下，重新讀了幾次這篇寫於一年前的文章：
			【第2屆 百工的一天】活動策展人的一天
			https://goo.gl/1eJ8ad 
			一年後的現在來看，好像大體還是差不多。這次來寫寫，如果把尺度放大，一個 "活動策展人的一年" 大概會是什麼樣子，不過這都是個人經驗，不能代表全體。
			剛好去年這篇文章有截圖，跟現在的做個對比，立刻可以看到這一年來走了多遠。
			多了 70場活動，頁面多了 13萬瀏覽次數、追蹤人數多了 2800。
			當然這其中少不了許多其他同事夥伴的協助～
			當尺度拉大到一年，就不能只是單場單場地思考，一定要有更多的規劃。
			身為活動策展人，你必須為你的對象想得更多，無論是活動參加者 or 所謂的活動提供者 (講師或其他協辦單位)。在活動中，他們到底能得到什麼？
			簡而言之，活動策展人是：為某樣東西提供觀點、賦予意義並分享給眾人的人。
			那麼我們得開始思考，一件事情能有幾種觀點？ 
			有哪些事情與觀點可以分享給別人？
			可以怎麼分享？
			要怎麼分享才會更深刻？
			於是會開始出現主題式、系列式、或至少相關性很強的各種活動。也許是描述同一主題的不同階段、不同角度，在過程中不僅要打開參與者視野，也得讓這影響力能打得更深。
			`,
			articleUrl: '/activity/472003f3-e0bb-4778-90e5-c5d169540b03',
			imgUrl: '/images/prelogin/activity/3.png',
			isHotArticle: false,
		},
		{
			aid: '20a79fe8-b8f0-413c-b3f3-20264e69618a',
			title: '雇主每月預留新進勞工工資一成待做滿六個月後發還可以嗎？',
			content: `讀者問到： 我到某公司求職面試，老闆怕我進公司卻待不久，便說以後每個月工資要預留 10%，直到做滿六個月才要把預留的工資還給我，當時我為了想得到這一份工作，便在口頭上答應老闆，但當時並未簽訂合約。請問該公司這麼做合法嗎？
			該公司的上述做法，無非是想利用預留10%工資，做為留任新進勞工的牽制手段。倘新進勞工提供勞務期間未滿六個月即行離職，該筆預留工資勢將成為新進勞工提前離職所生違約金或賠償費用的代償物。
			依照勞動基準法第26條規定：「雇主不得預扣勞工工資作為違約金或賠償費用。」，雇主違反時，依照勞動基準法第78條第2項規定：「違反…第26條…規定者，處新臺幣9萬元以上45萬元以下罰鍰。」、同法第80條之1第1項規定：「違反本法經主管機關處以罰鍰者，主管機關應公布其事業單位或事業主之名稱、負責人姓名，並限期令其改善；屆期未改善者，應按次處罰。」
			改制前行政院勞工委員會民國89年7月28日（89）台勞動二字第0031343號函釋：「同法第26條規定，雇主不得預扣勞工工資作為違約金或賠償費用。所稱「預扣勞工工資」，係指在違約、賠償等事實未發生或其事實已發生，但責任歸屬、範圍大小、金額多寡等未確定前，雇主預先扣發勞工工資作為違約金或賠償費用。」`,
			articleUrl: '/activity/20a79fe8-b8f0-413c-b3f3-20264e69618a',
			imgUrl: '/images/prelogin/activity/4.png',
			isHotArticle: false,
		},
		{
			aid: '6110b6b2-2004-48a9-acf3-17b76e9658b5',
			title: '當 PM 的 1001 天教我的事 ：了解趨勢',
			content: `了解趨勢，這次從產品面來說
			
			第一個是技術或平台，假設 App 如果你在 2012 年，掌握一個需求，透過 app 做得不錯，你可能就起來了，但在 2017 年，同樣一個需求，可能早就有先進者了，這個時候你必須做的比他好，或者他已經完成統治整個市場，你做再好也沒有用
			
			第二個是渠道，一個渠道在早期會有甜蜜點，只要抓到，可能可以用很少的成本去觸及到用戶，但過了那個時期，一模一樣的做法，你可能就變成完全沒效果
			
			那作為產品人，要怎麼因應呢，第一個要對新的趨勢，渠道，平台主動瞭解，你目前解決的需求，有辦法透過新的趨勢，有更好的解決方法嗎？有沒有辦法在新的平台，有些新的用戶接觸的方法？
			
			有一個我最近非常喜歡的例子 4foodie，這是一個由四個女生經營的 IG 帳號，這個帳號基本解決的需求，就是想要找餐廳，找好吃的東西，過去人們比較多是這樣的決策模式
			根據活動 (朋友聚餐，約會) ，類型，地點-> 找到餐廳 -> 評價機制 -> 去吃
			評價機制 -> 對餐廳感興趣 -> 找到適合的時機 -> 去吃
			但是基於 IG 的特性，圖片與瀏覽為主，加上高品質的圖，易理解的評分機制，讓使用者產生新的一種特有的模式，加上 IG 本身的傳播力，馬上就變得火紅
			透過圖片對餐點感興趣 -> 評價機制 ->去找適合的時機 -> 去吃
			花些時間了解趨勢，解讀趨勢，這可能會讓你事半功倍`,
			articleUrl: '/activity/6110b6b2-2004-48a9-acf3-17b76e9658b5',
			imgUrl: '/images/prelogin/activity/5.png',
			isHotArticle: false,
		},
	],
};

// B版人脈資料
const ConnectionDataList = {
	lab: [
		{
			pid: 232369,
			name: '山姆威默斯',
			title: '404',
			company: '404',
			avatarUrl: '/images/prelogin/connection/lab/232369.jpg',
			profileUrl: '/profile/232369',
		},
		{
			pid: 232368,
			name: '主網羅波鐵根生',
			title: '塔羅占卜師',
			company: '達方電子股份有限公司',
			avatarUrl: '/images/prelogin/connection/lab/232368.jpg',
			profileUrl: '/profile/232368',
		},
		{
			pid: 100019,
			name: '宇智波佐助',
			title: '對逃忍的追捕術-暗部必修',
			company: '木葉忍者學校',
			avatarUrl: '/images/prelogin/connection/lab/100019.jpg',
			profileUrl: '/profile/100019',
		},
		{
			pid: 237839,
			name: '游豆腐',
			title: 'THE IT GUY',
			company: 'ITCROWD',
			avatarUrl: '/images/prelogin/connection/lab/237839.jpg',
			profileUrl: '/profile/237839',
		},
		{
			pid: 108206,
			name: '♞熊麻吉♞',
			title: '產品經理 product manager',
			company: '104職涯社群',
			avatarUrl: '/images/prelogin/connection/lab/108206.jpg',
			profileUrl: '/profile/108206',
		},
		{
			pid: 108189,
			name: '安古娃測試',
			title: 'Sergeant',
			company: 'City Watch',
			avatarUrl: '/images/prelogin/connection/lab/108189.jpg',
			profileUrl: '/profile/108189',
		},
		{
			pid: 237728,
			name: '鍋巴',
			title: '產品經理',
			company: '大同電鍋',
			avatarUrl: '/images/prelogin/connection/lab/237728.jpg',
			profileUrl: '/profile/237728',
		},
		{
			pid: 108191,
			name: '班奈狄克康柏拜區',
			title: '艦長',
			company: '銀河艦隊',
			avatarUrl: '/images/prelogin/connection/lab/108191.jpg',
			profileUrl: '/profile/108191',
		},
		{
			pid: 108332,
			name: '豪斯醫生',
			title: '總務',
			company: 'HTC',
			avatarUrl: '/images/prelogin/connection/lab/108332.jpg',
			profileUrl: '/profile/108332',
		},
		{
			pid: 100024,
			name: '旗木卡卡西-木葉白牙',
			title: '育苗人員',
			company: '農友種苗股份有限公司',
			avatarUrl: '/images/prelogin/connection/lab/100024.jpg',
			profileUrl: '/profile/100024',
		},
	],
	staging: [
		{
			pid: 614990,
			name: 'JennyTseng',
			title: '404',
			company: '404',
			avatarUrl: '/images/prelogin/connection/staging/614990.jpg',
			profileUrl: '/profile/614990',
		},
		{
			pid: 1079002,
			name: '何政儒',
			title: '管理部副理',
			company: '瀚星百貨股份有限公司',
			avatarUrl: '/images/prelogin/connection/staging/1079002.jpg',
			profileUrl: '/profile/1079002',
		},
		{
			pid: 1356778,
			name: '陳威廷 Frank Chen',
			title: 'Data Scientist',
			company: '104 Corporation',
			avatarUrl: '/images/prelogin/connection/staging/1356778.jpg',
			profileUrl: '/profile/1356778',
		},
		{
			pid: 1326172,
			name: '陳伯軒',
			title: '客務組主任 ',
			company: '高雄華園大飯店',
			avatarUrl: '/images/prelogin/connection/staging/1326172.jpg',
			profileUrl: '/profile/1326172',
		},
		{
			pid: 2997540,
			name: '江文馨',
			title: '會計',
			company: '一零四資訊科技',
			avatarUrl: '/images/prelogin/connection/staging/2997540.jpg',
			profileUrl: '/profile/2997540',
		},
		{
			pid: 126255,
			name: '蕭甫明',
			title: '技術主管',
			company: '104 人力銀行',
			avatarUrl: '/images/prelogin/connection/staging/126255.jpg',
			profileUrl: '/profile/126255',
		},
		{
			pid: 9467679,
			name: '查湯惠',
			title: '設計師',
			company: '奧利佛大碼服裝店',
			avatarUrl: '/images/prelogin/connection/staging/9467679.jpg',
			profileUrl: '/profile/9467679',
		},
		{
			pid: 9467687,
			name: '茉莉鴨啼',
			title: 'CEO',
			company: '莫氏詐騙全球集團',
			avatarUrl: '/images/prelogin/connection/staging/9467687.jpg',
			profileUrl: '/profile/9467687',
		},
		{
			pid: 9468457,
			name: '土堯稽',
			title: 'none',
			company: 'none',
			avatarUrl: '/images/prelogin/connection/staging/9468457.jpg',
			profileUrl: '/profile/9468457',
		},
		{
			pid: 9467511,
			name: '蝦洛克',
			title: '金融信用評估',
			company: '公司2',
			avatarUrl: '/images/prelogin/connection/staging/9467511.jpg',
			profileUrl: '/profile/9467511',
		},
	],
	production: [
		{
			pid: 7775809,
			name: '吳東東',
			title: '活動總監',
			company: 'CLBC',
			avatarUrl: '/images/prelogin/connection/production/7775809.jpg',
			profileUrl: '/profile/7775809',
		},
		{
			pid: 950651,
			name: '吳佩穎',
			title: 'UX 高級體驗設計師',
			company: 'TANG唐碩體驗創新諮詢',
			avatarUrl: '/images/prelogin/connection/production/950651.jpg',
			profileUrl: '/profile/950651',
		},
		{
			pid: 2524393,
			name: '蕭文閔',
			title: '產品經理',
			company: '北京磨鐵數盟信息技術有線公司',
			avatarUrl: '/images/prelogin/connection/production/2524393.jpg',
			profileUrl: '/profile/2524393',
		},
		{
			pid: 5179727,
			name: '溫志傑',
			title: 'User Acquisition & Data Analysis',
			company: '玩美移動股份有限公司',
			avatarUrl: '/images/prelogin/connection/production/5179727.jpg',
			profileUrl: '/profile/5179727',
		},
		{
			pid: 10196363,
			name: '愛莉蝦',
			title: '行銷公關經理',
			company: '資廚管理顧問股份有限公司',
			avatarUrl: '/images/prelogin/connection/production/10196363.jpg',
			profileUrl: '/profile/10196363',
		},
		{
			pid: 3354265,
			name: '陸悅寧',
			title: '媒體公關',
			company: '千晶文化事業股份有限公司',
			avatarUrl: '/images/prelogin/connection/production/3354265.jpg',
			profileUrl: '/profile/3354265',
		},
		{
			pid: 880229,
			name: '游舒帆',
			title: '賦閒在家',
			company: '自由工作者',
			avatarUrl: '/images/prelogin/connection/production/880229.jpg',
			profileUrl: '/profile/880229',
		},
		{
			pid: 447229,
			name: '謝守澤',
			title: 'Service planner',
			company: 'Gogolook',
			avatarUrl: '/images/prelogin/connection/production/447229.jpg',
			profileUrl: '/profile/447229',
		},
		{
			pid: 10165145,
			name: '周育如',
			title: '負責人',
			company: '創思流管理諮詢有限公司',
			avatarUrl: '/images/prelogin/connection/production/10165145.jpg',
			profileUrl: '/profile/10165145',
		},
		{
			pid: 1956897,
			name: '林文傑',
			title: '網銷暨行銷經理',
			company: '燦坤實業股份有限公司',
			avatarUrl: '/images/prelogin/connection/production/1956897.jpg',
			profileUrl: '/profile/1956897',
		},
	],
};

export { FeatureDataList, GroupDataList, ActivityDataList, ConnectionDataList };
