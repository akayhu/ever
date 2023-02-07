
const highlight = function(content, keyword) {
	if (keyword === "") {
		return content;
	}
	var regexp = new RegExp(keyword, "gi");
	try {
		return content.replace(regexp, "<span class='search_hightlight'>"+keyword+"</span>");
	}catch(err){
		return content;
	}
};
export default highlight;
