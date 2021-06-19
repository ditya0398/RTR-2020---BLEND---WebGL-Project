var gl= null;
var canvas = null;
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;
var requestAnimationFrame;

var sphere = null;

var ASJ_TEXTURE_SIZE =1024;

const WebGLMacros = {
	ASJ_ATTRIBUTE_VERTEX: 0,
	ASJ_ATTRIBUTE_COLOR: 1,
	ASJ_ATTRIBUTE_NORMAL: 2,
	ASJ_ATTRIBUTE_TEXTURE: 3,
};

var ASJ_vertexShaderObject_depthMap;
var ASJ_fragmentShaderObject_depthMap;
var ASJ_shaderProgramObject_depthMap;



var ASJ_ShaderProgramObject_Shadow;
var ASJ_gFragmentShaderObject_Shadow;
var ASJ_gVertexShaderObject_Shadow;




var ASJ_MvpMatrixFromLightUniform;
var ASJ_mvpMatrixUniform;
var ASJ_depthTextureUniform;

var ASJ_aspect;


var ASJ_Vaofloor;
var ASJ_gVbo_floor;
var ASJ_vbo_floor_normal;
var ASJ_vbo_floor_texCord;

var ASJ_depth_fbo;




var ASJ_MVPUniform_Light_PointView;//Matrix


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

	ASJ_init_shadow();
	resize();
	ASJ_Draw_shadow();
}
function ASJ_init_shadow() {
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
		"in vec4 vPosition;\n" +
		"uniform mat4 u_MvpMatrix;\n" +
		"void main() {" +
		"gl_Position = u_MvpMatrix * vPosition;\n" +
		"}";
	ASJ_vertexShaderObject_depthMap = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_vertexShaderObject_depthMap, vertexShaderSource);
	gl.compileShader(ASJ_vertexShaderObject_depthMap);

	if (gl.getShaderParameter(ASJ_vertexShaderObject_depthMap, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_depthMap);
		if (error.length > 0)
		{
			alert("vertex shader depth" + error);
			uninitialize();
		}
	}

	var fragmentShaderSource =
		"#version 300 es" +
		"\n" +
		"precision mediump float;" +
		"out vec4 FragColor;" +
		"void main(void)" +
		"{" +
		" FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);" +
		"}";

	ASJ_fragmentShaderObject_depthMap = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_fragmentShaderObject_depthMap, fragmentShaderSource);
	gl.compileShader(ASJ_fragmentShaderObject_depthMap);

	if (gl.getShaderParameter(ASJ_fragmentShaderObject_depthMap, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_depthMap);
		if (error.length > 0) {
			alert("fragment shader depth"+error);
			uninitialize();
		}
	}
	//shader program

	ASJ_shaderProgramObject_depthMap = gl.createProgram();
	gl.attachShader(ASJ_shaderProgramObject_depthMap, ASJ_vertexShaderObject_depthMap);
	gl.attachShader(ASJ_shaderProgramObject_depthMap, ASJ_fragmentShaderObject_depthMap);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ASJ_shaderProgramObject_depthMap, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");

	gl.linkProgram(ASJ_shaderProgramObject_depthMap);
	if (!gl.getProgramParameter(ASJ_shaderProgramObject_depthMap, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_depthMap);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	ASJ_MVPUniform_Light_PointView = gl.getUniformLocation(ASJ_shaderProgramObject_depthMap, "u_MvpMatrix");


	//shadow shader

	var vertexShaderSource_shadow =
		"#version 300 es" +
		"\n" +
		"in vec4 a_Position;\n" +
		"in vec4 a_Color;\n" +
		"uniform mat4 u_MvpMatrix;\n" +
		"uniform mat4 u_MvpMatrixFromLight;\n" +
		"out vec4 v_PositionFromLight;\n" +
		"out vec4 v_Color;\n" +
		"void main() {\n" +
		"  gl_Position = u_MvpMatrix * a_Position;\n" +
		"v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n" +
		" v_Color = a_Color;\n" +
		"}";
	ASJ_gVertexShaderObject_Shadow = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_gVertexShaderObject_Shadow, vertexShaderSource_shadow);
	gl.compileShader(ASJ_gVertexShaderObject_Shadow);

	if (gl.getShaderParameter(ASJ_gVertexShaderObject_Shadow, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_gVertexShaderObject_Shadow);
		if (error.length > 0) {
			alert("vertex shader shadow \n"+ error);
			uninitialize();
		}
	}

	var fragmentShaderSource_shadow =
		"#version 300 es" +
		"\n" +
		"precision mediump float;" +
		"uniform sampler2D u_ShadowMap;\n" +
		"in vec4 v_PositionFromLight;\n" +
		"in vec4 v_Color;\n" +
		"out vec4 FragColor;"+
		"void main() {\n" +
		"  vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;\n" +
		" vec4 rgbaDepth = texture(u_ShadowMap, shadowCoord.xy);\n" +
		"  float depth = rgbaDepth.r;\n"+ // Retrieve the z-value from R
		" float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;\n" +
		"  FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n" +
		"}";

	ASJ_gFragmentShaderObject_Shadow = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_gFragmentShaderObject_Shadow, fragmentShaderSource_shadow);
	gl.compileShader(ASJ_gFragmentShaderObject_Shadow);

	if (gl.getShaderParameter(ASJ_gFragmentShaderObject_Shadow, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_gFragmentShaderObject_Shadow);
		if (error.length > 0) {
			alert("fragment shader shadow \n" + error);
			uninitialize();
		}
	}
	//shader program

	ASJ_ShaderProgramObject_Shadow = gl.createProgram();
	gl.attachShader(ASJ_ShaderProgramObject_Shadow, ASJ_gVertexShaderObject_Shadow);
	gl.attachShader(ASJ_ShaderProgramObject_Shadow, ASJ_gFragmentShaderObject_Shadow);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(ASJ_ShaderProgramObject_Shadow, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "a_Position");
	gl.bindAttribLocation(ASJ_ShaderProgramObject_Shadow, WebGLMacros.ASJ_ATTRIBUTE_COLOR, "a_Color");

	gl.linkProgram(ASJ_ShaderProgramObject_Shadow);
	if (!gl.getProgramParameter(ASJ_ShaderProgramObject_Shadow, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(ASJ_ShaderProgramObject_Shadow);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	//Uniform for shadow shaders
	ASJ_mvpMatrixUniform = gl.getUniformLocation(ASJ_ShaderProgramObject_Shadow, "u_MvpMatrix");
	ASJ_MvpMatrixFromLightUniform = gl.getUniformLocation(ASJ_ShaderProgramObject_Shadow, "u_MvpMatrixFromLight");
	

	ASJ_depthTextureUniform = gl.getUniformLocation(ASJ_ShaderProgramObject_Shadow, "u_ShadowMap");


	

	//
	var floorNormal= new Float32Array([
			0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0]);
	//floor
	var floorVertex = new Float32Array([ 
					- 50.0, -5.0, -50.0,
					-50.0, -5.0, 50.0, 
					50.0, -5.0, 50.0, 
		50.0, -5.0, -50.0]);

	//sphere
	sphere = new Mesh();

	makeSphere(sphere, 3.0, 30, 30);


	//floor
	
	ASJ_Vaofloor = gl.createVertexArray();
	gl.bindVertexArray(ASJ_Vaofloor);

	ASJ_gVbo_floor = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ASJ_gVbo_floor);
	gl.bufferData(gl.ARRAY_BUFFER, floorVertex, gl.STATIC_DRAW);

	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 0, null);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_VERTEX);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//normal
	ASJ_vbo_floor_normal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ASJ_vbo_floor_normal);
	gl.bufferData(gl.ARRAY_BUFFER, floorNormal, gl.STATIC_DRAW);

	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 0, null);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_COLOR);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindVertexArray(null);


	
	ASJ_depth_fbo = ASJ_initFramebufferObject();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	perspectiveProjectionMatrix = mat4.create();
}

function ASJ_initFramebufferObject()
{
	var framebuffer;
	var depthBuffer, texture;

	//create framebuffer object
	framebuffer = gl.createFramebuffer();
	if (!framebuffer) {
		console.log('Failed to create frame buffer object');
		//return error();
	}

	// Create a texture object and set its size and parameters 
	texture = gl.createTexture();// Create a texture object
	if (!texture) {
		console.log('Failed to create texture object');
		//return error();
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, ASJ_TEXTURE_SIZE, ASJ_TEXTURE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
	//set up wrapping modes
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	

	//Create a renderbuffer object
	depthBuffer = gl.createRenderbuffer();
	if (!depthBuffer) {
		console.log('Failed to create renderbuffer object');
		//return error();
	}

	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, ASJ_TEXTURE_SIZE, ASJ_TEXTURE_SIZE);
	

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
	framebuffer.texture = texture;
	 gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

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
	ASJ_aspect = parseFloat(canvas.height) / parseFloat(canvas.width);
	
}

function ASJ_Draw_shadow() {
	gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

	
	//
	var light_position = new Float32Array([5.0, 10.0, 9.0]);
	var Y = new Float32Array([0.0, 1.0, 0.0]);
	var eye = [0, 0, 0];
	//Matrices for rendering Scene
	var rotationMatrix = mat4.create();
	var scene_modelMatrix = mat4.create();
	var scene_viewMatrix = mat4.create();
	var scene_ProjectionMatrix = mat4.create();

	mat4.frustum(scene_ProjectionMatrix ,-1.0, 1.0, -ASJ_aspect, ASJ_aspect, 1, 100.0);//aspect ratio

	mat4.translate(scene_viewMatrix, scene_viewMatrix, [0.0, 0.0, -45.0]);
	//var scale_bias_matrix = mat4.create();



	//Matrices  for rendering Scene from light position
	var viewProjMatrixFromLight = mat4.create(); // Prepare a view projection matrix for generating a shadow map
	mat4.perspective(viewProjMatrixFromLight, 70.0, parseFloat(canvas.width) / parseFloat(canvas.height), 1.0, 100.0);
	mat4.lookAt(viewProjMatrixFromLight,0, 7, 20, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

	var viewProjMatrix = mat4.create();         // Prepare a view projection matrix for regular drawing
	mat4.perspective(viewProjMatrix,45, canvas.width / canvas.height, 1.0, 100.0);
	mat4.lookAt(viewProjMatrix,0.0, 2.0, -45.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

	
	

	gl.bindFramebuffer(gl.FRAMEBUFFER, ASJ_depth_fbo);
	gl.viewport(0, 0, ASJ_TEXTURE_SIZE, ASJ_TEXTURE_SIZE);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

	gl.useProgram(ASJ_shaderProgramObject_depthMap);

	gl.clearColor(0, 1, 1,1);
//	gl.enable(gl.POLYGON_OFFSET_FILL);//
	//gl.polygonOffset(1.0, 2.0);//
	



	gl.uniformMatrix4fv(ASJ_MVPUniform_Light_PointView, false, viewProjMatrixFromLight);
	//sphere
	sphere.draw();

	//render floor
	gl.bindVertexArray(ASJ_Vaofloor);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(null);

	//Reset viewport default framebuffer
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	
	gl.useProgram(ASJ_ShaderProgramObject_Shadow);
	//depth texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ASJ_depth_fbo.texture);
	gl.uniform1i(ASJ_depthTextureUniform, 0);
	gl.uniformMatrix4fv(ASJ_MvpMatrixFromLightUniform, false, viewProjMatrixFromLight);
	
	gl.uniformMatrix4fv(ASJ_mvpMatrixUniform , false, viewProjMatrix);
	

	



	//render floor
	gl.bindVertexArray(ASJ_Vaofloor);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	sphere.draw();

	gl.useProgram(null);
	
	requestAnimationFrame(ASJ_Draw_shadow, canvas);
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

	if (ASJ_shaderProgramObject_depthMap)
	{
		if (ASJ_vertexShaderObject_depthMap)
		{

			gl.detachShader(ASJ_shaderProgramObject_depthMap, ASJ_vertexShaderObject_depthMap);
			gl.deleteShader(ASJ_vertexShaderObject_depthMap);
			ASJ_vertexShaderObject_depthMap = null;
		}

		if (ASJ_fragmentShaderObject_depthMap) {

			gl.detachShader(ASJ_shaderProgramObject_depthMap, ASJ_fragmentShaderObject_depthMap);
			gl.deleteShader(ASJ_fragmentShaderObject_depthMap);
			ASJ_fragmentShaderObject_depthMap = null;
		}
		gl.deleteProgram(ASJ_shaderProgramObject_depthMap);
		ASJ_shaderProgramObject_depthMap = null;
    }
}









