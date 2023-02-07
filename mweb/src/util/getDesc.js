const GetDescript = function( value , callback ) {
	let ajaxUrl = '/ajax/autoComplete/getDescript?noList=' + value + '&returnAll=1';
	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(callback && typeof(callback) === "function"){
				callback(xhttp.responseText);
			}
		}
	};
	xhttp.open("GET", ajaxUrl , true);
	xhttp.send();
}

export default GetDescript;