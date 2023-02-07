import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

function parseConfig(config) {
	const block = config.blockSetting.reduce((final, curr) => {
		const [number, width, height, marginUD = '10px', marginLR = '10px'] = curr;
		for (let i = 0; i < number; i += 1) {
			final.push({width, height, margin: `${marginUD} ${marginLR}`});
		}
		return final;
	}, []);

	const containerStyle = {height: `${config.height}px`};

	return {containerStyle, block};
}

// const LoadingBlock = ({show, config}) => {
// 	const {block, containerStyle} = parseConfig(config);
// 	return (
// 		<div
// 			styleName={ cx('transition', {wrapper: show}, {hided: !show}) }
// 			className={ cx({'ui loading': show}) }
// 			style={ containerStyle }
// 		>
// 			<div styleName="layer" />
// 			{block.map((item, index) => (
// 				<div
// 					key={ index }
// 					styleName="fake_block"
// 					style={ item }
// 				/>
// 			))}
// 		</div>
// 	);
// };

const LoadingBlock = ({show, height}) =>
	<div
		styleName={ show ? '' : 'hide' }
		style={ {height: `${height}px`, padding: `${height / 2}px`} }
	>
		<div className="ui loading" />
	</div>;

LoadingBlock.propTypes = {
	show: PropTypes.bool.isRequired
};

export default compose(
	[CSSModules, '_', css, {allowMultiple: true}],
)(LoadingBlock);
