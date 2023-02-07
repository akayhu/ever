import { fromJS } from 'immutable';
import generalConfig from '../config/general';

// 讀取並載入圖片
const loadAsset = assetUri =>
	new Promise((resolve, reject) => {
		// 判斷 asset 類型 TODO: 目前僅支援圖片
		const validFilenames = /\.(bmp|gif|jpe?g|png)$/;

		if (!validFilenames.test(assetUri)) {
			return resolve(`[preloader] bypass: ${assetUri}`);
		}

		const asset = new Image();
		asset.src = `${generalConfig.siteUrl}/${assetUri}`;
		asset.onload = () => resolve(`[preloader] success: ${assetUri}`);
		asset.onerror = e => reject(`[preloader] failed: ${assetUri}`, e);
	})
		// .then(msg => console.log(msg))
		.catch(e => console.error(e));

// 讓瀏覽器閒置時預先讀取圖片
const prefetchAsset = assetUri =>
	new Promise((resolve, reject) => {
		// 判斷 asset 類型 TODO: 目前僅支援圖片
		const validFilenames = /\.(bmp|gif|jpe?g|png)$/;

		if (!validFilenames.test(assetUri)) {
			return resolve(`[preloader] bypass: ${assetUri}`);
		}

		const asset = document.createElement('link');
		asset.href = `${generalConfig.siteUrl}/${assetUri}`;
		asset.rel = 'prefetch';
		document.head.appendChild(asset);
		asset.onload = () => resolve(`[preloader] success: ${assetUri}`);
		asset.onerror = e => reject(`[preloader] failed: ${assetUri}`, e);
	})
		// .then(msg => console.log(msg))
		.catch(e => console.error(e));

// 預載所有靜態圖片
const preloader = url => {
	if (!url || !/asset-manifest\.json/.test(url)) {
		console.error(
			'Invalid url found in preloader, url must be <site_url>/asset-manifest.json',
			url
		);
		return;
	}

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then(res => res.json())
		.then(manifest =>
			Promise.all(fromJS(manifest).map(assetUri => prefetchAsset(assetUri)))
		) // NOTE: 這邊改用 prefetch
		.catch(e => console.error('[preloader] error: ', e));
};

export default preloader;
