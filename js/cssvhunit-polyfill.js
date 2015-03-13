var polyfill = function() {

	var wrapper = document.getElementById("video-wrapper");

	wrapper.style.height = window.innerHeight + "px";

	alert(wrapper.style.height);

};

window.onresize = polyfill;

polyfill();