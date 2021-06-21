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


var perspectiveProjectionMatrix;


var ASJ_vertexShaderObject_pointLight;
var ASJ_fragmentShaderObject_pointLight;
var ASJ_shaderProgramObject_pointLight;


var ASJ_mvpUniform_pointLight;


var ASJ_viewMatrixUniform_pointLight;
var ASJ_ambientUniform_pointLight;
var ASJ_lightColorUniform_pointLight;
var ASJ_lightPositionUniform_pointLight;
var ASJ_shininessUniform_pointLight;
var ASJ_strengthUniform_pointLight;
var ASJ_eyeDirectionUniform_pointLight;
var ASJ_attenuationUniform_pointLight;

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

	ASJ_init_pointLight();
	resize();
	ASJ_Draw_pointLight();
}
function ASJ_init_pointLight() {
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
	"out vec3 Normal;"+
	"out vec4 Position;"+
	"\n" +
	"void main(void)" +
	"{"+
	"Color=vec4(0.0,1.0,1.0,1.0);"+
	"u_normal_matrix=mat3(transpose(inverse(u_mvp_matrix)));"+
	"Normal=normalize(u_normal_matrix*vNormal);"+

	"Position=u_modelView_matrix*vPosition;"+

	"gl_Position=u_mvp_matrix * vPosition;" +
	"}";
	ASJ_vertexShaderObject_pointLight = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_vertexShaderObject_pointLight, vertexShaderSource);
	gl.compileShader(ASJ_vertexShaderObject_pointLight);

	if (gl.getShaderParameter(ASJ_vertexShaderObject_pointLight, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_pointLight);
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
		"uniform vec4 Ambient;"+
	"uniform vec3 LightColor;"+
	"uniform vec3 LightPosition;"+
	"uniform float Shininess;"+
	"uniform float Strength;"+

	"uniform vec3 EyeDirection;"+
	"uniform float Attenuation;"+

	"in vec4 Color;"+
	"in vec3 Normal;"+
	"in vec4 Position;"+

	"out  vec4 FragColor;"+
		"\n" +
	"void main(void)" +
		"{" +
		
		"vec3 lightDirection=vec3(Position)-LightPosition;" +
		"\n" +
	"float lightDistance=length(lightDirection);"+
		"lightDirection= lightDirection / lightDistance;" +
		"\n" +
		"vec3 HalfVector=normalize(EyeDirection - lightDirection);" +
		"\n" +
	"float AttenuaFactor = 1.0 / (Attenuation * lightDistance * lightDistance);"+
		
		"float diffuse=max(0.0f,-1.0*dot(Normal,lightDirection)) * 0.5;" +
		"\n" +
	"float specular=max(0.0f,1.0*dot(Normal,HalfVector));"+
		
	"if(diffuse<=0.00001)"+
	"{"+
	"specular=0.0f;"+
	"}"+
	"else"+
	"{"+
	"specular=pow(specular,Shininess);"+
	"}"+
		"\n" +
	"vec4 scatteredLight=Ambient + vec4(LightColor*diffuse*AttenuaFactor,0.0);"+
	"vec4 ReflectedLight=vec4(LightColor * specular *Strength*AttenuaFactor,0.0);"+

	"FragColor=min(Color * scatteredLight + ReflectedLight,vec4(1.0));"+

	"}";

	ASJ_fragmentShaderObject_pointLight = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_fragmentShaderObject_pointLight, fragmentShaderSource);
	gl.compileShader(ASJ_fragmentShaderObject_pointLight);

	if (gl.getShaderParameter(ASJ_fragmentShaderObject_pointLight, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_pointLight);
		if (error.length > 0) {
			alert("fragment");
			alert(error);
			uninitialize();
		}
	}
	//shader program

	ASJ_shaderProgramObject_pointLight = gl.createProgram();
	gl.attachShader(ASJ_shaderProgramObject_pointLight, ASJ_vertexShaderObject_pointLight);
	gl.attachShader(ASJ_shaderProgramObject_pointLight, ASJ_fragmentShaderObject_pointLight);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ASJ_shaderProgramObject_pointLight, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(ASJ_shaderProgramObject_pointLight, WebGLMacros.ASJ_ATTRIBUTE_NORMAL, "vNormal");

	gl.linkProgram(ASJ_shaderProgramObject_pointLight);
	if (!gl.getProgramParameter(ASJ_shaderProgramObject_pointLight, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_pointLight);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	ASJ_mvpUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "u_mvp_matrix");

	ASJ_viewMatrixUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "u_modelView_matrix");
	ASJ_ambientUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "Ambient");
	ASJ_lightColorUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "LightColor");
	ASJ_lightPositionUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "LightPosition");
	ASJ_shininessUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "Shininess");
	ASJ_strengthUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "Strength");
	ASJ_eyeDirectionUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "EyeDirection");
	ASJ_attenuationUniform_pointLight = gl.getUniformLocation(ASJ_shaderProgramObject_pointLight, "Attenuation");

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

function ASJ_Draw_pointLight() {
	gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

	gl.useProgram(ASJ_shaderProgramObject_pointLight);
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();
	var translateMatrix = mat4.create();
	

	mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
	mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

	gl.uniformMatrix4fv(ASJ_viewMatrixUniform_pointLight, false, modelViewMatrix);
	gl.uniformMatrix4fv(ASJ_mvpUniform_pointLight, false, modelViewProjectionMatrix);

	var Ambient = new Float32Array([0.2, 0.2, 0.2, 1.0])  ;
	var LightColor =new Float32Array([1.0, 1.0, 1.0]);
	var lightPosition = new Float32Array([1.0, 1.0, -3.50]);

	var Eye =new Float32Array([0.0, 0.0, 1.0]);

	var shininess = 5.0;
	var strength = parseFloat(3.9);
	var attenuation = parseFloat(0.50);
	gl.uniform4fv(ASJ_ambientUniform_pointLight, Ambient);

	gl.uniform3fv(ASJ_lightColorUniform_pointLight, LightColor);
	gl.uniform3fv(ASJ_lightPositionUniform_pointLight, lightPosition);
	gl.uniform1f(ASJ_shininessUniform_pointLight, shininess);
	gl.uniform1f(ASJ_strengthUniform_pointLight, strength);

	gl.uniform3fv(ASJ_eyeDirectionUniform_pointLight, Eye);
	gl.uniform1f(ASJ_attenuationUniform_pointLight, attenuation);



	sphere.draw();
	
	requestAnimationFrame(ASJ_Draw_pointLight, canvas);
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

	if (ASJ_shaderProgramObject_pointLight)
	{
		if (ASJ_vertexShaderObject_pointLight)
		{

			gl.detachShader(ASJ_shaderProgramObject_pointLight, ASJ_vertexShaderObject_pointLight);
			gl.deleteShader(ASJ_vertexShaderObject_pointLight);
			ASJ_vertexShaderObject_pointLight = null;
		}

		if (ASJ_fragmentShaderObject_pointLight) {

			gl.detachShader(ASJ_shaderProgramObject_pointLight, ASJ_fragmentShaderObject_pointLight);
			gl.deleteShader(ASJ_fragmentShaderObject_pointLight);
			ASJ_fragmentShaderObject_pointLight = null;
		}
		gl.deleteProgram(ASJ_shaderProgramObject_pointLight);
		ASJ_shaderProgramObject_pointLight = null;
    }
}








