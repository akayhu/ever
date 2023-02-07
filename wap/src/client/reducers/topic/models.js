export const baseData = {
	ids: [],
	offset: 0,
	isLoading: false,
	isEnd: false,
	isError: false,
	shouldReset: false
};

const newsModel = {
	hots: baseData,
	new: baseData,
	experience: baseData,
	profession: baseData,
	learn: baseData,
	person: baseData,
	inspirational: baseData,
	book: baseData,
	invest: baseData,
	health: baseData,
	travel: baseData,
	life: baseData,
	movie: baseData,
};

export const funcModel = {
	news: newsModel,
	followed: baseData,
	endorse: {},
	related: {},
	gallery: baseData,
	honor: baseData,
	channel: baseData,
	group: baseData,
};
