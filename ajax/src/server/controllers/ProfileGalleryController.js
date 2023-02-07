"use strict";

import ProfileGalleryService from 'src/server/services/ProfileGalleryService';

const profileGalleryService = ProfileGalleryService.getInstance();

export const actionGetGalleryList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileGalleryService.getGalleryList(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetGallerySortList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileGalleryService.getGallerySortList(pid, (result) => {
		res.json(result);
	});
};

export const actionCreateGallery = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileGalleryService.createGallery(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionUpdateGallery = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileGalleryService.updateGallery(paramMap, (result) => {
		res.json(result);
	});
};

export const actionDeleteGallery = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileGalleryService.deleteGallery(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionUpdateGallerySort = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileGalleryService.updateGallerySort(paramMap, (result) => {
		res.json(result);
	});
};