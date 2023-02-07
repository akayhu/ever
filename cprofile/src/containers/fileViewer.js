import React, { Component, Fragment } from 'react';
// import { Rnd } from 'react-rnd';
import { connect } from 'react-redux';
import { Image } from 'share/styledComponents';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import Lightbox from 'components/lightbox';
import styled from 'styled-components';
import MediaPlayer from 'components/mediaPlayer';

// TODO: 待做上放大縮小

const Container = styled.div`
	/*width: 100%;*/
	text-align: center;
`;
const Description = styled.h4`
	margin: 1em auto;
	text-align: center;
`;

class FileViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileWidth: '80%',
			fileUrl: props.fileUrl || null,
			error: false,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.fileUrl !== prevState.fileUrl && !prevState.error) {
			return {
				...prevState,
				fileUrl: nextProps.fileUrl,
			};
		}
		return null;
	}

	triggerLightbox = value => {
		this.setState(
			{
				open: value,
			},
			() => {
				this.state.open
					? this.props.lightboxOpen()
					: this.props.lightboxClose();
			}
		);
	};

	// getImageWidth = (e) => {
	//   this.setState({
	//     fileWidth: `${e.target.naturalWidth + 48}px`,
	//   })
	// }

	handleError = () => {
		this.setState({ error: true });
	};

	render() {
		const { open, fileUrl, error } = this.state;
		const {
			fileId,
			children,
			mediaType = 'IMAGE',
			isGallery,
			fileData,
		} = this.props;
		const page = mediaType === 'DOCUMENT' ? -1 : '';
		return open ? (
			<Fragment>
				<Lightbox
					title={fileData.title}
					width="800px"
					afterClose={this.triggerLightbox.bind(this, false)}
				>
					{mediaType === 'IMAGE' && fileUrl && !error && (
						<Container>
							<Image
								src={fileUrl}
								width="100%"
								onLoad={this.getImageWidth}
								onError={this.handleError}
								alt={`${fileData.title} - ${fileId}`}
							/>
						</Container>
					)}
					{mediaType !== 'IMAGE' && !error && (
						<MediaPlayer
							fileId={fileId || ''}
							mediaType={mediaType || 'IMAGE'}
							convertType={mediaType.toLowerCase() || 'cover'}
							meta={{}}
							page={page}
							isGallery={isGallery || false}
						/>
					)}
					{error && <Description>預覽發生錯誤，請再試一次！</Description>}
				</Lightbox>
				{children}
			</Fragment>
		) : (
			<div
				onClick={this.triggerLightbox.bind(this, true)}
				style={{ cursor: 'pointer' }}
			>
				{children}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	pid: state.getIn(['user', 'pid']),
});

export default connect(
	mapStateToProps,
	{ lightboxOpen, lightboxClose }
)(FileViewer);
