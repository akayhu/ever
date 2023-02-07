"use strict";

import AdvertisingService from 'src/server/services/AdvertisingService';

const advertisingService = AdvertisingService.getInstance();

export const actionGetAllAdvertising = (req, res, next) => {
	const paramMap = req.paramMap;
	
	advertisingService.getAllAdvertising(paramMap.type, (result) => {
		res.json(result);
  });
  
};

export const actionOutOfAdvertising = (req, res, next) => {
	const paramMap = req.paramMap;
	
	advertisingService.outOfAdvertising(paramMap.adid, (result) => {
		res.json(result);
  });
  
};