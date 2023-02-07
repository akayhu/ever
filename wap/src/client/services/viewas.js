/*
* handle viewas
*/
export default function hasPermission(viewAs, privacy, pid , targetPid) {

	switch (viewAs) {
		case 'self':
			if(parseInt(pid)!==parseInt(targetPid)) return false;
			return true;

		case 'friend':
			if (privacy === 2 || privacy === 1) {
				return true;
			}
			return false;

		case 'other':
			if (privacy === 1) {
				return true;
			}
			return false;

		default:
			return false;
	}
}
