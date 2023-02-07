const express = require('express');
const connector = express.Router();
const { fromJS } = require('immutable');
const { resTemplate, warnTemplate, errorTemplate } = require('./util');

const rawDataMap = {
	behance: {
		projects: [
			{
				id: 67813927,
				name: '\u53f0\u7063\u5927\u5b78\u5916\u62cd',
				published_on: 1531381882,
				created_on: 1531381751,
				modified_on: 1531382074,
				url: 'https://www.behance.net/gallery/67813927/_',
				privacy: 'public',
				fields: ['Photography'],
				covers: {
					404: 'https://mir-s3-cdn-cf.behance.net/projects/404/ff8f7567813927.Y3JvcCwxMTkyLDkzMywzMiww.jpg',
					202: 'https://mir-s3-cdn-cf.behance.net/projects/202/ff8f7567813927.Y3JvcCwxMTkyLDkzMywzMiww.jpg',
					230: 'https://mir-s3-cdn-cf.behance.net/projects/230/ff8f7567813927.Y3JvcCwxMTkyLDkzMywzMiww.jpg',
					115: 'https://mir-s3-cdn-cf.behance.net/projects/115/ff8f7567813927.Y3JvcCwxMTkyLDkzMywzMiww.jpg',
					original:
						'https://mir-s3-cdn-cf.behance.net/projects/original/ff8f7567813927.Y3JvcCwxMTkyLDkzMywzMiww.jpg',
				},
				mature_content: 0,
				mature_access: 'allowed',
				owners: [
					{
						id: 174612723,
						first_name: 'Kay',
						last_name: 'A',
						username: 'god75615a1df',
						city: '',
						state: '',
						country: 'Taiwan',
						location: 'Taiwan',
						company: '',
						occupation: '',
						created_on: 1531277235,
						url: 'https://www.behance.net/god75615a1df',
						images: {
							'50':
								'https://a5.behance.net/60e9475ac7692657df6a0e2d1b8dc9488fcc67ba/img/profile/no-image-50.jpg?cb=264615658',
							'115':
								'https://a5.behance.net/60e9475ac7692657df6a0e2d1b8dc9488fcc67ba/img/profile/no-image-115.jpg?cb=264615658',
							'138':
								'https://a5.behance.net/60e9475ac7692657df6a0e2d1b8dc9488fcc67ba/img/profile/no-image-138.jpg?cb=264615658',
						},
						display_name: 'Kay A',
						fields: ['Photography'],
						has_default_image: 1,
						website: '',
						stats: {
							followers: 0,
							following: 0,
							appreciations: 2,
							views: 9,
							comments: 0,
						},
					},
				],
				stats: {
					views: 2,
					appreciations: 0,
					comments: 0,
				},
				conceived_on: 1531353600,
			},
		],
	},
	github: {
		pid: 239876,
		type: 'GITHUB',
		createTimestamp: Date.now(),
		githubURL: 'https://github.com/dazedbear',
		publicRepoCount: 26,
		publicGistCount: 3,
		followersCount: 0,
		repoList: [
			{
				repoName: '104di17a-angus',
				repoURL: 'https://github.com/dazedbear/104di17a-angus',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['Shell', 'JavaScript'],
			},
			{
				repoName: 'create-react-app',
				repoURL: 'https://github.com/dazedbear/create-react-app',
				repoDescription: 'Create React apps with no build configuration.',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['Shell', 'CSS', 'JavaScript', 'AppleScript', 'HTML'],
			},
			{
				repoName: 'd3',
				repoURL: 'https://github.com/dazedbear/d3',
				repoDescription: 'A JavaScript visualization library for HTML and SVG.',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'Makefile', 'JavaScript'],
			},
			{
				repoName: 'dazedbear.github.io',
				repoURL: 'https://github.com/dazedbear/dazedbear.github.io',
				repoDescription: 'Playground for dazedbaer ',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['JavaScript', 'HTML'],
			},
			{
				repoName: 'db-devops-demo-01',
				repoURL: 'https://github.com/dazedbear/db-devops-demo-01',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['JavaScript'],
			},
			{
				repoName: 'dbdemo',
				repoURL: 'https://github.com/dazedbear/dbdemo',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 1,
				repoLanguages: [],
			},
			{
				repoName: 'events-manager-custom',
				repoURL: 'https://github.com/dazedbear/events-manager-custom',
				repoDescription: 'custom wordpress events manager plugin for emma',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'Shell', 'JavaScript', 'PHP', 'HTML'],
			},
			{
				repoName: 'f2e-technote',
				repoURL: 'https://github.com/dazedbear/f2e-technote',
				repoDescription: '讀書心得',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['JavaScript'],
			},
			{
				repoName: 'facebook-cache-demo',
				repoURL: 'https://github.com/dazedbear/facebook-cache-demo',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['JavaScript', 'HTML'],
			},
			{
				repoName: 'Learn-Sass-in-90-days',
				repoURL: 'https://github.com/dazedbear/Learn-Sass-in-90-days',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'leetcode-logbook',
				repoURL: 'https://github.com/dazedbear/leetcode-logbook',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'mabi-web-daw',
				repoURL: 'https://github.com/dazedbear/mabi-web-daw',
				repoDescription: 'editing mabinogi music scores like DAW in browser',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'material-design-icons',
				repoURL: 'https://github.com/dazedbear/material-design-icons',
				repoDescription: 'Material Design icons by Google',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS'],
			},
			{
				repoName: 'music-tech',
				repoURL: 'https://github.com/dazedbear/music-tech',
				repoDescription:
					'exercises and technote for Web Audio, MIDI API and related frameworks',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'musictree',
				repoURL: 'https://github.com/dazedbear/musictree',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'musictree_test',
				repoURL: 'https://github.com/dazedbear/musictree_test',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'JavaScript'],
			},
			{
				repoName: 'NCKU_WebDesign',
				repoURL: 'https://github.com/dazedbear/NCKU_WebDesign',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 1,
				repoLanguages: [],
			},
			{
				repoName: 'note-service-demo',
				repoURL: 'https://github.com/dazedbear/note-service-demo',
				repoDescription:
					'Cross Devices Personal Markdown Note Service with React Native, remoteStorage',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'react-table-performance-tuning',
				repoURL: 'https://github.com/dazedbear/react-table-performance-tuning',
				repoDescription: '[JSDC 2017] 趨勢科技 - 誰是效能王',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'JavaScript'],
			},
			{
				repoName: 'redux-observable-async-demo',
				repoURL: 'https://github.com/dazedbear/redux-observable-async-demo',
				repoDescription: 'redux-observable-async-demo',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'JavaScript', 'HTML'],
			},
			{
				repoName: 'startfucks',
				repoURL: 'https://github.com/dazedbear/startfucks',
				repoDescription: 'di17a topic',
				repoWatchers: 1,
				repoStargazers: 1,
				repoForks: 0,
				repoLanguages: ['CSS', 'JavaScript', 'HTML'],
			},
			{
				repoName: 'test',
				repoURL: 'https://github.com/dazedbear/test',
				repoDescription: 'test test test',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['JavaScript'],
			},
			{
				repoName: 'travis-ci-practice',
				repoURL: 'https://github.com/dazedbear/travis-ci-practice',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'JavaScript', 'HTML'],
			},
			{
				repoName: 'web-learning-resource-note',
				repoURL: 'https://github.com/dazedbear/web-learning-resource-note',
				repoDescription: 'Web學習資源筆記',
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: [],
			},
			{
				repoName: 'wp-plugins-demo',
				repoURL: 'https://github.com/dazedbear/wp-plugins-demo',
				repoDescription: 'Develop WP Theme with Tranditional Ways',
				repoWatchers: 1,
				repoStargazers: 1,
				repoForks: 0,
				repoLanguages: ['PHP'],
			},
			{
				repoName: 'wp-themes-demo',
				repoURL: 'https://github.com/dazedbear/wp-themes-demo',
				repoDescription: null,
				repoWatchers: 0,
				repoStargazers: 0,
				repoForks: 0,
				repoLanguages: ['CSS', 'Shell', 'JavaScript', 'PHP', 'HTML'],
			},
			{
				repoName: 'family_tree',
				repoURL: 'https://github.com/HarkuLi/family_tree',
				repoDescription: null,
				repoWatchers: 1,
				repoStargazers: 1,
				repoForks: 0,
				repoLanguages: ['CSS', 'JavaScript', 'HTML'],
			},
		],
	},
};

let state = fromJS({
	github: {},
	behance: {},
});

/**
 * 取得初始化 Github 資料
 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/getInitGitHubDataUsingGET
 */
connector.get('/github', (req, res) => {
	res.json(resTemplate(rawDataMap.github));
});

connector
	.route('/github/snapshot')
	/**
	 * 取出 GitHub 快照
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/getGitHubEntityUsingGET
	 */
	.get((req, res) => {
		if (!state.get('github').size) {
			return res.status(404).json(warnTemplate('無任何 github 快照'));
		}
		return res.json(resTemplate(state.get('github').toJS()));
	})

	/**
	 * 新增 GitHub 快照
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/upsertGithubSnapshotUsingPOST
	 */
	.post((req, res) => {
		const snapshot = req.body;
		state = state.set('github', fromJS(snapshot));
		res.status(202).json(resTemplate(true));
	})

	/**
	 * 刪除 Github 快照
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/deleteGithubEntityUsingDELETE
	 */
	.delete((req, res) => {
		state = state.set('github', fromJS({}));
		res.status(204);
	});

/**
 * 取得初始化 Behance 資料
 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/getInitBehanceDataUsingGET
 */
connector.get('/behance', (req, res) => {
	res.json(resTemplate(rawDataMap.behance));
});

connector
	.route('/behance/snapshot')
	/**
	 * 取出 Behance 快照
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/getBehanceEntityUsingGET
	 */
	.get((req, res) => {
		if (!state.get('behance').size) {
			return res.status(404).json(warnTemplate('無任何 behance 快照'));
		}
		return res.json(resTemplate(state.get('behance').toJS()));
	})

	/**
	 * 新增 Behance 快照
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/upsertBehanceEntityUsingPOST
	 */
	.post((req, res) => {
		const snapshot = req.body;
		state = state.setIn('behance', fromJS(snapshot));
		res.status(202).json(resTemplate(true));
	})

	/**
	 * 刪除 Behance 快照
	 * https://c1.profile.104-dev.com.tw/swagger-ui.html#/rest-connector-controller/deleteBehanceEntityUsingDELETE
	 */
	.delete((req, res) => {
		state = state.set('behance', fromJS({}));
		res.status(204);
	});

module.exports = connector;
