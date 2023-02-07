import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Interaction from 'src/client/components/interaction';
// components
import PeopleItem from 'src/client/components/peopleItem';

const PeopleList = ({userList}) => (
	<div styleName="list_wrap">
		{userList.map((user, index) => (
			<PeopleItem
				key={ index }
				userObj={ user }
				hasButton
			>
				<Interaction
					targetPid={ user.pid }
					connectionStatus={ user.connectionStatus }
				/>
			</PeopleItem>
			))}
	</div>
	);

PeopleList.defaultProps = {
	userList: [],
};

PeopleList.propTypes = {
	userList: PropTypes.array.isRequired,
};

export default CSSModules(PeopleList, css);
