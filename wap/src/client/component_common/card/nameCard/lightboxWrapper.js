import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import CSSModules from 'react-css-modules';
// components
import { NoCountTemplate } from 'src/client/component_common/contactTemplate';
import { LightBox } from 'c_wap_module';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

const LightboxWrapper = ({title, handleClose, dataList, loadMore}) =>
	<LightBox
		option={ {closeIcon: true, title} }
		onClose={ handleClose }
	>
		<LazyLoading loadingAct={ loadMore }>
			<div styleName="lbContainer">
				{dataList.map((item, key) =>
					<NoCountTemplate
						key={ key }
						{ ...item }
					/>
				)}
			</div>
		</LazyLoading>
	</LightBox>;

LightboxWrapper.propTypes = {
	title: PropTypes.string.isRequired,
	handleClose: PropTypes.func.isRequired,
	dataList: PropTypes.array.isRequired
};

export default CSSModules(LightboxWrapper, css);
