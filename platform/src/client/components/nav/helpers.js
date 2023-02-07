export function locationToState(location) {
	const tempPath = location ? location.pathname : '/';
	const pathName = tempPath.split('/')[1];

	switch (pathName) {
		case '':
			return { path: 'home'};
		case 'profile':
			return {
				path: 'profile',
				profilePid: tempPath[2]
			};
		case 'privacy':
			return { path: 'profile'};
		case 'topic':
			return { path: 'social'};
		case 'channel':
			return { path: 'channel'};
		case 'group':
			return { path: 'group'};
		case 'test':
			return { path: 'test'};
		case '104beagiver':
			return { path: 'beagiver'};
		default:
			return { path: 'none'};
	}
}
