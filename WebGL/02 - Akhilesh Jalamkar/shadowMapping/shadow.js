
var sphere = null;
var vertexShaderObject_shadowmap;
var fragmentShaderObject_shadowmap;
var shaderProgramObject_shadowmap;

var TEXTURE_SIZE_SHADOW = 512;

var ShaderProgramObject_camera;
var FragmentShaderObject_camera;
var VertexShaderObject_camera;

var renderuffer_shadow, shadowDepthtexture;


var projectionUnifrom_camera;
var lightMViewMatrixUniform_camera;

var viewPosUniform;
var colorUnifrom_camera;


var modelMatrixUniform_camera;
var lightProjectionMatrixUniform_camera;

var depthTextureUniform_camera;



var Vaofloor;
var gVbo_floor;
var vbo_floor_normal;
var vbo_floor_texCord;

var frameBufferobject;
var textureSamplerUniform;



var ProjectionMatrixUniform_Light;//Matrix


function initShadow()
{




    var vertexShaderSource =
		"attribute vec3 aVertexPosition;"+
		"uniform mat4 uPMatrix;"+
		"uniform mat4 uMVMatrix;"+
		"void main(void)"+
		"{"+
		"gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"+
		"}";
	vertexShaderObject_shadowmap = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_shadowmap, vertexShaderSource);
	gl.compileShader(vertexShaderObject_shadowmap);

	if (gl.getShaderParameter(vertexShaderObject_shadowmap, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(vertexShaderObject_shadowmap);
		if (error.length > 0) {
			alert("vertex shader depth" + error);
			ShadowUninit();
		}
	}

	var fragmentShaderSource =
		"precision mediump float;"+

	"vec4 encodeFloat(float depth)"+
	"{"+
	"const vec4 bitShift = vec4("+
			"256 * 256 * 256,"+
			"256 * 256,"+
			"256,"+
			"1.0"+
		");" +

		"const vec4 bitMask = vec4("+
	"0,"+
	"1.0 / 256.0,"+
	"1.0 / 256.0,"+
	"1.0 / 256.0"+
	");"+
		"vec4 comp = fract(depth * bitShift);"+
		"comp -= comp.xxyz * bitMask;"+
		"return comp;"+
		"}"+

		"void main(void) {"+
		"gl_FragColor = encodeFloat(gl_FragCoord.z);"+
	"}";

	fragmentShaderObject_shadowmap = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_shadowmap, fragmentShaderSource);
	gl.compileShader(fragmentShaderObject_shadowmap);

	if (gl.getShaderParameter(fragmentShaderObject_shadowmap, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(fragmentShaderObject_shadowmap);
		if (error.length > 0) {
			alert("fragment shader depth" + error);
			ShadowUninit();
		}
	}
	//shader program

	shaderProgramObject_shadowmap = gl.createProgram();
	gl.attachShader(shaderProgramObject_shadowmap, vertexShaderObject_shadowmap);
	gl.attachShader(shaderProgramObject_shadowmap, fragmentShaderObject_shadowmap);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(shaderProgramObject_shadowmap, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "aVertexPosition");

	gl.linkProgram(shaderProgramObject_shadowmap);
	if (!gl.getProgramParameter(shaderProgramObject_shadowmap, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(shaderProgramObject_shadowmap);
		if (error.length > 0) {
			alert(error);
			ShadowUninit();
		}
	}

	ProjectionMatrixUniform_Light = gl.getUniformLocation(shaderProgramObject_shadowmap, "uPMatrix");
	mvMatrixUniform=gl.getUniformLocation(shaderProgramObject_shadowmap, "uMVMatrix");

	//shadow shader

	var vertexShaderSource_shadow =
		"attribute vec3 aVertexPosition;"+

		"uniform mat4 uPMatrix;"+
		"uniform mat4 uMVMatrix;"+
	"uniform mat4 lightMViewMatrix;"+
	"uniform mat4 lightProjectionMatrix;"+

	"const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5,"+
		"0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);"+

		//"varying vec2 vDepthUv;"+
		"varying vec4 shadowPos;"+

		"void main(void) {"+
		"gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"+

		"shadowPos = texUnitConverter * lightProjectionMatrix * lightMViewMatrix * vec4(aVertexPosition, 1.0);"+
	"}";


	VertexShaderObject_camera = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(VertexShaderObject_camera, vertexShaderSource_shadow);
	gl.compileShader(VertexShaderObject_camera);

	if (gl.getShaderParameter(VertexShaderObject_camera, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(VertexShaderObject_camera);
		if (error.length > 0) {
			alert("vertex shader shadow \n" + error);
			ShadowUninit();
		}
	}

	var fragmentShaderSource_shadow =
		"precision mediump float;"+

	//"varying vec2 vDepthUv;"+
	"varying vec4 shadowPos;"+

	"uniform sampler2D depthColorTexture;"+
	"uniform vec3 uColor;"+

	"float decodeFloat(vec4 color) {"+
	"const vec4 bitShift = vec4("+
	"1.0 / (256.0 * 256.0 * 256.0),"+
	"1.0 / (256.0 * 256.0),"+
	"1.0 / 256.0,"+
	"1"+
	");"+
	"return dot(color, bitShift);"+
	"}"+

	"void main(void) {"+
	"vec3 fragmentDepth = shadowPos.xyz;"+
	"float shadowAcneRemover = 0.007;"+
	"fragmentDepth.z -= shadowAcneRemover;"+

	"float texelSize = 1.0 /512.0;"+
	"float amountInLight = 0.0;"+

	"for (int x = -1; x <= 1; x++) {"+
	"	for (int y = -1; y <= 1; y++) {"+
	"	float texelDepth = decodeFloat(texture2D(depthColorTexture,fragmentDepth.xy + vec2(x, y) * texelSize));"+
	"if (fragmentDepth.z < texelDepth) {"+
	"amountInLight += 1.0;"+
	"}"+
	"}"+
	"}"+
	"amountInLight /= 9.0;"+

	"gl_FragColor = vec4(amountInLight * uColor, 1.0);"+
	"}";

	FragmentShaderObject_camera = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(FragmentShaderObject_camera, fragmentShaderSource_shadow);
	gl.compileShader(FragmentShaderObject_camera);

	if (gl.getShaderParameter(FragmentShaderObject_camera, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(FragmentShaderObject_camera);
		if (error.length > 0) {
			alert("fragment shader shadow \n" + error);
			ShadowUninit();
		}
	}
	//shader program

	ShaderProgramObject_camera = gl.createProgram();
	gl.attachShader(ShaderProgramObject_camera, VertexShaderObject_camera);
	gl.attachShader(ShaderProgramObject_camera, FragmentShaderObject_camera);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ShaderProgramObject_camera, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "aVertexPosition");
	//gl.bindAttribLocation(gShaderProgramObject_Shadow, WebGLMacros.ASJ_ATTRIBUTE_NORMAL, "vNormal");

	gl.linkProgram(ShaderProgramObject_camera);
	if (!gl.getProgramParameter(ShaderProgramObject_camera, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(ShaderProgramObject_camera);
		if (error.length > 0) {
			alert(error);
			ShadowUninit();
		}
	}

	//Uniform for shadow shaders
	modelMatrixUniform_camera = gl.getUniformLocation(ShaderProgramObject_camera, "uMVMatrix");
	lightMViewMatrixUniform_camera = gl.getUniformLocation(ShaderProgramObject_camera, "lightMViewMatrix");
	projectionUnifrom_camera = gl.getUniformLocation(ShaderProgramObject_camera, "uPMatrix");
	lightProjectionMatrixUniform_camera = gl.getUniformLocation(ShaderProgramObject_camera, "lightProjectionMatrix");

	colorUnifrom_camera = gl.getUniformLocation(ShaderProgramObject_camera, "uColor");
	depthTextureUniform_camera = gl.getUniformLocation(ShaderProgramObject_camera, "depthColorTexture");




	//
	var floorNormal = new Float32Array([
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0]);
	//floor
	var floorVertex = new Float32Array([
		- 50.0, -5.0, -50.0, 1.0,
		-50.0, -5.0, 50.0, 1.0,
		50.0, -5.0, 50.0, 1.0,
		50.0, -5.0, -50.0, 1.0]);

	//sphere
	sphere = new Mesh();

	makeSphere(sphere, 3.0, 30, 30);


	//floor

	Vaofloor = gl.createVertexArray();
	gl.bindVertexArray(Vaofloor);

	gVbo_floor = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gVbo_floor);
	gl.bufferData(gl.ARRAY_BUFFER, floorVertex, gl.STATIC_DRAW);

	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_VERTEX, 4, gl.FLOAT, false, 0, null);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_VERTEX);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//normal
	vbo_floor_normal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_floor_normal);
	gl.bufferData(gl.ARRAY_BUFFER, floorNormal, gl.STATIC_DRAW);

	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 0, null);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_NORMAL);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindVertexArray(null);

    frameBufferobject = initFramebufferObject();
}
function initFramebufferObject() {
	var framebuffer;

	//create framebuffer object
	framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	// Create a texture object and set its size and parameters 
	shadowDepthtexture = gl.createTexture();// Create a texture object
	gl.bindTexture(gl.TEXTURE_2D, shadowDepthtexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEXTURE_SIZE_SHADOW, TEXTURE_SIZE_SHADOW, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	//set up wrapping modes
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	framebuffer.texture = shadowDepthtexture;// Store the texture object

	//Create a renderbuffer object
	renderuffer_shadow = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderuffer_shadow);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, TEXTURE_SIZE_SHADOW, TEXTURE_SIZE_SHADOW);


	// Attach the texture and the renderbuffer object to the FBO
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowDepthtexture, 0);

	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderuffer_shadow);

	//FBO status
	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (e !== gl.FRAMEBUFFER_COMPLETE) {
		console.log('Framebuffer object is incomplete: ' + e.toString());
		//return error();

	}
	gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindRenderbuffer(gl.RENDERBUFFER, null)

	return framebuffer;
}
var val = 2;
function Draw_Shadow() {

	gl.useProgram(shaderProgramObject_shadowmap);
	

	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBufferobject);
	gl.viewport(0, 0, TEXTURE_SIZE_SHADOW, TEXTURE_SIZE_SHADOW);
	
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	var modelMatrix = mat4.create();

	var lightProjectionMatrix=mat4.create();
	mat4.ortho(lightProjectionMatrix,-40, 40, -40, 40, 1.0, 80);

	var lightViewMatrix = mat4.create();
	var lightPosition = new Float32Array([0, 2, -3]);
	lightPosition[0] = val;
	mat4.lookAt(lightViewMatrix, lightPosition, [0, 0, 0], [0, 1, 0]);

	gl.uniformMatrix4fv(ProjectionMatrixUniform_Light, false, lightProjectionMatrix);
	mat4.translate(modelMatrix, modelMatrix, [0, 0, -5]);
	mat4.multiply(modelMatrix, lightViewMatrix, modelMatrix);
	gl.uniformMatrix4fv(mvMatrixUniform, false, modelMatrix);

	//render objects
	//sphere
	sphere.draw();

	//render floor
	gl.bindVertexArray(Vaofloor);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(null);

	//Render scene from camera view
	gl.useProgram(ShaderProgramObject_camera);
	gl.viewport(0, 0, 1024, 1024);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var camera = mat4.create();
	mat4.translate(camera, camera, [0, 0, 80]);

	//var xRotMatrix = mat4.create()
//	var yRotMatrix = mat4.create()
	//mat4.rotateX(xRotMatrix, xRotMatrix, -xRotation)
	//mat4.rotateY(yRotMatrix, yRotMatrix, yRotation)
	//mat4.multiply(camera, xRotMatrix, camera)
	//mat4.multiply(camera, yRotMatrix, camera)

	mat4.lookAt(camera, [-15, -1, -20], [0, 3, 0], [0, 1, 0]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, frameBufferobject.texture);
	gl.uniform1i(depthTextureUniform_camera, 0);

	gl.uniformMatrix4fv(lightMViewMatrixUniform_camera, false, lightViewMatrix);
	gl.uniformMatrix4fv(lightProjectionMatrixUniform_camera, false, lightProjectionMatrix);

	//mat4.perspective(perspectiveProjectionMatrix, 45, 1, 0.1, 900);
	gl.uniformMatrix4fv(projectionUnifrom_camera, false, perspectiveProjectionMatrix );

	var ModelMatrix_camera = mat4.create();
	mat4.translate(ModelMatrix_camera, ModelMatrix_camera, [0, 0, -5]);

	var lightMVMatrix = mat4.create();
	mat4.multiply(lightMVMatrix, lightViewMatrix, ModelMatrix_camera);//bring to light space

	gl.uniformMatrix4fv(lightMViewMatrixUniform_camera, false, lightMVMatrix);

	mat4.multiply(ModelMatrix_camera, camera, ModelMatrix_camera);

	gl.uniformMatrix4fv(modelMatrixUniform_camera, false, ModelMatrix_camera);

	gl.uniform3fv(colorUnifrom_camera, [0.36, 0.66, 0.8]);
	//draw object
	//sphere
	sphere.draw();

	
	// floor

	gl.uniformMatrix4fv(lightMViewMatrixUniform_camera, false, lightViewMatrix);
	gl.uniformMatrix4fv(modelMatrixUniform_camera, false, camera);
	gl.uniform3fv(colorUnifrom_camera, [0.6, 0.6, 0.6])

	//render floor
	gl.bindVertexArray(Vaofloor);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);


	gl.useProgram(null);

	requestAnimationFrame(Draw_Shadow, canvas);
}