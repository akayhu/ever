import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ActivityService {

	static getInstance() {
		if(!this.groupService){
			this.groupService = new this;
		}

		return this.groupService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.activityService = null;
	}

	getActivity(pid, params, callback) {
		params.pid = pid;
		params.productKey = config.params.apnum;

		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getActivity(params);
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default ActivityService;
