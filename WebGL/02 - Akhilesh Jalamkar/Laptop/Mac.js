var vertexShaderObject_laptop;
var fragmentShaderObject_laptop;
var shaderProgramObject_laptop;

var vao_laptop;
var vbo_position_laptop;


var vao_square_laptop;
var asj_textureSamplerUniform_laptop;

var stack_laptop = [];

var macTexture_laptop;
var wallpaper_laptop;
var modelMatrixUniform_laptop;
var viewMatrixUnifrom_laptop;
var projectionMatrixUniform_laptop;

var spin_laptop = 0;

function ASJ_init_laptop() {
	

	var vertexShaderSource =
		"#version 300 es" +
		"\n" +
		"in vec4 vPosition;" +
		"in vec2 vTexCord;" +
		"out vec2 out_tex_coord;" +
		"uniform mat4 u_model_matrix;" +
		"uniform mat4 u_view_matrix;" +
		"uniform mat4 u_projection_matrix;" +
		"void main(void)" +
		"{" +
		"gl_Position=u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;" +
		"out_tex_coord=vTexCord;" +
		"}";
	vertexShaderObject_laptop = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_laptop, vertexShaderSource);
	gl.compileShader(vertexShaderObject_laptop);

	if (gl.getShaderParameter(vertexShaderObject_laptop, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(vertexShaderObject_laptop);
		if (error.length > 0) {
			alert(error);
			uninitialize_laptop();
		}
	}

	var fragmentShaderSource =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"out vec4 FragColor;" +
		"in vec2 out_tex_coord;" +
		"uniform sampler2D u_texture_sampler;" +
		"void main(void)" +
		"{" +
		"FragColor= texture(u_texture_sampler, out_tex_coord);" +
		"}";

	fragmentShaderObject_laptop = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_laptop, fragmentShaderSource);
	gl.compileShader(fragmentShaderObject_laptop);

	if (gl.getShaderParameter(fragmentShaderObject_laptop, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(fragmentShaderObject_laptop);
		if (error.length > 0) {
			alert(error);
			uninitialize_laptop();
		}
	}
	//shader program

	shaderProgramObject_laptop = gl.createProgram();
	gl.attachShader(shaderProgramObject_laptop, vertexShaderObject_laptop);
	gl.attachShader(shaderProgramObject_laptop, fragmentShaderObject_laptop);

	//pre-Link binding with vertex shader attribute
	gl.bindAttribLocation(shaderProgramObject_laptop, WebGLMacros.ASJ_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_laptop, WebGLMacros.ASJ_ATTRIBUTE_TEXTURE, "vTexCord");

	gl.linkProgram(shaderProgramObject_laptop);
	if (!gl.getProgramParameter(shaderProgramObject_laptop, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(shaderProgramObject_laptop);
		if (error.length > 0) {
			alert(error);
			uninitialize_laptop();
		}
	}

	modelMatrixUniform_laptop = gl.getUniformLocation(shaderProgramObject_laptop, "u_model_matrix");
	viewMatrixUnifrom_laptop = gl.getUniformLocation(shaderProgramObject_laptop, "u_view_matrix");
	projectionMatrixUniform_laptop = gl.getUniformLocation(shaderProgramObject_laptop, "u_projection_matrix");

	asj_textureSamplerUniform_laptop = gl.getUniformLocation(shaderProgramObject_laptop, "u_texture_sampler");


	var squareVertices = new Float32Array([
		//FRONT FACE
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,

		//RIGHT FACE
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,

		//BACK FACE
		1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,

		//LEFT FACE
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0,
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,

		//TOP FACE
		1.0, 1.0, -1.0,
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,

		//BOTTOM FACE
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0]);



	vao_square_laptop = gl.createVertexArray();
	gl.bindVertexArray(vao_square_laptop);
	vbo_position_triangle = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_triangle);
	gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//texCord

	vbo_texCord = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texCord);
	gl.bufferData(gl.ARRAY_BUFFER, null, gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE, 2, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindVertexArray(null);



	macTexture_laptop = gl.createTexture();
	macTexture_laptop.image = new Image();
	macTexture_laptop.image.src = "mac.PNG";

	macTexture_laptop.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, macTexture_laptop);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, macTexture_laptop.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	wallpaper_laptop = gl.createTexture();
	wallpaper_laptop.image = new Image();
	wallpaper_laptop.image.src = "bigSur.PNG";

	wallpaper_laptop.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, wallpaper_laptop);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wallpaper_laptop.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	
}


function ASJ_draw_laptop() {
	var cubeTexcord = new Float32Array([//FRONT FACE

		//FRONT FACE

		0.50, 0.50,
		0.50, 0.50,
		0.50, 0.50,
		0.50, 0.50,
		// top
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//back
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Bottom
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Right
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Left
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0]);
	var cubeTexcord1 = new Float32Array([//FRONT FACE

		//FRONT FACE

		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		// top
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		//back
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		// Bottom
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		// Right
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		// Left
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,]);
	var keyColor = new Float32Array([//FRONT FACE

		//FRONT FACE

		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		// top
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		//back
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		// Bottom
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		// Right
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		// Left
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5,
		0.5, 0.5]);
	var homeScreen = new Float32Array([0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0]);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shaderProgramObject_laptop);
	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();



	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -3.0]);
	mat4.rotateY(modelMatrix, modelMatrix, degTwoRadians_laptop(spin_laptop));
	mat4.scale(modelMatrix, modelMatrix, [0.9, 0.6, 0.02]);
	stack_laptop.push(modelMatrix);

	//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, macTexture_laptop);
	gl.uniform1i(asj_textureSamplerUniform_laptop, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texCord);
	gl.bufferData(gl.ARRAY_BUFFER, cubeTexcord, gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE, 2, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.uniformMatrix4fv(viewMatrixUnifrom_laptop, false, viewMatrix);
	gl.uniformMatrix4fv(projectionMatrixUniform_laptop, false, perspectiveProjectionMatrix);


	//DISPLAY PANEL
	gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, modelMatrix);
	gl.bindVertexArray(vao_square_laptop);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);//
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);//back
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	//gl.bindTexture(gl.TEXTURE_2D, null);
	//SCREEN
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, wallpaper_laptop);
	gl.uniform1i(asj_textureSamplerUniform_laptop, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texCord);
	gl.bufferData(gl.ARRAY_BUFFER, homeScreen, gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE, 2, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	var screen = stack_laptop.pop();
	stack_laptop.push(screen);
	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, 0.3]);
	mat4.scale(screen, screen, [0.95, 0.89, 0.8]);
	//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, screen);
	gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, screen);

	gl.bindVertexArray(vao_square_laptop);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);



	//
	gl.bindTexture(gl.TEXTURE_2D, macTexture_laptop);
	gl.uniform1i(asj_textureSamplerUniform_laptop, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texCord);
	gl.bufferData(gl.ARRAY_BUFFER, cubeTexcord1, gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE, 2, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	var keyboard = stack_laptop.pop();
	mat4.translate(keyboard, keyboard, [0, -1.1, 29]);
	stack_laptop.push(keyboard);
	mat4.scale(keyboard, keyboard, [1.05, 0.02, 30]);
	//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, keyboard);

	gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, keyboard);
	//KEYBOARD panel
	gl.bindVertexArray(vao_square_laptop);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	//KEYS
	var key = stack_laptop.pop();

	mat4.scale(key, key, [0.05, 0.1, 0.05]);
	mat4.translate(key, key, [-16, 10, -10]);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texCord);
	gl.bufferData(gl.ARRAY_BUFFER, keyColor, gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE, 2, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	stack_laptop.push(key);
	for (var i = 0; i < 14; i++) {
		//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, key);
		gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, key);
		gl.bindVertexArray(vao_square_laptop);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
		gl.bindVertexArray(null);
		mat4.translate(key, key, [2.5, 0, 0]);
	}
	key = stack_laptop.pop();
	stack_laptop.push(key);
	mat4.translate(key, key, [-35, 0, 4]);
	for (var i = 0; i < 14; i++) {
		//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, key);
		gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, key);
		gl.bindVertexArray(vao_square_laptop);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
		gl.bindVertexArray(null);
		mat4.translate(key, key, [2.5, 0, 0]);
	}

	key = stack_laptop.pop();
	stack_laptop.push(key);
	mat4.translate(key, key, [-35, 0, 4]);
	for (var i = 0; i < 14; i++) {
		//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, key);
		gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, key);
		gl.bindVertexArray(vao_square_laptop);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
		gl.bindVertexArray(null);
		mat4.translate(key, key, [2.5, 0, 0]);
	}

	key = stack_laptop.pop();
	stack_laptop.push(key);
	mat4.translate(key, key, [-35, 0, 4]);
	for (var i = 0; i < 14; i++) {
		//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, key);
		gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, key);
		gl.bindVertexArray(vao_square_laptop);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
		gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
		gl.bindVertexArray(null);
		mat4.translate(key, key, [2.5, 0, 0]);
	}
	var touchPad = stack_laptop.pop();
	mat4.translate(touchPad, touchPad, [-19, 0, 10]);
	mat4.scale(touchPad, touchPad, [5, 1, 4]);
	//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, touchPad);
	gl.uniformMatrix4fv(modelMatrixUniform_laptop, false, touchPad);

	gl.bindVertexArray(vao_square_laptop);
	gl.drawArrays(gl.LINE_LOOP, 0, 4);
	gl.drawArrays(gl.LINE_LOOP, 4, 4);
	gl.drawArrays(gl.LINE_LOOP, 8, 4);
	gl.drawArrays(gl.LINE_LOOP, 12, 4);
	gl.drawArrays(gl.LINE_LOOP, 16, 4);
	gl.drawArrays(gl.LINE_LOOP, 20, 4);
	gl.bindVertexArray(null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.useProgram(null);

	

}



function uninitialize_laptop() {
	if (vao_laptop) {
		gl.deleteVertexArray(vao_laptop);
		vao_laptop = null;
	}

	if (vbo_position_laptop) {
		gl.deleteBuffer(vbo_position_laptop);
		vbo_position_laptop = null;
	}

	if (shaderProgramObject_laptop) {
		if (vertexShaderObject_laptop) {

			gl.detachShader(shaderProgramObject_laptop, vertexShaderObject_laptop);
			gl.deleteShader(vertexShaderObject_laptop);
			vertexShaderObject_laptop = null;
		}

		if (fragmentShaderObject_laptop) {

			gl.detachShader(shaderProgramObject_laptop, fragmentShaderObject_laptop);
			gl.deleteShader(fragmentShaderObject_laptop);
			fragmentShaderObject_laptop = null;
		}
		gl.deleteProgram(shaderProgramObject_laptop);
		shaderProgramObject_laptop = null;
	}
}

function degTwoRadians_laptop(degree) {
	return (degree * Math.PI) / 180;
}