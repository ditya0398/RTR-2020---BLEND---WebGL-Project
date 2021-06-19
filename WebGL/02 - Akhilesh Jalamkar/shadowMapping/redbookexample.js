var gl= null;
var canvas = null;
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;
var requestAnimationFrame;

var sphere = null;

var TEXTURE_SIZE = 512;

const WebGLMacros = {
	ASJ_ATTRIBUTE_VERTEX: 0,
	ASJ_ATTRIBUTE_COLOR: 1,
	ASJ_ATTRIBUTE_NORMAL: 2,
	ASJ_ATTRIBUTE_TEXTURE: 3,
};

var vertexShaderObject;
var fragmentShaderObject;
var shaderProgramObject;



var gShaderProgramObject_Shadow;
var gFragmentShaderObject_Shadow;
var gVertexShaderObject_Shadow;

var depthBuffer, texture;


var projectionUnifrom;
var viewMatrixUniform;
var lightSpaceUniform;
var viewPosUniform;
var lightPosUniform;
var modelUniform;

var modelMatrixUniform;
var shadowMatrixUniform;

var depthTextureUniform;


var material_ambientUniform;
var material_diffuseUniform;
var material_specularUniform;
var material_specular_powerUniform;

var aspect;


var Vaofloor;
var gVbo_floor;
var vbo_floor_normal;
var vbo_floor_texCord;

var depth_fbo;
var textureSamplerUniform;


var depth_texture;

var MVPUniform_Light_PointView;//Matrix


var perspectiveProjectionMatrix;

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

	init();
	resize();
	Draw();
}
function init() {
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
		"precision highp float;"+
		"in vec4 vPosition;" +
		"uniform mat4 u_mvp_matrix;" +
		"void main(void)" +
		"{" +
		"gl_Position=u_mvp_matrix * vPosition;" +
		"}";
	vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject, vertexShaderSource);
	gl.compileShader(vertexShaderObject);

	if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(vertexShaderObject);
		if (error.length > 0)
		{
			alert("vertex shader depth" + error);
			uninitialize();
		}
	}

	var fragmentShaderSource =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"out vec4 FragColor;" +
		"void main(void)" +
		"{" +
		"FragColor=vec4(1.0,1.0,1.0,1.0);" +
		"}";

	fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject, fragmentShaderSource);
	gl.compileShader(fragmentShaderObject);

	if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(fragmentShaderObject);
		if (error.length > 0) {
			alert("fragment shader depth"+error);
			uninitialize();
		}
	}
	//shader program

	shaderProgramObject = gl.createProgram();
	gl.attachShader(shaderProgramObject, vertexShaderObject);
	gl.attachShader(shaderProgramObject, fragmentShaderObject);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(shaderProgramObject, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");

	gl.linkProgram(shaderProgramObject);
	if (!gl.getProgramParameter(shaderProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	MVPUniform_Light_PointView = gl.getUniformLocation(shaderProgramObject, "u_mvp_matrix");


	//shadow shader

	var vertexShaderSource_shadow =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"precision highp int;" +
		"in vec4 vPosition;" +
		"in vec3 vNormal;" +
		"uniform mat4 model_matrix;"+
		"uniform mat4 view_matrix;"+
		"uniform mat4 projection_matrix;"+
		"uniform mat4 shadow_matrix;"+
		
		
		"out vec4 shadow_coord;"+
		"out vec3 world_coord;"+
		"out vec3 eye_coord;"+
		"out vec3 normal;"+
		
		
		"void main(void)"+
		"{"+

		"vec4 world_pos= model_matrix * vPosition;"+

		"vec4 eye_pos =view_matrix * world_pos;"+

		"vec4 clip_pos=projection_matrix * eye_pos;"+

		"world_coord=world_pos.xyz;"+

		"eye_coord=eye_pos.xyz;"+

		"shadow_coord= shadow_matrix * world_pos;"+
		
		"normal=mat3(view_matrix * model_matrix)*vNormal;"+
		
		"gl_Position=clip_pos;" +

		"}";
	gVertexShaderObject_Shadow = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(gVertexShaderObject_Shadow, vertexShaderSource_shadow);
	gl.compileShader(gVertexShaderObject_Shadow);

	if (gl.getShaderParameter(gVertexShaderObject_Shadow, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(gVertexShaderObject_Shadow);
		if (error.length > 0) {
			alert("vertex shader shadow \n"+ error);
			uninitialize();
		}
	}

	var fragmentShaderSource_shadow =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"precision highp int;" +
		
		
		//"uniform highp sampler2DShadow depth_texture;"+
		"uniform highp sampler2D depth_texture;" +
		"uniform vec3 light_position;"+

		"uniform vec3 material_ambient;"+
		"uniform vec3 material_diffuse;"+
		"uniform vec3 material_specular;"+
		"uniform float material_specular_power;"+

		"out vec4 FragColor;"+
	
		"in vec4 shadow_coord;"+
		"in vec3 world_coord;"+
		"in vec3 eye_coord;"+
		"in vec3 normal;"+
		
		
		"void main(void)"+
		"{" +
			
		"vec3 N=normal;"+
			
		"vec3 L= normalize(light_position - world_coord);" +
			
		"vec3 R =reflect(-L,N);" +
			
		"vec3 E=normalize(eye_coord);"+
		"float NdotL=dot(N,L);"+
		"float EdotR=dot(-E,R);"+
			
		"float diffuse = max(NdotL,0.0);"+
		"float specular=max(pow(EdotR,material_specular_power), 0.0);" +

		"vec3 shadow=(shadow_coord.xyz/shadow_coord.w)*0.5 + 0.5;" +

		"vec4 rgbaDepth=texture(depth_texture,shadow.xy);" +

		"float result = rgbaDepth.r;" +
		"result=(shadow.z > result + 0.005) ? 0.7:1.0;"+
		//"float result=textureProj(depth_texture,shadow_coord);"+

		"FragColor=vec4(material_ambient + result * (material_diffuse * diffuse + material_specular * specular ),1.0);"+
		"}";

	gFragmentShaderObject_Shadow = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(gFragmentShaderObject_Shadow, fragmentShaderSource_shadow);
	gl.compileShader(gFragmentShaderObject_Shadow);

	if (gl.getShaderParameter(gFragmentShaderObject_Shadow, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(gFragmentShaderObject_Shadow);
		if (error.length > 0) {
			alert("fragment shader shadow \n" + error);
			uninitialize();
		}
	}
	//shader program

	gShaderProgramObject_Shadow = gl.createProgram();
	gl.attachShader(gShaderProgramObject_Shadow, gVertexShaderObject_Shadow);
	gl.attachShader(gShaderProgramObject_Shadow, gFragmentShaderObject_Shadow);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(gShaderProgramObject_Shadow, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(gShaderProgramObject_Shadow, WebGLMacros.ASJ_ATTRIBUTE_NORMAL, "vNormal");

	gl.linkProgram(gShaderProgramObject_Shadow);
	if (!gl.getProgramParameter(gShaderProgramObject_Shadow, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(gShaderProgramObject_Shadow);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	//Uniform for shadow shaders
	modelMatrixUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "model_matrix");
	viewMatrixUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "view_matrix");
	projectionUnifrom = gl.getUniformLocation(gShaderProgramObject_Shadow, "projection_matrix");
	shadowMatrixUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "shadow_matrix");
	lightPosUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "light_position");
	material_ambientUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "material_ambient");
	material_diffuseUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "material_diffuse");
	material_specularUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "material_specular");
	material_specular_powerUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "material_specular_power");

	depthTextureUniform = gl.getUniformLocation(gShaderProgramObject_Shadow, "depth_texture");


	

	//
	var floorNormal= new Float32Array([
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


	
	depth_fbo = initFramebufferObject();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	perspectiveProjectionMatrix = mat4.create();
}

function initFramebufferObject()
{
	var framebuffer;

	//create framebuffer object
	framebuffer = gl.createFramebuffer();

	// Create a texture object and set its size and parameters 
	texture = gl.createTexture();// Create a texture object
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEXTURE_SIZE, TEXTURE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
	//set up wrapping modes
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	framebuffer.texture = texture;// Store the texture object

	//Create a renderbuffer object
	depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, TEXTURE_SIZE, TEXTURE_SIZE);
	

	// Attach the texture and the renderbuffer object to the FBO
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

	//FBO status
	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (e !== gl.FRAMEBUFFER_COMPLETE) {
		console.log('Framebuffer object is incomplete: ' + e.toString());
		//return error();

	}

	return framebuffer;
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

	//mat4.perspective(perspectiveProjectionMatrix, 45, parseFloat(canvas.width) / parseFloat(canvas.height), parseFloat( 0.1), 100);
	aspect = parseFloat(canvas.height) / parseFloat(canvas.width);
	
}
var val=2;
function Draw() {
	gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

	
	//
	var light_position = new Float32Array([0, 10.0, 25.0]);
	var Y = new Float32Array([0.0, 1.0, 0.0]);
	var eye = [0, 0, 0];
	//Matrices for rendering Scene
	var rotationMatrix = mat4.create();
	var scene_modelMatrix = mat4.create();
	mat4.translate(scene_modelMatrix, scene_modelMatrix, [0, 0,-25 ]);
	var scene_viewMatrix = mat4.create();
	var scene_ProjectionMatrix = mat4.create();
	light_position[0] = val;
	mat4.frustum(scene_ProjectionMatrix ,-1.0, 1.0, -aspect, aspect, 1, 100.0);//aspect ratio

	mat4.translate(scene_viewMatrix, scene_viewMatrix, [0.0,-5.0, -30.0]);
	//var scale_bias_matrix = mat4.create();



	//Matrices  for rendering Scene from light position
	var light_view_matrix = mat4.create();
	mat4.lookAt(light_view_matrix, light_position, [0, 0, 0], [0.0, 1.0, 0.0]);

	var light_projection_matrix = mat4.create();
	mat4.frustum(light_projection_matrix, -1.0, 1.0, -1.0, 1.0, 100.0);

	var shadow_matrix = mat4.create();
	mat4.multiply(shadow_matrix, light_projection_matrix, light_view_matrix);

	
	gl.useProgram(shaderProgramObject);
	gl.bindFramebuffer(gl.FRAMEBUFFER, depth_fbo);
	gl.viewport(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
	gl.clearDepth(1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0, 1, 1,1);
	gl.enable(gl.POLYGON_OFFSET_FILL);//
	gl.polygonOffset(1.0, 2.0);//
	

	mat4.multiply(shadow_matrix, shadow_matrix, scene_modelMatrix);


	gl.uniformMatrix4fv(MVPUniform_Light_PointView, false, shadow_matrix);
	//sphere
	sphere.draw();

	//render floor
	gl.bindVertexArray(Vaofloor);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(null);

	//Reset viewport default framebuffer
	
	
	
	gl.useProgram(gShaderProgramObject_Shadow);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.uniformMatrix4fv(modelMatrixUniform, false, scene_modelMatrix);
	gl.uniformMatrix4fv(viewMatrixUniform, false, scene_viewMatrix);
	gl.uniformMatrix4fv(projectionUnifrom, false, scene_ProjectionMatrix);
	gl.uniformMatrix4fv(shadowMatrixUniform, false, shadow_matrix);
	gl.uniform3fv(lightPosUniform, light_position);

	//depth texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, depth_fbo.texture);
	gl.uniform1i(depthTextureUniform, 0);

	//material properties  floor
	gl.uniform3fv(material_ambientUniform, [0.1, 0.1, 0.1]);
	gl.uniform3fv(material_diffuseUniform,  [0.1, 0.5, 0.1]);
	gl.uniform3fv(material_specularUniform,  [0.1, 0.1, 0.1]);
	gl.uniform1f(material_specular_powerUniform, 3.0);



	//render floor
	gl.bindVertexArray(Vaofloor);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	//material properties  sphere
	gl.uniform3fv(material_ambientUniform, [0.1, 0.1, 0.1]);
	gl.uniform3fv(material_diffuseUniform,  [0.3, 0.2, 0.8]);
	gl.uniform3fv(material_specularUniform,  [1, 1, 1]);
	gl.uniform1f(material_specular_powerUniform, 25.0);

	gl.uniformMatrix4fv(modelMatrixUniform, false, scene_modelMatrix);
	sphere.draw();

	gl.useProgram(null);
	
	requestAnimationFrame(Draw, canvas);
}




function keyDown(event) {
	switch (event.keyCode) {

		case 27:
			uninitialize();
			window.close();
			break;
		case 100:
			val = val - 0.5;
			break;
		case 102:
			val = val + 0.5;
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

	if (shaderProgramObject)
	{
		if (vertexShaderObject)
		{

			gl.detachShader(shaderProgramObject, vertexShaderObject);
			gl.deleteShader(vertexShaderObject);
			vertexShaderObject = null;
		}

		if (fragmentShaderObject) {

			gl.detachShader(shaderProgramObject, fragmentShaderObject);
			gl.deleteShader(fragmentShaderObject);
			fragmentShaderObject = null;
		}
		gl.deleteProgram(shaderProgramObject);
		shaderProgramObject = null;
    }
}









