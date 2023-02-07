import React from 'react';
import './style.scss';

export const creatLinkPlugin = () => ({
	decorators: [
		{
			strategy: (contentBlock, callback, contentState) => {
				contentBlock.findEntityRanges(character => {
					const entityKey = character.getEntity();
					return (
						entityKey !== null &&
						contentState.getEntity(entityKey).getType() === 'LINK'
					);
				}, callback);
			},
			component: ({ contentState, entityKey, children }) => {
				const { link } = contentState.getEntity(entityKey).getData();
				return (
					<a
						href={link}
						className="link-plugin__link"
						target="_blank"
						rel="noopener noreferrer"
					>
						{children}
					</a>
				);
			},
		},
	],
});
