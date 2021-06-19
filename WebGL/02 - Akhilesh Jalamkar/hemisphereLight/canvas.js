var gl= null;
var canvas = null;
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;
var requestAnimationFrame;

var sphere = null;

const WebGLMacros = {
	ASJ_ATTRIBUTE_VERTEX: 0,
	ASJ_ATTRIBUTE_COLOR: 1,
	ASJ_ATTRIBUTE_NORMAL: 2,
	ASJ_ATTRIBUTE_TEXTURE: 3,
};

var ASJ_vertexShaderObject_hemisphere;
var ASJ_fragmentShaderObject_hemisphere;
var ASJ_shaderProgramObject_hemisphere;



var perspectiveProjectionMatrix;

var ASJ_mvpUniform_hemisphere;
var ASJ_viewMatrixUniform;
var ASJ_skyColorUniform;
var ASJ_groundColorUniform;

var ASJ_lightPositionUniform;


requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame;

function main()
{
	
	 canvas=document.getElementById("ASJ");
	
	if(!canvas)
	{
	console.log("Canvas Fail");	
	}
	else
	{
	console.log("Canvas Success");	
		
	}
	
	console.log("Canvas Width= " + canvas.width + " Canvas Height= " + canvas.height);	
	
	

	canvas_original_width = canvas.width;
	canvas_original_height = canvas.height;
	

	window.addEventListener("resize", resize, false);

	window.addEventListener("keydown", keyDown, false);

	window.addEventListener("click", mouseDown, false);

	ASJ_init_hemisphere();
	resize();
	ASJ_Draw_hemisphereLighting();
}
function ASJ_init_hemisphere() {
	gl = canvas.getContext("webgl2");

	if (gl == null) {
		console.log("Failed to get rendering context for WebGL");
		return;
	}
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	var vertexShaderSource =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"precision highp int;" +
		"uniform vec3 LightPosition;"+
	"uniform vec3 SkyColor;"+
	"uniform vec3 GroundColor;"+

	"in vec4 vPosition;"+
	"in vec3 MCNormal;"+

	"uniform mat4 u_view_matrix;" +
	"uniform mat4 u_mvp_matrix;" +
	"mat3 u_normal_matrix;" +

	"out vec3 Color;"+
	"void main(void)" +
	"{" +
	"vec3 ecPosition =vec3(u_view_matrix * vPosition);"+
	"u_normal_matrix=mat3((transpose(inverse(u_view_matrix))));"+
	"vec3 tnorm=normalize(u_normal_matrix * MCNormal);"+
	"vec3 lightVec=normalize(LightPosition-ecPosition);"+
	"float costheta=dot(tnorm,lightVec);"+
	"float a=costheta*0.5+0.5;"+
	"Color=mix(GroundColor,SkyColor,a);"+

	"gl_Position=u_mvp_matrix * vPosition;" +
	"}";
	ASJ_vertexShaderObject_hemisphere = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_vertexShaderObject_hemisphere, vertexShaderSource);
	gl.compileShader(ASJ_vertexShaderObject_hemisphere);

	if (gl.getShaderParameter(ASJ_vertexShaderObject_hemisphere, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_hemisphere);
		if (error.length > 0)
		{
			alert("vertex shader hemisphere lighting\n");
			alert(error);
			uninitialize();
		}
	}

	var fragmentShaderSource =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"precision highp int;" +
		"out  vec4 FragColor;"+
	"in vec3 Color;"+
	"void main(void)" +
	"{" +
	"FragColor = vec4(Color,1);"+
	"}";

	ASJ_fragmentShaderObject_hemisphere = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_fragmentShaderObject_hemisphere, fragmentShaderSource);
	gl.compileShader(ASJ_fragmentShaderObject_hemisphere);

	if (gl.getShaderParameter(ASJ_fragmentShaderObject_hemisphere, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_hemisphere);
		if (error.length > 0) {
			alert("fragment shader hemisphere lighting\n");
			alert(error);
			uninitialize();
		}
	}
	//shader program

	ASJ_shaderProgramObject_hemisphere = gl.createProgram();
	gl.attachShader(ASJ_shaderProgramObject_hemisphere, ASJ_vertexShaderObject_hemisphere);
	gl.attachShader(ASJ_shaderProgramObject_hemisphere, ASJ_fragmentShaderObject_hemisphere);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ASJ_shaderProgramObject_hemisphere, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(ASJ_shaderProgramObject_hemisphere, WebGLMacros.ASJ_ATTRIBUTE_NORMAL, "MCNormal");

	gl.linkProgram(ASJ_shaderProgramObject_hemisphere);
	if (!gl.getProgramParameter(ASJ_shaderProgramObject_hemisphere, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_hemisphere);
		if (error.length > 0) {
			alert("ASJ_shaderProgramObject_hemisphere \n");
			alert(error);
			uninitialize();
		}
	}

	ASJ_mvpUniform_hemisphere = gl.getUniformLocation(ASJ_shaderProgramObject_hemisphere, "u_mvp_matrix");
	
	ASJ_skyColorUniform = gl.getUniformLocation(ASJ_shaderProgramObject_hemisphere, "SkyColor");
	ASJ_groundColorUniform = gl.getUniformLocation(ASJ_shaderProgramObject_hemisphere, "GroundColor");
	ASJ_lightPositionUniform = gl.getUniformLocation(ASJ_shaderProgramObject_hemisphere, "LightPosition");
	ASJ_viewMatrixUniform = gl.getUniformLocation(ASJ_shaderProgramObject_hemisphere, "u_view_matrix");

	sphere = new Mesh();
	
	makeSphere(sphere, 2.0, 30, 30);

	

	gl.clearColor(0.50, 0.50, 0.50, 1.0);
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

	mat4.perspective(perspectiveProjectionMatrix, 45, parseFloat(canvas.width) / parseFloat(canvas.height), parseFloat( 0.1), 100);
	
	
}

function ASJ_Draw_hemisphereLighting() {
	gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

	gl.useProgram(ASJ_shaderProgramObject_hemisphere);
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();
	var translateMatrix = mat4.create();
	

	mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
	mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

	gl.uniformMatrix4fv(ASJ_viewMatrixUniform, false, modelViewMatrix);
	gl.uniformMatrix4fv(ASJ_mvpUniform_hemisphere, false, modelViewProjectionMatrix);

	var LightSkyColor = new Float32Array([0.980, 0.117, 0.231])  ;
	var LightGroundColor = new Float32Array([0.3, 0.3, 0.3]);
	var lightPosition = new Float32Array([0.0, 3.0, -5.0]);

	

	gl.uniform3fv(ASJ_skyColorUniform, LightSkyColor);

	gl.uniform3fv(ASJ_groundColorUniform, LightGroundColor);
	gl.uniform3fv(ASJ_lightPositionUniform, lightPosition);
	

	


	sphere.draw();
	
	requestAnimationFrame(ASJ_Draw_hemisphereLighting, canvas);
}




function keyDown(event) {
	switch (event.keyCode) {

		case 27:
			uninitialize();
			window.close();
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



function uninitialize()
{
	if (sphere) {
		sphere.deallocate();
    }

	if (ASJ_shaderProgramObject_hemisphere)
	{
		if (ASJ_vertexShaderObject_hemisphere)
		{

			gl.detachShader(ASJ_shaderProgramObject_hemisphere, ASJ_vertexShaderObject_hemisphere);
			gl.deleteShader(ASJ_vertexShaderObject_hemisphere);
			ASJ_vertexShaderObject_hemisphere = null;
		}

		if (ASJ_fragmentShaderObject_hemisphere) {

			gl.detachShader(ASJ_shaderProgramObject_hemisphere, ASJ_fragmentShaderObject_hemisphere);
			gl.deleteShader(ASJ_fragmentShaderObject_hemisphere);
			ASJ_fragmentShaderObject_hemisphere = null;
		}
		gl.deleteProgram(ASJ_shaderProgramObject_hemisphere);
		ASJ_shaderProgramObject_hemisphere = null;
    }
}









