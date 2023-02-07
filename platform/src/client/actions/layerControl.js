"use strict";

export function registerLayer(callback){
	if(window.all_layer){
		window.all_layer = [callback, ...window.all_layer];
	}else{
		window.all_layer = [callback];
	}
}

export function closeLayer(e) {
	const target = e.target;
	
	if(window.all_layer && window.all_layer.length > 0){
		for(var i = 0; i < window.all_layer.length; i++){
			window.all_layer[i].call(this, target);
		}
	}
};