import BaseValidation from './BaseValidation';

class ChannelFieldValidation extends BaseValidation {
	constructor(){
		super();
		
		this.cid = null;
	}
	
	rules() {
		return [
			{
				fields: 'cid',
				allowEmpty: false,
				pattern: /^\d+$/,
				options: {
					min: 1
				},
			}
		];
	}
}

export default ChannelFieldValidation;