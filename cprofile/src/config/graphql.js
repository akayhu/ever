import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { RestLink } from "apollo-link-rest";
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import generalConfig from 'config/general';

/**
 * Client: graphQL 初始設定
 *
 * middleware & afterware => https://www.apollographql.com/docs/react/advanced/network-layer.html#linkMiddleware
 */
export const client = new ApolloClient({
	link: ApolloLink.from([
		// error log middleware
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) =>
					console.error(
						`[GraphQL error]: Message: ${message}, Location: `,
						locations,
						`Path: `,
						path
					)
				);
			if (networkError) console.error(`[Network error]: ${networkError}`);
		}),

		// for RESTful resporce
		// new RestLink({
		//   uri: `${generalConfig.api}`,
		//   customFetch: async (uri, options) => {
		//     const json = await fetch(uri, options)
		//       .then(response => response.json())
		//       .then(payload => payload.response || { http_code: 404, error: payload })
		//       .catch(error => ({ http_code: 500, error }));
		//     return new Response(JSON.stringify(json), {
		//       status: json.http_code || 200,
		//       headers: {
		// 				'Content-Type': 'application/json',
		// 			}
		//     });
		//   }
		// }),

		// for graphql resource
		new createHttpLink({
			uri: `${generalConfig.api}/graphql`,
			credentials: 'include',
		}),
	]),
	cache: new InMemoryCache(),
});

/**
 * Fragment
 */
export const Fragments = {
	blocks: gql`
		fragment BlockModel on Block {
			uniKey: blockId
			blockType: type
			templateType: template
			visibility
			mask
		}
	`,
	basic: gql`
		fragment UserInfoModel on UserInfo {
			userName
			introduction
			avatarFileId
			coverFileId
			avatarFileUrls
			coverFileUrls
			title
			organization
			location
		}
	`,
	experiences: gql`
		fragment ExperienceInfoModel on Experience {
			expId
			companyName
			jobName
			startYear
			startMonth
			endYear
			endMonth
			status
			location
			description
			talentList
		}
	`,
	educations: gql`
		fragment EducationInfoModel on Education {
			eduId
			schoolName
			majorName
			degree
			location
			startYear
			startMonth
			endYear
			endMonth
		}
	`,
	behance: gql`
		fragment BehanceInfoModel on BehanceSnapshot {
			projectList {
				projectName
				projectURL
				projectCover_115
				projectCover_202
				projectCover_230
				projectCover_404
				projectCover_original
				projectViews
				projectAppreciations
				projectComments
				projectFields
			}
		}
	`,
	github: gql`
		fragment GithubInfoModel on GithubSnapshot {
			githubURL
			publicRepoCount
			publicGistCount
			followersCount
			repoList {
				repoName
				repoURL
				repoDescription
				repoWatchers
				repoStargazers
				repoForks
			}
		}
	`,
	customs: gql`
		fragment CustomInfoModel on Custom {
			customId
			fileId
			title
			description
			fileUrlMap
			snapshotFileId
			snapshotFileUrlMap
		}
	`,
	galleries: gql`
		fragment GalleryInfoModel on GalleryResponse {
			galleryId
			createTimestamp
			title
			fileId
			fileUrlMap
			description
			convertType
		}
	`,
	honors: gql`
		fragment HonorInfoModel on HonorResponse {
			honorId
			title
			description
			startYear
			startMonth
			endYear
			endMonth
			talentList
			fileId
			fileUrlMap
		}
	`,
	talents: gql`
		fragment TalentInfoModel on Talent {
			tagId
			tag
			description
			grade
		}
	`,
	activities: gql`
		fragment ActivityInfoModel on ActivityResponse {
			aid
			attachmentList {
				fid
				contentType
			}
			content
			createDate
			privacySetting
			image
			tagList
			title
			tagUser
			summary
		}
	`,
};

/**
 * Query
 */

// 取得指定 pid 基本資料
export const FETCH_USERINFO = gql`
	query fetchUserInfo($pid: Long!) {
		Namecard(pid: $pid) {
			pid
		}
	}
`;

// 取得所有區塊屬性
export const FETCH_BLOCKS = gql`
	query fetchBlocksSetting($pid: Long!) {
		ShareProfile(pid: $pid) {
			pid
			blocks {
				...BlockModel
			}
		}
	}
	${Fragments.blocks}
`;

// 取得發佈後的所有區塊資料
export const FETCH_PUBLISH = gql`
	query fetchPublish($pid: Long!, $uuid: String) {
		ShareProfile(pid: $pid, uuid: $uuid) {
			pid
			blocks {
				...BlockModel
			}
			basic {
				...UserInfoModel
			}
			experience: experiences {
				...ExperienceInfoModel
			}
			education: educations {
				...EducationInfoModel
			}
			behance {
				...BehanceInfoModel
			}
			github {
				...GithubInfoModel
			}
			custom: customs {
				...CustomInfoModel
			}
			gallery: galleries {
				...GalleryInfoModel
			}
			honor: honors {
				...HonorInfoModel
			}
			talent: talents {
				...TalentInfoModel
			}
			plus_activity: activities {
				...ActivityInfoModel
			}
		}
	}
	${Fragments.blocks}
	${Fragments.basic}
	${Fragments.experiences}
	${Fragments.educations}
	${Fragments.behance}
	${Fragments.github}
	${Fragments.customs}
	${Fragments.galleries}
	${Fragments.honors}
	${Fragments.talents}
	${Fragments.activities}
`;

// 取得個人頁左側小名片
export const FETCH_NAMECARD = gql`
	query fetchNamecard($pid: Long!) {
		Namecard(pid: $pid) {
			pid
			visitCount
			collectedCount
			collected
			shareType
		}
	}
`;

// 取得自己與這個 pid 的收藏狀態
export const REQUEST_COLLECTED_STATUS = gql`
	query fetchMyCollection($pid: Long!) {
		Namecard(pid: $pid) {
			collected
			collectedCount
		}
	}
`;

/**
 * Error Handle Utils
 */

// 是否為未啟用的使用者
export const isUnknownUser = (error = {}) => {
	if (!error.graphQLErrors || !Array.isArray(error.graphQLErrors)) return false;
	return error.graphQLErrors.some(({ message, locations, path, code }) => (Array.isArray(path) && path[0] === 'Namecard' && code === '211'))
};

// 是否為未公開的 profile
export const isPrivateProfile = (error = {}) => {
	if (!error.graphQLErrors || !Array.isArray(error.graphQLErrors)) return false;
	return error.graphQLErrors.some(({ message, locations, path, code }, idx) => (Array.isArray(path) && path[0] === "ShareProfile" && code === '213'));
};

// 是否有任何未知錯誤
export const hasAnyError = (error = {}) => {
	if (!error.graphQLErrors || !Array.isArray(error.graphQLErrors)) return false;
	return error.graphQLErrors.some(({ message, locations, path, code }) => (!code || !['211', '213'].includes(code)));
};