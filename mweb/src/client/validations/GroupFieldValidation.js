import BaseValidation from './BaseValidation';

class GroupFieldValidation extends BaseValidation {
	constructor(){
		super();
		
		this.gid = null;
	}
	
	rules() {
		return [
			{
				fields: 'gid',
				allowEmpty: false,
				pattern: /^\d+$/,
				options: {
					min: 1
				},
			}
		];
	}
}

export default GroupFieldValidation;