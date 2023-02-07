export function getTitle(data) {
	if (data.companyName !== null) {
		return (`${data.jobTitle}${data.companyName}`);
	} else if (data.schoolName !== null) {
		return (`${data.major}${data.schoolName}`);
	}
	return false;
}
