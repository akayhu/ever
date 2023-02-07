import styled from 'styled-components';
import { LightboxLoading } from 'share/styledComponents';
import { isMobile } from 'react-device-detect';

export const TriggerButton = styled.span`
	position: absolute;
	border-radius: 8px;
	background: #fff;
	cursor: pointer;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
	z-index: 300;
	${props => {
		if (props.buttonPosition) {
			return `top: calc(50% - 19px); left: calc(50% - 19px);`;
		} else if (props.isMask && isMobile) {
			return `right: 20px; top: 16%;`;
		} else {
			return `right: 20px; bottom: 20px;`;
		}
	}}
`;

export const UploadPane = styled.div`
	position: relative;
	min-width: 480px;
	min-height: 270px;
	background: #f9f9f9;
	border: 2px dashed #d1d1d1;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1400;

	@media (max-width: 568px) {
		min-width: auto;
		width: 100%;
	}
`;

export const LoadingWrapper = styled(LightboxLoading)`
	height: 200px;
`;
