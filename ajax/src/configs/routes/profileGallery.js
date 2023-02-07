"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileGalleryController from "src/server/controllers/ProfileGalleryController";

export default {
	"/ajax/profile/profileGallery": {
		"/deleteGallery": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileGalleryController.actionDeleteGallery
			]
		},
		"/getGallerySortList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileGalleryController.actionGetGallerySortList
			]
		},
		"/getGalleryList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileGalleryController.actionGetGalleryList
			]
		},
		"/createGallery": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileGalleryController.actionCreateGallery
			]
		},
		"/updateGallery": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileGalleryController.actionUpdateGallery
			]
		},
		"/updateGallerySort": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileGalleryController.actionUpdateGallerySort
			]
		}
	}
};