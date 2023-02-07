import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';

class IndexLayout extends Component {
	constructor(props, context){
		super(props, context);
	}
	render() {
		const envCode = `window.env='${clientConfig.env}';`;
		return (
			<html>  
				<head>
					<title>{ this.props.title ? this.props.title : '104 職涯社群' }</title>
					<meta charSet="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
					<meta httpEquiv="cache-control" content="no-store, no-cache" />
					<meta httpEquiv="pragma" content="no-cache" />
					<meta httpEquiv="expires" content="0" />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/reset.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/icon/icon.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/button.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/dropdown.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/transition.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/loader.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/dimmer.css`} />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/draft.css`} />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/cropper.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/ui/componentcommon.css` } />
					<link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/css/global.css` } />
					{ (clientConfig.env !== 'dev') && <link rel="stylesheet" href={ `${clientConfig.params.staticPlatformUrl}/build/${clientConfig.name}.css` } /> }
					<link rel="shortcut icon" href={ `${clientConfig.params.staticPlatformUrl}/favicon.ico` } />
				</head>
				<body>
					<div id="root" dangerouslySetInnerHTML={ { __html:this.props.children } }></div>
					<script dangerouslySetInnerHTML={ { __html:envCode } }></script>
					<script type="text/javascript">{ `window.dataLayer=[{pid:${this.props.reduxState.user.pid},isLogin:${this.props.reduxState.user.isLogin}}]` };</script>
					<script type="application/json" id="reduxState" charSet="utf-8" dangerouslySetInnerHTML={ { __html: JSON.stringify(this.props.reduxState) } }></script>
					<script type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/lib.js` }></script>
					<script type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/${clientConfig.name}_en.js` }></script>
					<script type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/${clientConfig.name}_zhTW.js` }></script>
					<script type="text/javascript" src={ `${clientConfig.params.staticPlatformUrl}/build/${clientConfig.name}_bundle.js` }></script>
					<script type="text/javascript" src={ `${clientConfig.params.staticUrl}/plus/js/announcementContent.js` }></script>
				</body>
			</html> 
		);
	}
}

export default IndexLayout;
