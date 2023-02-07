import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ResponseService {

	static getInstance() {
		if(!this.responseService){
			this.responseService = new this;
		}

		return this.responseService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.responseService = null;
	}

	testWarning(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ResponseService.0.0', (client) => {
					client.warning(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	testError(params, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ResponseService.0.0', (client) => {
					client.error(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default ResponseService;
