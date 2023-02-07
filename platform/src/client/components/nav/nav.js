import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';

// components
import LinkWrapper from './linkWrapper';

const Nav = ({ path, profilePid, isLogin, pid }) => (
	<nav styleName={ 'nav_main' }>
		<div styleName={ 'nav_width' }>
			<ul styleName={ 'eyebrow' } role="navigation">
				<LinkWrapper
					isLogin={ isLogin }
					isActive={ path === 'home' }
					linkTo="/"
					gtmName="首頁"
					logApiName="index"
					pid={ pid }
					target="_self"
					translateName="common:home"
				/>
				<LinkWrapper
					isLogin={ isLogin }
					isActive={ path === 'profile' && profilePid == pid }
					linkTo={ `/profile/${pid}` }
					gtmName="個人檔案"
					logApiName="profile"
					pid={ pid }
					target="_self"
					translateName="common:profile"
				/>
				<LinkWrapper
					isActive={ path === 'social' }
					linkTo="/topic"
					gtmName="職場動態"
					logApiName="occupaCommunity"
					pid={ pid }
					target="_self"
					translateName="common:social"
				/>
				<LinkWrapper
					isActive={ path === 'event' }
					linkTo="/event/"
					gtmName="活動講座"
					logApiName="event"
					pid={ pid }
					target="_blank"
					translateName="common:event"
				/>
				<LinkWrapper
					isActive={ path === 'channel' }
					linkTo="/channel"
					gtmName="頻道"
					logApiName="channel"
					pid={ pid }
					target="_self"
					translateName="common:channel"
				/>
				<LinkWrapper
					isActive={ path === 'group' }
					linkTo="/group"
					gtmName="社團"
					logApiName="group"
					pid={ pid }
					target="_self"
					translateName="common:group"
				/>
				{
					/*
						<LinkWrapper
							isLogin={ isLogin }
							isActive={ path === 'test' }
							linkTo="/test/job"
							gtmName="測評"
							logApiName="assessment"
							pid={ pid }
							target="_self"
							translateName="common:test"
						/>
					*/
				}
				<LinkWrapper
					isActive={ path === 'beagiver' }
					linkTo="/104beagiver"
					gtmName="Giver"
					logApiName="giver"
					pid={ pid }
					target="_self"
					translateName="common:Be A Giver"
				/>
			</ul>
		</div>
	</nav>
);

Nav.propTypes = {
	path: PropTypes.string.isRequired,
	profilePid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isLogin: PropTypes.bool.isRequired
};

export default CSSModules(Nav, css);
