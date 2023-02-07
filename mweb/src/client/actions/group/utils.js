export function idToCategory(id) {
	switch (id) {
		case 1: return 'knowAndTech';
		case 2: return 'lifestyle';
		case 3: return 'healthAndLeisure';
		case 4: return 'artAndDesign';
		default:
			throw Error(`no such category ID, ${id}`);
	}
}
