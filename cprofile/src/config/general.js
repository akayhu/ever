// local、lab、staging、production
const stage = process.env.REACT_APP_STAGE || 'local';
const localPort = process.env.REACT_APP_PORT || 3000;
const hostMap = {
	site: {
		local: `local.plus.104-dev.com.tw:${localPort}`,
		lab: 'plus.104-dev.com.tw',
		staging: 'plus.104-staging.com.tw',
		production: 'plus.104.com.tw',
	},
	api: {
		local: `local.plus.104-dev.com.tw:${localPort}`, // proxy or mock
		lab: 'c1.plus.104-dev.com.tw',
		staging: 'c1.plus.104-staging.com.tw',
		production: 'c1.plus.104.com.tw',
	},
	s3: {
		local: 'ori.doc.104-dev.com.tw',
		lab: 'ori.doc.104-dev.com.tw',
		staging: 'ori.doc.104-staging.com.tw',
		production: 'ori.doc.104.com.tw',
	},
	accounts: {
		local: 'accounts.104-dev.com.tw/hello',
		lab: 'accounts.104-dev.com.tw/hello',
		staging: 'accounts.104-staging.com.tw/hello',
		production: 'accounts.104.com.tw/hello',
	},
	main: {
		local: 'www.104-dev.com.tw',
		lab: 'www.104-dev.com.tw',
		staging: 'www.104-staging.com.tw',
		production: 'www.104.com.tw',
	},
	static: {
		local: 'static.104-dev.com.tw',
		lab: 'static.104-dev.com.tw',
		staging: 'static.104-staging.com.tw',
		production: 'static.104.com.tw',
	},
	my104: {
		local: 'pda.104-dev.com.tw',
		lab: 'pda.104-dev.com.tw',
		staging: 'pda.104-staging.com.tw',
		production: 'pda.104.com.tw',
	}
};
const saasMap = {
	// 有分環境
	logrocket: {
		local: '74k1bh/c-profile-dev',
		lab: '74k1bh/c-profile-dev',
		staging: '74k1bh/c-profile-staging',
		production: '74k1bh/c-profile-production',
	},
	pusher: {
		local: {
			appId: '546609',
			key: '358edcfabdc5025fe562',
			cluster: 'ap1',
		},
		lab: {
			appId: '546609',
			key: '358edcfabdc5025fe562',
			cluster: 'ap1',
		},
		staging: {
			appId: '546610',
			key: '6928d2b40553f63b6b79',
			cluster: 'ap1',
		},
		production: {
			appId: '546611',
			key: '945e7c95206b7d1e5583',
			cluster: 'ap1',
		},
	},
	// 沒分環境
	behance: 'L9QuC9gf2h1MrISYsc1j52ge1BPMWfbQ',
	drift: 'kwhzgym9kmeg',
	wootric: 'NPS-81013d7d',
};

let generalConfig = {
	accountsUrl: `//${hostMap.accounts[stage]}`,
	siteUrl: `//${hostMap.site[stage]}`,
	api: `//${hostMap.api[stage]}/ajax`,
	s3: `//${hostMap.s3[stage]}`,
	authors: `//${hostMap.site[stage]}/authors`,
	staticUrl: `//${hostMap.static[stage]}`,
	e104Url: `//${hostMap.main[stage]}`,
	my104Url: `//${hostMap.my104[stage]}`,
	e104Domain: `${hostMap.main[stage]}`,
	apnum: 'F0096',
	endpoints: {
		login: `//${hostMap.api[stage]}/auth/login?relayState=`,
		logout: `//${hostMap.api[stage]}/auth/logout?relayState=`,
		pusher: `//${hostMap.api[stage]}/pusher/auth`,
		github: `//${hostMap.api[stage]}/connector/github`,
	},
	logo: `//${hostMap.main[stage]}/upload1/logo/1104_companyId.gif`,
	pusher: saasMap.pusher[stage],
	logrocket: saasMap.logrocket[stage],
	behance: saasMap.behance,
	drift: saasMap.drift,
	wootric: saasMap.wootric,
	saasBypassPath: ['/profile/:pid?preview'],
};

export default generalConfig;
