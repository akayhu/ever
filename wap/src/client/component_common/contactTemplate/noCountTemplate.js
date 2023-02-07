import React from 'react';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import Image from 'src/client/component_common/image';
import css from './index.css';

const NoCountTemplate = ({
	pid,
	avatarWebUrl,
	name,
	company,
	title,
	children
}) =>
	<div styleName="lb_box">
		<div styleName="lb_left">
			<Link to={ `/profile/${pid}` } >
				<Image
					type="avatar"
					src={ avatarWebUrl }
					styleName="size40"
				/>
			</Link>
		</div>
		<div styleName="lb_right">
			<div styleName="lb_right_top" title={ name }>
				<Link to={ `/profile/${pid}` } >
					{ name }
				</Link>
				{ children }
			</div>
			<div styleName="lb_right_bottom" title={ `${company} ${title}` }>
				<p>{ company }　{ title }</p>
			</div>
		</div>
	</div>;

export default CSSModules(NoCountTemplate, css);
