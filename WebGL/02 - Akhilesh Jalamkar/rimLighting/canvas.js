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

var ASJ_vertexShaderObject_rimLight;
var ASJ_fragmentShaderObject_rimLight;
var ASJ_shaderProgramObject_rimLight;





var perspectiveProjectionMatrix;

var ASJ_mvpUniform_rimLight;
var ASJ_viewMatrixUniform_rimLight;
var ASJ_ambientUniform_rimLight;
var ASJ_lightColorUniform_rimLight;
var ASJ_lightPositionUniform_rimLight;
var ASJ_shininessUniform_rimLight;
var ASJ_strengthUniform_rimLight;
var ASJ_eyeDirectionUniform_rimLight;
var ASJ_attenuationUniform_rimLight;

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

	ASJ_init_rimLighting();
	resize();
	ASJ_Draw_rimLighting();
}
function ASJ_init_rimLighting() {
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
		"uniform mat4 u_modelView_matrix;" +
	"uniform mat4 u_mvp_matrix;" +
	"mat3 u_normal_matrix;" +
	"\n" +
	"in vec4 vPosition;"+
	"in vec3 vNormal;"+
	"in vec4 vColor;"+
	"\n" +
	"out vec4 Color;"+

	"out float LightIntensity;"+
	"\n" +
	"void main(void)" +
	"{"+
	"Color=vec4(0.0,0.0,0.0,1.0);"+
	"u_normal_matrix=mat3(transpose(inverse(u_modelView_matrix)));"+

	"vec3 Normal=normalize(u_normal_matrix*vNormal);"+

	"vec3 Position=vec3(u_modelView_matrix*vPosition);"+
	"vec3 eye=normalize(-Position);"+
	"LightIntensity=1.0-max(dot(eye,Normal),0.0);"+

	"gl_Position=u_mvp_matrix * vPosition;" +
	"}";
	ASJ_vertexShaderObject_rimLight = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_vertexShaderObject_rimLight, vertexShaderSource);
	gl.compileShader(ASJ_vertexShaderObject_rimLight);

	if (gl.getShaderParameter(ASJ_vertexShaderObject_rimLight, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_rimLight);
		if (error.length > 0)
		{
			alert("vertex");
			alert(error);
			uninitialize();
		}
	}

	var fragmentShaderSource =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"precision highp int;" +
		"in vec4 Color;"+
	"out  vec4 FragColor;"+
	"in float LightIntensity;"+

	"void main(void)" +
	"{" +
	"FragColor.rgb=smoothstep(0.4,1.0,LightIntensity)*vec3(0.0,1.0,1.0)+vec3(Color);"+
	"FragColor.a=1.0;"+
	"}";

	ASJ_fragmentShaderObject_rimLight = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_fragmentShaderObject_rimLight, fragmentShaderSource);
	gl.compileShader(ASJ_fragmentShaderObject_rimLight);

	if (gl.getShaderParameter(ASJ_fragmentShaderObject_rimLight, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_rimLight);
		if (error.length > 0) {
			alert("fragment");
			alert(error);
			uninitialize();
		}
	}
	//shader program

	ASJ_shaderProgramObject_rimLight = gl.createProgram();
	gl.attachShader(ASJ_shaderProgramObject_rimLight, ASJ_vertexShaderObject_rimLight);
	gl.attachShader(ASJ_shaderProgramObject_rimLight, ASJ_fragmentShaderObject_rimLight);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ASJ_shaderProgramObject_rimLight, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(ASJ_shaderProgramObject_rimLight, WebGLMacros.ASJ_ATTRIBUTE_NORMAL, "vNormal");

	gl.linkProgram(ASJ_shaderProgramObject_rimLight);
	if (!gl.getProgramParameter(ASJ_shaderProgramObject_rimLight, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_rimLight);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	ASJ_mvpUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "u_mvp_matrix");

	ASJ_viewMatrixUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "u_modelView_matrix");
	ASJ_ambientUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "Ambient");
	ASJ_lightColorUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "LightColor");
	ASJ_lightPositionUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "LightPosition");
	ASJ_shininessUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "Shininess");
	ASJ_strengthUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "Strength");
	ASJ_eyeDirectionUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "EyeDirection");
	ASJ_attenuationUniform_rimLight = gl.getUniformLocation(ASJ_shaderProgramObject_rimLight, "Attenuation");

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

function ASJ_Draw_rimLighting() {
	gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

	gl.useProgram(ASJ_shaderProgramObject_rimLight);
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();
	var translateMatrix = mat4.create();
	

	mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
	mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

	gl.uniformMatrix4fv(ASJ_viewMatrixUniform_rimLight, false, modelViewMatrix);
	gl.uniformMatrix4fv(ASJ_mvpUniform_rimLight, false, modelViewProjectionMatrix);

	var Ambient = new Float32Array([0.2, 0.2, 0.2, 1.0])  ;
	var LightColor =new Float32Array([1.0, 1.0, 1.0]);
	var lightPosition = new Float32Array([1.0, 1.0, -3.50]);

	var Eye =new Float32Array([0.0, 0.0, 1.0]);

	var shininess = 5.0;
	var strength = parseFloat(3.9);
	var attenuation = parseFloat(0.50);
	gl.uniform4fv(ASJ_ambientUniform_rimLight, Ambient);

	gl.uniform3fv(ASJ_lightColorUniform_rimLight, LightColor);
	gl.uniform3fv(ASJ_lightPositionUniform_rimLight, lightPosition);
	gl.uniform1f(ASJ_shininessUniform_rimLight, shininess);
	gl.uniform1f(ASJ_strengthUniform_rimLight, strength);

	gl.uniform3fv(ASJ_eyeDirectionUniform_rimLight, Eye);
	gl.uniform1f(ASJ_attenuationUniform_rimLight, attenuation);



	sphere.draw();
	
	requestAnimationFrame(ASJ_Draw_rimLighting, canvas);
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

	if (ASJ_shaderProgramObject_rimLight)
	{
		if (ASJ_vertexShaderObject_rimLight)
		{

			gl.detachShader(ASJ_shaderProgramObject_rimLight, ASJ_vertexShaderObject_rimLight);
			gl.deleteShader(ASJ_vertexShaderObject_rimLight);
			ASJ_vertexShaderObject_rimLight = null;
		}

		if (ASJ_fragmentShaderObject_rimLight) {

			gl.detachShader(ASJ_shaderProgramObject_rimLight, ASJ_fragmentShaderObject_rimLight);
			gl.deleteShader(ASJ_fragmentShaderObject_rimLight);
			ASJ_fragmentShaderObject_rimLight = null;
		}
		gl.deleteProgram(ASJ_shaderProgramObject_rimLight);
		ASJ_shaderProgramObject_rimLight = null;
    }
}








