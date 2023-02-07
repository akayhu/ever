import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import parseStrToElements from 'utils/parseStrToElements';
import Lightbox from 'components/lightbox';

const PlusActivityViewer = props => {
	const { classNameContent, articleTitle, data, children } = props;
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();

	useEffect(
		() => {
			open ? dispatch(lightboxOpen()) : dispatch(lightboxClose());
		},
		[open]
	);

	const triggerLightbox = value => {
		setOpen(value);
	};

	if (open) {
		return (
			<Fragment>
				<div className={classNameContent}>{children}</div>
				<Lightbox
					title={articleTitle}
					width="800px"
					afterClose={() => triggerLightbox(false)}
					cssClassName="plus-activity-lightbox"
				>
					{parseStrToElements(data)}
				</Lightbox>
			</Fragment>
		);
	}

	return (
		<div className={classNameContent} onClick={() => triggerLightbox(true)}>
			{children}
		</div>
	);
};

export default PlusActivityViewer;
