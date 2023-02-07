export const profileModel = {
	dataInfo: {},
	activity: {},
	connection: {
		
	},
	shouldUpdate: false
};
export const channelModel = {
	dataInfo: {},
	activity: {},
	member: {},
	shouldUpdate: false
};
export const groupModel = {
	dataInfo: {},
	activity: {},
	member: {},
	shouldUpdate: false
};
export const activityModel = {
	dataInfo: {},
	shouldUpdate: false
};
export const companyModel = {
	dataInfo: {},
	activity: {},
	shouldUpdate: false
};
export const initialState = {
	profile: {},
	channel: {},
	group: {},
	activity: {},
	company: {}
};

export default function poolReducer(state = initialState, action) {
	try{
		switch (action.type) {
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
