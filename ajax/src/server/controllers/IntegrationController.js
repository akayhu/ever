"use strict";

import IntegrationService from 'src/server/services/IntegrationService';
import RoutesService from 'src/server/services/RoutesService';
import TestService from 'src/server/services/TestService';

const integrationService = IntegrationService.getInstance();
const routesService = RoutesService.getInstance();
const testService = TestService.getInstance();

export const actionGetMyWish = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	integrationService.getMyWish(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetServerTime = (req, res, next) => {
	const paramMap = req.paramMap;
	
	integrationService.getServerTime(paramMap, (result) => {
		res.json(result);
	});
};

export const actionCompany = (req, res, next) =>  {
	const paramMap = req.paramMap;
	const custNo = paramMap.custNo;

	routesService.company(custNo, (result) => {
		res.json(result);
	});
};

export const actionGetFuture = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.getFuture(paramMap.jobcat, (result) => {
		res.json(result);
	});
};