import Immutable from 'immutable';
import Cookies from 'js-cookie';
import generalConfig from 'config/general';
import { TRIGGER_SURVEY } from 'actions/ui/survey';

// NPS_xxxx_surveyed 代表已被調查過 (不論關閉或是有回應)
// NPS_xxxx_last_seen 代表上次顯示調查的時間
const hasSurveyed = Object.keys(Cookies.get()).some(
	name => name === `${generalConfig.wootric.replace('-', '_')}_surveyed`
);

const initState = Immutable.fromJS({
	enable: false,
	hasSurveyed,
});

const SurveyReducer = (state = initState, action) => {
	switch (action.type) {
		case TRIGGER_SURVEY: {
			return state.get('hasSurveyed') ? state : state.set('enable', true);
		}
		default: {
			return state;
		}
	}
};

export default SurveyReducer;
