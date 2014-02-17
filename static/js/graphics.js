(function(){
	function init(){
		var svg = d3.select("#map-canvas-container").insert("svg", ":first-child")
			.attr("id", "userCircle")
			.attr("width", "100")
			.attr("height", "100");
		svg.append("circle")
			.attr("cx", "50")
			.attr("cy", "50")
			.attr("r", "40")
			.attr("stroke", "black")
			.attr("stroke-width", "3")
			.attr("fill", "red");
	}
	fogger.graphics = {
		init: init
	};
});