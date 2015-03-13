var polyfill = function() {

	var wrapper = document.getElementById("video-wrapper");

	wrapper.style.height = window.innerHeight + "px";

};

window.onresize = polyfill;

polyfill();