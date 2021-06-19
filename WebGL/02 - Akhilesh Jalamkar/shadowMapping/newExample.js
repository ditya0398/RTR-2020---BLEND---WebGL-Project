var gl = null;
var canvas = null;
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;
var requestAnimationFrame;





const WebGLMacros = {
	ASJ_ATTRIBUTE_VERTEX: 0,
	ASJ_ATTRIBUTE_COLOR: 1,
	ASJ_ATTRIBUTE_NORMAL: 2,
	ASJ_ATTRIBUTE_TEXTURE: 3,
};




var aspect;



var perspectiveProjectionMatrix;

requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame;

function main() {

	canvas = document.getElementById("ASJ");

	if (!canvas) {
		console.log("Canvas Fail");
	}
	else {
		console.log("Canvas Success");

	}

	console.log("Canvas Width= " + canvas.width + " Canvas Height= " + canvas.height);



	canvas_original_width = canvas.width;
	canvas_original_height = canvas.height;


	window.addEventListener("resize", resize, false);

	window.addEventListener("keydown", keyDown, false);

	window.addEventListener("click", mouseDown, false);

	init();
	resize();
	Draw_Shadow();
}
function init() {
	gl = canvas.getContext("webgl2");

	if (gl == null) {
		console.log("Failed to get rendering context for WebGL");
		return;
	}
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	

	initShadow();

	

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	perspectiveProjectionMatrix = mat4.create();
}




function resize() {
	if (bFullscreen == true) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	else {
		canvas.width = canvas_original_width;
		canvas.height = canvas_original_height;
	}
	gl.viewport(0, 0, canvas.width, canvas.height);

	if (canvas.height == 0) {
		canvas.height = 1;
	}
	//perspective Projection

	mat4.perspective(perspectiveProjectionMatrix, 45, parseFloat(canvas.width) / parseFloat(canvas.height), parseFloat( 0.1), 1000);
	aspect = parseFloat(canvas.height) / parseFloat(canvas.width);

}





function keyDown(event) {
	switch (event.keyCode) {

		case 27:
			ShadowUninit();
			window.close();
			break;
		case 100:
			val = val + 0.8;
			break;
		case 102:
			val = val - 0.8;
			break;

		case 70:     //"f"
			toggleFullScreen();

			break;
	}

}
function mouseDown() {

}

function toggleFullScreen() {
	var fullScreen_element = document.fullscreenElement
		|| document.webkitFullscreenElement
		|| document.mozFullScreenElement
		|| document.msFullscreenElement || null;

	if (fullScreen_element == null) {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		}
		else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
		else if (canvas.mozRequestFullScreen) {
			canvas.mozRequestFullScreen();
		}
		else if (canvas.msRequestFullscreen) {
			canvas.msRequestFullscreen();
		}
	}
	else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
		else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		else if (document.mozCancelFullScreen) {
			document.mozcancelFullScreen();
		}
		else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
}



function ShadowUninit() {
	if (sphere) {
		sphere.deallocate();
	}

	if (shaderProgramObject_shadowmap) {
		if (vertexShaderObject_shadowmap) {

			gl.detachShader(shaderProgramObject_shadowmap, vertexShaderObject_shadowmap);
			gl.deleteShader(vertexShaderObject_shadowmap);
			vertexShaderObject_shadowmap = null;
		}

		if (fragmentShaderObject_shadowmap) {

			gl.detachShader(shaderProgramObject_shadowmap, fragmentShaderObject_shadowmap);
			gl.deleteShader(fragmentShaderObject_shadowmap);
			fragmentShaderObject_shadowmap = null;
		}
		gl.deleteProgram(shaderProgramObject_shadowmap);
		shaderProgramObject_shadowmap = null;
	}
}









