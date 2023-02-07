import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

export const BlockElemContainer = styled.div`
	border-radius: 6px;
	position: relative;
	border-style: solid;
	border-width: ${props =>
		props.toolBarType === 'blockElemRimless' ? '0' : '3px'};
	border-color: transparent;

	:hover {
		border-color: #f7f7f7;
	}

	${props => {
		if (props.displayFlex) {
			return `
        flex: 0 0 33%;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 33%;
      `;
		}
	}}
`;

export const BlockElemToolBarContainer = styled.div`
	display: none;
	position: absolute;
	z-index: 2;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	background: #fff;
	color: #484848 !important;
	top: calc(100% - 15px);
	left: ${props => {
		if (
			isMobile &&
			props.index !== 0 &&
			props.index !== props.mobileLastData - 1 &&
			!['experience', 'education', 'plus_activity'].includes(props.blockType)
		)
			return 'calc(50% - 90px)';
		if (
			props.blockType !== 'experience' &&
			props.blockType !== 'education' &&
			props.blockType !== 'plus_activity'
		)
			return 'calc(50% - 67.5px)';
		if (props.blockType === 'plus_activity') return 'calc(50% - 22.5px)';
		return 'calc(50% - 45px)';
	}};

	${BlockElemContainer}:hover & {
		display: block;
	}
`;

export const ToolButton = styled.div`
	cursor: pointer;
	padding: 0;
	vertical-align: middle;
	width: 45px;
	text-align: center;
	display: ${props => (props.vertical ? 'block' : 'inline-block')};
	border-right: ${props =>
		!props.vertical && props.position !== 'last' ? '1px solid #eaeaea' : '0'};

	&::after {
		${props =>
			props.vertical && props.position !== 'last' ? `content: '';` : ''};
		${props =>
			props.vertical && props.position !== 'last'
				? `background-color: #B9B9B9;`
				: ''};
		width: 0px;
		height: 0px;
		display: none;
		margin: 8px auto 4px auto;
		position: absolute;
		left: calc((45px / 2) - 8px);
	}

	:hover {
		.icon-icon_touch_app::before,
		.icon-icon_hibe::before,
		.icon-icon_quick_tools::before,
		i {
			opacity: 0.7;
		}
	}

	/* Custom Icon Style */
	[class^='icon-'],
	[class^='icon-']::before,
	span {
		color: #484848 !important;
		font-size: 18px;
	}
	.icon-icon_touch_app::before {
		font-size: 32px;
	}
	.icon-icon_hibe::before {
		font-size: 32px;
	}
	.icon-icon_quick_tools::before {
		font-size: 32px;
	}
`;
