const integerOnly = /^\d+$/g;
const integerOnlyAllowEmpty = /^(|\d+)$/g;

const specialFlagCheck = (rule, allowEmpty) => {
	if(rule.hasOwnProperty("integerOnly") || rule.hasOwnProperty("options")){
		if(!rule.pattern){
			rule.pattern = allowEmpty ? integerOnlyAllowEmpty : integerOnly;
		}
		
		rule.successCallback = (successRule, value) => {
			if(rule.allowEmpty === true && !value){
				return true;
			}
			
			if(successRule.options.hasOwnProperty("min") && value < successRule.options.min){
				return false;
			}
			
			if(successRule.options.hasOwnProperty("max") && value > successRule.options.max){
				return false;
			}
			
			return true;
		};
	}
};

const checkFieldInRule = (rule, field) => {
	return rule.fields.split(",").indexOf((fieldInRule) => {return fieldInRule === field});
};

function checkAllowEmpty(rule, field) {
	var self = this; 
	
	if(rule.hasOwnProperty('allowEmpty')){
		if(rule.allowEmpty === false && !self[field]){
			self.result = false;
			return;
		}
		
		specialFlagCheck(rule, true);
	}else{
		rule.allowEmpty = false;
		specialFlagCheck(rule, false);
	}
}

class BaseValidation {
	constructor(){
		this.currentFields = [];
		this.result = true;
	}
	
	rules() {
		return [];
	}
	
	setValidTarget(paramsObject) {
		var self = this;
		
		if(typeof paramsObject === 'object'){
			for(var field in paramsObject){
				self.currentFields.push(field);
				self[field] = paramsObject[field];
			}
		}
	}
	
	test() {
		const self = this;
		const rules = this.rules();
		const fields = this.currentFields;
		
		if(Array.isArray(rules) && rules.length > 0){
			for(var i = 0; i < fields.length; i++){
				var field = fields[i];
				
				for(var j = 0; j < rules.length; j++){
					var rule = rules[j];
					
					if(checkFieldInRule(rule, fields)){
						let value = self[field] || '';
						
						checkAllowEmpty.call(self, rule, field);
						
						if(!self.result){
							return;
						}
						
						self.result = rule.pattern.test(value);
						
						if(self.result === true && rule.hasOwnProperty("successCallback")){
							self.result = rule.successCallback(rule, value);
						}
						
						if(rule.hasOwnProperty('reverse') && rule.reverse === true){
							self.result = !self.result;
						}
						
						return;
					}
				}
			}
		}
	}
}

export default BaseValidation;