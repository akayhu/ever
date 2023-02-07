/*
* handle viewas
*/
export default function hasPermission(viewAs, privacy) {

	switch(viewAs){
		case 'self':
			return true;

		case 'friend':
			if ( privacy === 2 || privacy === 1) {
				return true;
			}
			return false;

		case 'other':
			if (privacy === 1) {
				return true;			
			}
			return false;
			break;

		default:
			return false;
	}
	return false;
}