import React, { Component } from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import PeopleItem from 'src/client/components/peopleItem';

const Colleague = ({ colleague }) =>
	<div>
		<span styleName="title">共識愉快</span>
		<div styleName="container">
			{
				colleague.dataList.map((data, index) => (
					<PeopleItem
						userObj={ data }
						onlyImg={ true }
						imgSize={ 45 }
						imgStyle={ index === 0 ? {} : { marginLeft: '8px' } }
						wrapStyle={ {padding: 0, flex: 'initial'} }
					/>
				))
			}
		</div>
	</div>;

export default CSSModules(Colleague, css);
