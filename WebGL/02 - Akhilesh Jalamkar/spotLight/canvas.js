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

var ASJ_vertexShaderObject_spotLight;
var ASJ_fragmentShaderObject_spotLight;
var ASJ_shaderProgramObject_spotLight;



var ASJ_mvpUniform_spotLight;

var perspectiveProjectionMatrix;
var ASJ_viewMatrixUniform_spot;
var ASJ_ambientUniform_spot;
var ASJ_lightColorUniform_spot;
var ASJ_lightPositionUniform_spot;
var ASJ_shininessUniform_spot;
var ASJ_strengthUniform_spot;
var ASJ_eyeDirectionUniform_spot;
var ASJ_attenuationUniform_spot;

var ASJ_coneDirUniform ;
var ASJ_spotCosCutoffUniform;
var ASJ_spotExponentUniform;

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

	ASJ_init_spotLight();
	resize();
	ASJ_Draw_spotLight();
}
function ASJ_init_spotLight() {
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
	"Color=vec4(1.0,0.0,0.0,1.0);"+
	"u_normal_matrix=mat3(transpose(inverse(u_modelView_matrix)));"+
	"Normal=normalize(u_normal_matrix * vNormal);"+

	"Position=u_modelView_matrix * vPosition;"+

	"gl_Position=u_mvp_matrix * vPosition;" +
	"}";
	ASJ_vertexShaderObject_spotLight = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_vertexShaderObject_spotLight, vertexShaderSource);
	gl.compileShader(ASJ_vertexShaderObject_spotLight);

	if (gl.getShaderParameter(ASJ_vertexShaderObject_spotLight, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_spotLight);
		if (error.length > 0)
		{
			alert("vertex spotLight \n");
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
	"uniform float ConstantAttenuation;"+
	"float linearA=1.0f;"+
	"float quadraticA=0.5f;"+

	"uniform vec3 ConeDirection;"+
	"uniform float SpotCosCutoff;"+
	"uniform float SpotExponent;"+



	"in vec4 Color;"+
	"in vec3 Normal;"+
	"in vec4 Position;"+
		"vec3 normalizedConeDirection;"+
	"out  vec4 FragColor;"+

	"void main(void)" +
	"{" +
	"vec3 lightDirection=LightPosition-vec3(Position);"+
	"float lightDistance=length(lightDirection);"+

	"lightDirection=normalize(lightDirection);"+

	"float AttenuaFactor=1.0 / (ConstantAttenuation + linearA*lightDistance + quadraticA * lightDistance * lightDistance);"+
		"normalizedConeDirection=normalize(ConeDirection);"+
	"float spotCos=dot(lightDirection,-normalizedConeDirection);"+

	"vec3 HalfVector=normalize(lightDirection+EyeDirection);"+


	"float diffuse=max(0.0f,dot(Normal,lightDirection));"+
	"float specular=max(0.0f,dot(Normal,HalfVector));"+


	"if(spotCos<SpotCosCutoff)"+
	"{"+
	"AttenuaFactor=0.0;"+
	"}"+
	"else"+
	"{"+
	"AttenuaFactor=AttenuaFactor*pow(spotCos,SpotExponent);"+
	"}"+

	"if(diffuse==0.0)"+
	"{"+
	"specular=0.0f;"+
	"}"+
	"else"+
	"{"+
	"specular=pow(specular,Shininess)*Strength;"+
	"}"+

	"vec4 scatteredLight=Ambient + vec4(LightColor*diffuse*AttenuaFactor,0.0);"+
	"vec4 ReflectedLight=vec4(LightColor * specular *AttenuaFactor,0.0);"+

	"FragColor=min(Color * scatteredLight + ReflectedLight,vec4(1.0));"+

	"}";

	ASJ_fragmentShaderObject_spotLight = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_fragmentShaderObject_spotLight, fragmentShaderSource);
	gl.compileShader(ASJ_fragmentShaderObject_spotLight);

	if (gl.getShaderParameter(ASJ_fragmentShaderObject_spotLight, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_spotLight);
		if (error.length > 0) {
			alert("fragment spotLight \n");
			alert(error);
			uninitialize();
		}
	}
	//shader program

	ASJ_shaderProgramObject_spotLight = gl.createProgram();
	gl.attachShader(ASJ_shaderProgramObject_spotLight, ASJ_vertexShaderObject_spotLight);
	gl.attachShader(ASJ_shaderProgramObject_spotLight, ASJ_fragmentShaderObject_spotLight);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ASJ_shaderProgramObject_spotLight, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(ASJ_shaderProgramObject_spotLight, WebGLMacros.ASJ_ATTRIBUTE_NORMAL, "vNormal");

	gl.linkProgram(ASJ_shaderProgramObject_spotLight);
	if (!gl.getProgramParameter(ASJ_shaderProgramObject_spotLight, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_spotLight);
		if (error.length > 0) {
			alert("ASJ_shaderProgramObject_spotLight"+error);
			uninitialize();
		}
	}

	ASJ_mvpUniform_spotLight = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "u_mvp_matrix");
	ASJ_viewMatrixUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "u_modelView_matrix");
	ASJ_ambientUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "Ambient");
	ASJ_lightColorUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "LightColor");
	ASJ_lightPositionUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "LightPosition");
	ASJ_shininessUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "Shininess");
	ASJ_strengthUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "Strength");
	ASJ_eyeDirectionUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "EyeDirection");
	ASJ_attenuationUniform_spot = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "Attenuation");

	ASJ_coneDirUniform = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "ConeDirection");
	ASJ_spotCosCutoffUniform = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "SpotCosCutoff");
	ASJ_spotExponentUniform = gl.getUniformLocation(ASJ_shaderProgramObject_spotLight, "SpotExponent");

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

function ASJ_Draw_spotLight() {
	gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

	gl.useProgram(ASJ_shaderProgramObject_spotLight);
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();
	var translateMatrix = mat4.create();
	

	mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
	mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

	gl.uniformMatrix4fv(ASJ_viewMatrixUniform_spot, false, modelViewMatrix);
	gl.uniformMatrix4fv(ASJ_mvpUniform_spotLight, false, modelViewProjectionMatrix);

	var Ambient = new Float32Array([0.2, 0.2, 0.2, 1.0])  ;
	var LightColor =new Float32Array([1.0, 1.0, 1.0]);
	var lightPosition = new Float32Array([0.50, 0.50, 2.50]);

	var Eye = new Float32Array([0.0, 0.0, 0.0]);
	var SpotDirection = new Float32Array([0.0, 0.0, -1]);

	var shininess = 5.0;
	var strength = parseFloat(3.9);
	var attenuation = parseFloat(0.50);

	var spotExponent = 142.0;
	var spotCosCutOff = parseFloat( Math.cos(3.14159 / 32));

	gl.uniform4fv(ASJ_ambientUniform_spot, Ambient);

	gl.uniform3fv(ASJ_lightColorUniform_spot, LightColor);
	gl.uniform3fv(ASJ_lightPositionUniform_spot, lightPosition);
	gl.uniform1f(ASJ_shininessUniform_spot, shininess);
	gl.uniform1f(ASJ_strengthUniform_spot, strength);

	gl.uniform3fv(ASJ_eyeDirectionUniform_spot, Eye);
	gl.uniform1f(ASJ_attenuationUniform_spot, attenuation);


	gl.uniform3fv(ASJ_coneDirUniform, SpotDirection);
	gl.uniform1f(ASJ_spotExponentUniform, spotExponent);
	gl.uniform1f(ASJ_spotCosCutoffUniform, spotCosCutOff);



	sphere.draw();
	
	requestAnimationFrame(ASJ_Draw_spotLight, canvas);
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

	if (ASJ_shaderProgramObject_spotLight)
	{
		if (ASJ_vertexShaderObject_spotLight)
		{

			gl.detachShader(ASJ_shaderProgramObject_spotLight, ASJ_vertexShaderObject_spotLight);
			gl.deleteShader(ASJ_vertexShaderObject_spotLight);
			ASJ_vertexShaderObject_spotLight = null;
		}

		if (ASJ_fragmentShaderObject_spotLight) {

			gl.detachShader(ASJ_shaderProgramObject_spotLight, ASJ_fragmentShaderObject_spotLight);
			gl.deleteShader(ASJ_fragmentShaderObject_spotLight);
			ASJ_fragmentShaderObject_spotLight = null;
		}
		gl.deleteProgram(ASJ_shaderProgramObject_spotLight);
		ASJ_shaderProgramObject_spotLight = null;
    }
}









