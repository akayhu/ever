export function getResizedImgInfo(img, maxWidth, maxHeight) {
	const canvas = document.createElement('canvas');

	let width = img.width;
	let height = img.height;

	if (width / height > maxWidth / maxHeight) {
		width *= maxHeight / height;
		height = maxHeight;
	} else {
		height *= maxWidth / width;
		width = maxWidth;
	}

	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, width, height);
	return {
		imgUrl: canvas.toDataURL('image/png'),
		newWidth: width,
		newHeight: height
	};
}
