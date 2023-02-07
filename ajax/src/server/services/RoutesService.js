import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';


class RoutesService {
	
	static getInstance() {
		if(!this.routesService){
			this.routesService = new this;
		}
		
		return this.routesService;
	}
	
	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.routesService = null;
	}
	
	company(custNo,  callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			var params = {};
			params.returnAll = true;
			return [
				rest('get','http:'+config.params.wspJbUrl+'/ncc/?r=Cust/json&c='+custNo, params, (client) => {})
			];

		}).end(function(results) {
			if(callback){
				callback(results);
			}
		});
	}
};

export default RoutesService;
