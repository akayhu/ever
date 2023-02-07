import BaseValidation from './BaseValidation';

class ProfileFieldValidation extends BaseValidation {
	constructor(){
		super();
		
		this.pid = -3;
	}
	
	rules() {
		return [
			{
				fields: 'pid',
				allowEmpty: false,
				pattern: /^\d+$/,
				options: {
					min: 1
				},
			}
		];
	}
}

export default ProfileFieldValidation;