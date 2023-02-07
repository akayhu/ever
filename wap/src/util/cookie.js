export function GetCookie(name) { 
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); 
    if(arr != null) return unescape(arr[2]); return null; 
} 

export function DelCookie (name){ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 8640000); 
    var cval=GetCookie(name); 
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString()+ "; path=/";
} 