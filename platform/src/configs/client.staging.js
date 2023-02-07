"use strict";
import { staging } from './generalConfig';

export default {
	"name"  : "c_platform",
	"port" : 8080,
	"env" : "staging",
	"params" : {
		...staging
	}
};