var ASJ_vertexShaderObject_stove;
var ASJ_fragmentShaderObject_stove;
var ASJ_shaderProgramObject_stove;

var vbo_texture_stove;
var rust_texture_stove;
var vao_stove;
var vbo_position_stove;
var vbo_color_stove;
var modelMatrixUniform_stove;
var vao_square_stove;
var flagUniform_stove;
var spin_stove = -90;
var viewMatrixUniform_stove;
var projectionMatrixUnifrom_stove;
var stack_stove = [];
var vbo_normal_stove;

var textureSamplerUnifrom;

var stove_Transx =  2.4199999999999924;
var stove_Transy = -0.3900000000000002;
var stove_Transz =  -15.919999999999789;  

var stove_Scale = 0.27999999999999936;




function ASJ_init_stove() {
	

	var vertexShaderSource =
		"#version 300 es" +
		"\n" +
		"layout(location = 0)in vec4 vPosition;" +
		"layout(location = 1)in vec2 vTexCord;" +
		"out vec2 out_TexCord;" +
		"uniform mat4 u_model_matrix;" +
		"uniform mat4 u_view_matrix;" +
		"uniform mat4 u_projection_matrix;" +
		"void main(void)" +
		"{" +
		"gl_Position=u_projection_matrix*u_view_matrix*u_model_matrix * vPosition;" +
		"out_TexCord=vTexCord;" +
		"}";
	ASJ_vertexShaderObject_stove = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(ASJ_vertexShaderObject_stove, vertexShaderSource);
	gl.compileShader(ASJ_vertexShaderObject_stove);

	if (gl.getShaderParameter(ASJ_vertexShaderObject_stove, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_stove);
		if (error.length > 0) {
			alert(error);
			uninitialize();
		}
	}

	var fragmentShaderSource =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"precision highp int;" +
		"uniform highp sampler2D u_texture_sampler;" +
		"uniform int flag;" +
		"out vec4 FragColor;" +
		"in vec2 out_TexCord;" +
		"void main(void)" +
		"{" +
		"if(flag==1)" +
		"{" +
		"FragColor=vec4(0, 0, 0,0.9);" +
		"}" +
		"else" +
		"{" +
		"FragColor=texture(u_texture_sampler,out_TexCord);" +
		"}" +
		"}";

	ASJ_fragmentShaderObject_stove = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(ASJ_fragmentShaderObject_stove, fragmentShaderSource);
	gl.compileShader(ASJ_fragmentShaderObject_stove);

	if (gl.getShaderParameter(ASJ_fragmentShaderObject_stove, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_stove);
		if (error.length > 0) {
			alert(error);
			ASJ_uninitialize_stove();
		}
	}
	//shader program

	ASJ_shaderProgramObject_stove = gl.createProgram();
	gl.attachShader(ASJ_shaderProgramObject_stove, ASJ_vertexShaderObject_stove);
	gl.attachShader(ASJ_shaderProgramObject_stove, ASJ_fragmentShaderObject_stove);

	//pre-Link binding with vertex shader attribute
	
	gl.linkProgram(ASJ_shaderProgramObject_stove);
	if (!gl.getProgramParameter(ASJ_shaderProgramObject_stove, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_stove);
		if (error.length > 0) {
			alert(error);
			ASJ_uninitialize_stove();
		}
	}

	modelMatrixUniform_stove = gl.getUniformLocation(ASJ_shaderProgramObject_stove, "u_model_matrix");
	viewMatrixUniform_stove = gl.getUniformLocation(ASJ_shaderProgramObject_stove, "u_view_matrix");
	projectionMatrixUnifrom_stove = gl.getUniformLocation(ASJ_shaderProgramObject_stove, "u_projection_matrix");
	textureSamplerUnifrom = gl.getUniformLocation(ASJ_shaderProgramObject_stove, "u_texture_sampler");
	flagUniform_stove = gl.getUniformLocation(ASJ_shaderProgramObject_stove, "flag");

	var squareVertices = new Float32Array([1.0, 1.0, 1.0,
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

	var cubeTexCord = new Float32Array([
		//FRONT FACE

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Back
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Top
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

	var cubeNormal = new Float32Array([0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		//RIGHT FACE
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		//BACK FACE
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		//LEFT FACE
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		//TOP FACE
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,


		//BOTTOM FACE
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0]);

	vao_square_stove = gl.createVertexArray();
	gl.bindVertexArray(vao_square_stove);
	vbo_position_triangle = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_triangle);
	gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//tex
	vbo_texture_stove = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texture_stove);
	gl.bufferData(gl.ARRAY_BUFFER, cubeTexCord, gl.STATIC_DRAW);
	gl.vertexAttribPointer(1, 2, gl.FLOAT,
		false, 0, 0);
	gl.enableVertexAttribArray(1);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//normal
	// vbo_normal_stove = gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER, vbo_normal_stove);
	// gl.bufferData(gl.ARRAY_BUFFER, cubeNormal, gl.STATIC_DRAW);
	// gl.vertexAttribPointer(WebGLMacros.ASJ_ATTRIBUTE_NORMAL, 3, gl.FLOAT,
	// 	false, 0, 0);
	// gl.enableVertexAttribArray(WebGLMacros.ASJ_ATTRIBUTE_NORMAL);
	// gl.bindBuffer(gl.ARRAY_BUFFER, null);



	gl.bindVertexArray(null);

	rust_texture_stove = gl.createTexture();
	rust_texture_stove.image = new Image();
	rust_texture_stove.image.src = "rust.PNG";

	//lamda function OR unNamed function
	rust_texture_stove.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, rust_texture_stove);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rust_texture_stove.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	
}


function ASJ_draw_stove() {
//	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(ASJ_shaderProgramObject_stove);
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();

	var viewMatrix = mat4.create();
	
	var temp = mat4.create();
	var cover = mat4.create();
	var scaleMatrix = mat4.create();
	var burner = mat4.create();

	gl.uniformMatrix4fv(viewMatrixUniform_stove, false, gViewMatrix);
	gl.uniformMatrix4fv(projectionMatrixUnifrom_stove, false, perspectiveMatrix);

	mat4.translate(modelViewMatrix, modelViewMatrix, [stove_Transx, stove_Transy, stove_Transz]);
	mat4.scale(modelViewMatrix, modelViewMatrix, [stove_Scale, stove_Scale, stove_Scale]);


	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, rust_texture_stove);
	gl.uniform1i(textureSamplerUnifrom, 0);

	gl.uniform1i(flagUniform_stove, 0);

	temp = modelViewMatrix;
mat4.rotateX(temp, temp, degTwoRadians(spin_stove));//change

	//3side cube
	mat4.translate(cover, temp, [0.8, -0.3, -0.8]);
	mat4.scale(cover, cover, [0.85, 1, 1]);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, cover);
	gl.bindVertexArray(vao_square_stove);
	//gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); front
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	//gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);//bottom
	gl.bindVertexArray(null);


	gl.uniform1i(flagUniform_stove, 1);
	burner = cover;
	//s1
	mat4.translate(burner, burner, [0, 0.0, -0.5]);
	mat4.scale(burner, burner, [0.08, 0.08, 0.5]);
	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, burner);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);
	//s2
	mat4.translate(burner, burner, [0, 0.0, 0.5]);
	mat4.scale(burner, burner, [2, 1.3, 0.5]);
	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, burner);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);


	stack_stove.push(temp);


	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 0.5, 0.05]);
	mat4.multiply(scaleMatrix, temp, scaleMatrix);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	//0
	mat4.translate(scaleMatrix, scaleMatrix, [16.8, 1, 0]);
	mat4.rotateZ(scaleMatrix, scaleMatrix, degTwoRadians(-90));
	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 16, 1]);
	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	//

	temp = stack_stove.pop();
	stack_stove.push(temp);
	//1
	scaleMatrix = mat4.create();
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.rotateZ(temp, temp, degTwoRadians(-120));
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 0.5, 0.05]);
	mat4.multiply(scaleMatrix, temp, scaleMatrix);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);




	//2

	temp = stack_stove.pop();

	scaleMatrix = mat4.create();
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.rotateZ(temp, temp, degTwoRadians(-120));
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 0.5, 0.05]);
	mat4.multiply(scaleMatrix, temp, scaleMatrix);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);



	//right side
	temp = mat4.create();

	scaleMatrix = mat4.create();
	mat4.translate(modelViewMatrix, modelViewMatrix, [0, -0.9, 0.0]);
	//mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

	temp = modelViewMatrix;
	mat4.rotateY(temp, temp, degTwoRadians(180));


	stack_stove.push(temp);


	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 0.5, 0.05]);
	mat4.multiply(scaleMatrix, temp, scaleMatrix);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);

	temp = stack_stove.pop();
	stack_stove.push(temp);
	//1
	scaleMatrix = mat4.create();
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.rotateZ(temp, temp, degTwoRadians(-120));
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 0.5, 0.05]);
	mat4.multiply(scaleMatrix, temp, scaleMatrix);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);


	//2

	temp = stack_stove.pop();

	scaleMatrix = mat4.create();
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.rotateZ(temp, temp, degTwoRadians(-120));
	mat4.translate(temp, temp, [0, 0.48, 0]);
	mat4.scale(scaleMatrix, scaleMatrix, [0.05, 0.5, 0.05]);
	mat4.multiply(scaleMatrix, temp, scaleMatrix);

	gl.uniformMatrix4fv(modelMatrixUniform_stove, false, scaleMatrix);
	gl.bindVertexArray(vao_square_stove);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.bindVertexArray(null);


	gl.useProgram(null);


}

function degTwoRadians(degree) {
	return (degree * Math.PI) / 180;
}

function ASJ_uninitialize_stove() {
	if (vao_stove) {
		gl.deleteVertexArray(vao_stove);
		vao_stove = null;
	}

	if (vbo_position_stove) {
		gl.deleteBuffer(vbo_position_stove);
		vbo_position_stove = null;
	}

	if (ASJ_shaderProgramObject_stove) {
		if (ASJ_vertexShaderObject_stove) {

			gl.detachShader(ASJ_shaderProgramObject_stove, ASJ_vertexShaderObject_stove);
			gl.deleteShader(ASJ_vertexShaderObject_stove);
			ASJ_vertexShaderObject_stove = null;
		}

		if (ASJ_fragmentShaderObject_stove) {

			gl.detachShader(ASJ_shaderProgramObject_stove, ASJ_fragmentShaderObject_stove);
			gl.deleteShader(ASJ_fragmentShaderObject_stove);
			ASJ_fragmentShaderObject_stove = null;
		}
		gl.deleteProgram(ASJ_shaderProgramObject_stove);
		ASJ_shaderProgramObject_stove = null;
	}
}