import BaseValidation from './BaseValidation';

class ActivityFieldValidation extends BaseValidation {
	constructor(){
		super();
		
		this.aid = null;
		this.commentid = null;
	}
	
	rules() {
		return [
			{
				fields: 'aid',
				allowEmpty: false,
				pattern: /^[a-z0-9-]+$/
			},
			{
				fields: 'commentid',
				allowEmpty: true,
				pattern: /^(|[a-z0-9-]+)$/
			}
		];
	}
}

export default ActivityFieldValidation;