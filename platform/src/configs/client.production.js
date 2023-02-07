"use strict";
import { production } from './generalConfig';

export default {
	"name"  : "c_platform",
	"port" : 8080,
	"env" : "production",
	"params" : {
		...production
	}
};