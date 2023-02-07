"use strict";
import request from 'superagent';
import config from '../../configs/config';
// import $ from 'jquery';

export const contract = {
	path: '/contract/reply',
	onEnter: (nextState, replace) => replace('/message/bc')
};

export const media = {
	path: '/media',
	onEnter: (nextState, replace) => replace('/channel')
};
export const mediaKeyword = {
	path: '/media/:cid',
	onEnter: (nextState, replace) => replace('/channel/'+nextState.params.cid)
};

export const privacy = {
	path: '/privacy/set',
	onEnter: (nextState, replace) => replace('/newsletter')
};

export const profileID = {
	path: '/:pid',
	onEnter: (nextState, replace) => replace('/profile/'+ nextState.params.pid)
};

export const name = {
	path: '/:name',
	onEnter: (nextState, replace) => {
		const url = `http:${config.params.remoteDataUrl}/ajax/profile/pid/${nextState.params.name}`;
		request
			.get(url)
			.end((err, res) => {
				
				if(err) console.log(err);
				
			})
		replace('/search/person/'+ nextState.params.name);
		
	}
	
}