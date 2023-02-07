import request from 'superagent';
import config from '../../configs/config';
import ActivityService from 'src/server/services/ActivityService';

const activityService = ActivityService.getInstance();

export const actionActivity = (req, res, next) => {
	
	const userModel = req.userModel;
	const pid = userModel.pid;
	const isLogin =  userModel.isLogin || false;
	const paramMap = {
		aidParent: req.params.aid,
		aid:  req.params.aid
	}

	activityService.getActivity(pid, paramMap, (result) => {
		if(!result.response || result.response === null) {
			return res.redirect('/error/activity/');
			
		}
		next();
	});
};
