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
	
	
	routesCheck(keyword,  callback) {
		this.asyncFetchHelper.need(['rest']).then(function(rest) {
			var params = {};
			params.returnAll = true;
			
			keyword = encodeURI(keyword);

			return [
				rest('get', config.params.apiUrl.esb+'/profile/pid/'+ keyword, params, {})
			];

		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}

	/**
	 * 拿到channel ID by name
	 * @param {*} name 
	 * @param {*} callback 
	 */
	getChannIdByNameUrl(name, callback) {
	    this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MediaChannelServiceForBackstage.0.0', (client) => {
					client.getChannIdByNameUrl({'name':name});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

};

export default RoutesService;
