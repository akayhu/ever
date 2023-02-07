import $ from "jquery";

const registerMap = {};

export default function scrollFixedUtil(traceNodeName, fixedNodeName, bottomUpSafeHeight) {
	
	if(!registerMap[traceNodeName+fixedNodeName]){
		registerMap[traceNodeName+fixedNodeName] = true;
	}else {
		return;
	}
	const win = $(window);
	const viewPartHeight = win.height();
	const safeHeight = bottomUpSafeHeight;
	const jqSocialMain = $(fixedNodeName);
	const jqLicense = $(traceNodeName);
	let jqLicenseHeight = null;
	let jqLicenseOffsetY = null;
	
	win.scroll((e) => {
		if(jqLicense.length === 0){
			return;
		}
		
		if(jqLicenseHeight === null){
			jqLicenseHeight = jqLicense.height();
		}
		
		if(jqLicenseOffsetY === null){
			jqLicenseOffsetY = jqLicense.offset().top;
		}
		
		const scrollTop = win.scrollTop();
		
		if((viewPartHeight+scrollTop) >= (jqLicenseOffsetY+jqLicenseHeight+safeHeight)){
			var style = jqSocialMain.attr('style');
			
			if(style){
				return;
			}
			
			jqSocialMain.css({position:'fixed', 'bottom': safeHeight+"px", width: "300px"})
		}else{
			var style = jqSocialMain.attr('style');
			
			if(!style){
				return;
			}
			
			jqSocialMain.removeAttr('style');
		}
	})
};