import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class AdvertisingService {

  static getInstance() {
		if(!this.advertisingService){
			this.advertisingService = new this;
		}

		return this.advertisingService;
  }

  constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.advertisingService = null;
  }
  
  getAllAdvertising(type, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityNewsService', (client) => {
					client.getAllAdvertising({'type': type});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
  }
  
  outOfAdvertising(adid, callback){
    this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityNewsService', (client) => {
					client.outOfAdvertising({'adid': adid});
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
  }

}

export default AdvertisingService;