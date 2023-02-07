import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const TypeOf = (obj) => Object.prototype.toString.call(obj).match(/\s(\w+)]/)[1]

const serverName = '/GroupService.0.0';
const productKey = config.params.apnum;

class GroupService {

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
		this.groupService = null;
	}

	convertGroupId(groupId, callback) {
	    this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/GroupService.0.0', (client) => {
					client.convertGroupId({'groupId':groupId});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default GroupService;
