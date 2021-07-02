
const WebGLMacrosAditya=
{
	AMC_ATTRIBUTE_POSITION_ADITYA:0,
	AMC_ATTRIBUTE_COLOR_ADITYA:1,
	AMC_ATTRIBUTE_NORMAL_ADITYA:2,
	AMC_ATTRIBUTE_TEXTURE0_ADITYA:3
};

var vertexShaderObject_Smoke;
var fragmentShaderObject_Smoke;
var shaderProgramObject_Smoke;

var vao_Smoke;
var vbo_Smoke;
var vbo_Color_Smoke;
var vbo_Color_square_Smoke;
var vao_rectangle_Smoke;
var vbo_rectangle_Smoke;
var mvpUniform_Smoke;
var gAngleTriangle_Smoke=0.0;
var gAngleSquare_Smoke=0.0;
var perspectiveProjectionMatrix_Smoke;

var sampleruniform_Smoke;

var uGlobalTimeUniform_Smoke;
var Time_Smoke = 0.0;


var pyramid_texture_Smoke = 0;
var cube_texture_Smoke = 0;

var u_modelUniformSmoke;
var u_viewUniformSmoke;
var u_projectionUniformSmoke;


var smokeX = 1.7989999999999942;
var smokeY =-0.8200000000000005;
var smokeZ = -14.719999999999953;
var smokeScale = 0.11499999999999921;



function initSmoke()
{
    
	//vertex shaderProgramObject
	var vertexShaderSourceCode =
	"#version 300 es"+
	"\n" +
	"in vec4 vPosition;" +
	"in vec2 vTexCoord;" +

	"out vec2 outTexCoord;" +
	"out vec4 out_Position;" +
	"in vec4 vColor;" +
	"out vec4 out_color;" +
	"uniform mat4 u_mvp_matrix;" +

	"uniform mat4 u_model_matrix;" +
		"uniform mat4 u_view_matrix;" +
		"uniform mat4 u_projection_matrix;" +



	"void main(void)" +
	"{" +
	"gl_Position=u_projection_matrix*u_view_matrix*u_model_matrix * vPosition;" +
	"out_color = vColor;" +
	"out_Position = vPosition;" +
	"outTexCoord = vTexCoord;" +
	"}";
	vertexShaderObject_Smoke=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_Smoke, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_Smoke);
	if(gl.getShaderParameter(vertexShaderObject_Smoke,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(vertexShaderObject_Smoke);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	
	//fragmentShader
	var fragmentShaderSource =
	"#version 300 es"+
	"\n"+
	"precision highp float;"+
	"in vec2 outTexCoord;" +
		"uniform highp float uGlobalTime;														" +
		"uniform vec4 uMouse;															" +
		"uniform sampler2D u_sampler;" +
		"out vec4 FragColor;																				" +
		"in vec4 out_Position;"                                                       +
		"		float hash(in vec3 p) {																							" +
		"		return fract(sin(dot(p, vec3(12.9898, 39.1215, 78.233))) * 43758.5453);											" +
		"	}																													" +
		"																														" +
		"	float noise(in vec3 p) {																							" +
		"		vec3 i = floor(p);																								" +
		"		vec3 f = fract(p);																								" +
		"		f = f * f * (3.0 - 2.0 * f);																					" +
		"		return mix(																										" +
		"			mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),									" +
		"				mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),									" +
		"				f.y),																									" +
		"			mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),									" +
		"				mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),									" +
		"				f.y),																									" +
		"			f.z);																										" +
		"	}																													" +
		"																														" +
		"	float fBm(in vec3 p) {																								" +
		"		float sum = 0.0;																								" +
		"		float amp = 1.0;																								" +
		"		for (int i = 0; i < 6; i++) {																					" +
		"			sum += amp * noise(p);																						" +
		"			amp *= 0.5;																									" +
		"			p *= 2.0;																									" +
		"		}																												" +
		"		return sum;																										" +
		"	}																													" +
		"	void main() {																										" +
		"		vec2 p = out_Position.xy / 4.0;															" +
		"																														" +
			"vec4 texColor = texture(u_sampler,outTexCoord.xy);" +
		"		vec3 rd = normalize(vec3(p.xy, 1.0));																			" +
		"																														" +
		"		vec3 pos = vec3(0.0, -1.0, 0.0) * uGlobalTime + rd * 20.0;														" +
				
		"		vec3 color = vec3(0.2 * fBm(pos));																				" +
			"if(texColor.r + texColor.g + texColor.b <0.2)" +
			"{" +
				"discard;" +																											
			"}" +
			
		"		FragColor =texColor * vec4(color ,0.2);																				" +
		"	}																													";
	fragmentShaderObject_Smoke = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_Smoke,fragmentShaderSource);
	gl.compileShader(fragmentShaderObject_Smoke);
	if(gl.getShaderParameter(fragmentShaderObject_Smoke,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject_Smoke);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//shader program
	shaderProgramObject_Smoke=gl.createProgram();
	gl.attachShader(shaderProgramObject_Smoke, vertexShaderObject_Smoke);
	gl.attachShader(shaderProgramObject_Smoke, fragmentShaderObject_Smoke);
	
	//pre-link binidng of shader program object with vertex shader attributes
	gl.bindAttribLocation(shaderProgramObject_Smoke, WebGLMacrosAditya.AMC_ATTRIBUTE_POSITION_ADITYA, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_Smoke, WebGLMacrosAditya.AMC_ATTRIBUTE_TEXTURE0_ADITYA, "vTexCoord");
	
	//linking
	gl.linkProgram(shaderProgramObject_Smoke);
	if(!gl.getProgramParameter(shaderProgramObject_Smoke, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject_Smoke);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	
	
	pyramid_texture_Smoke = gl.createTexture();
	
	pyramid_texture_Smoke.image = new Image();
	//pyramid_tex.crossOrigin = "anonymous";
	pyramid_texture_Smoke.image.src = "Fire_Alpha.bmp";
	pyramid_texture_Smoke.image.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, pyramid_texture_Smoke);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pyramid_texture_Smoke.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	// //Load cube texture
	// cube_texture_Smoke = gl.createTexture();
	// cube_texture_Smoke.image = new Image();
	// cube_texture_Smoke.image.src = "kundali.png";
	// cube_texture_Smoke.image.onload = function ()
	// {
	// 	gl.bindTexture(gl.TEXTURE_2D, cube_texture_Smoke);
	// 	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	// 	gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cube_texture_Smoke.image);
	// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	// 	gl.bindTexture(gl.TEXTURE_2D, null);
	// }
	
	
	
	//get MVP uniform
	mvpUniform_Smoke = gl.getUniformLocation(shaderProgramObject_Smoke, "u_mvp_matrix");
	uGlobalTimeUniform_Smoke = gl.getUniformLocation(shaderProgramObject_Smoke, "uGlobalTime");
	sampleruniform_Smoke = gl.getUniformLocation(shaderProgramObject_Smoke, "u_sampler");
	
	u_modelUniformSmoke = gl.getUniformLocation(shaderProgramObject_Smoke, "u_model_matrix");
	u_viewUniformSmoke = gl.getUniformLocation(shaderProgramObject_Smoke, "u_view_matrix");
	u_projectionUniformSmoke = gl.getUniformLocation(shaderProgramObject_Smoke, "u_projection_matrix");
	
	
	var triangleVertices = new Float32Array([	
		0.0, 1.0, 0.0,		
		-1.0, -1.0, 1.0,		
		1.0, -1.0, 1.0,		
							
		0.0, 1.0, 0.0,	
		1.0, -1.0, 1.0,		
		1.0, -1.0, -1.0,	
							
		0.0, 1.0, 0.0,		
		1.0, -1.0, -1.0,		
		-1.0, -1.0, -1.0,	
							
		0.0, 1.0, 0.0,		
		-1.0, -1.0, -1.0,	
		-1.0, -1.0, 1.0
	]);


	var rectangleVertices = new Float32Array([//TOP FACE
		1.0, 1.0, -1.0,
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,

		//BOTTOM FACE
		1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,

		//FRONT FACE
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,

		//BACK FACE
		1.0, 1.0, -1.0,
		-1.0, 1.0, -1.0,
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,

		//RIGHT FACE
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,

		//LEFT FACE
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0,
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0

	]);
var triangleTexcoords = new Float32Array([0.5, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		0.5, 1.0,
		1.0, 0.0,
		0.0, 0.0,

		0.5, 1.0,
		1.0, 0.0,
		0.0, 0.0,

		0.5, 1.0,
		0.0, 0.0,
		1.0, 0.0,

	]);


	var rectangleTexcoords = new Float32Array([	
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

	]);
	vao_Smoke=gl.createVertexArray();
	gl.bindVertexArray(vao_Smoke);
	vbo_Smoke =  gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_Smoke);
	gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacrosAditya.AMC_ATTRIBUTE_POSITION_ADITYA,
							3,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacrosAditya.AMC_ATTRIBUTE_POSITION_ADITYA);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	vbo_Color_Smoke = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_Color_Smoke);
	gl.bufferData(gl.ARRAY_BUFFER, triangleTexcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacrosAditya.AMC_ATTRIBUTE_TEXTURE0_ADITYA,
							2,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacrosAditya.AMC_ATTRIBUTE_TEXTURE0_ADITYA);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindVertexArray(null);


    /// rectangle
	vao_rectangle_Smoke = gl.createVertexArray();
	gl.bindVertexArray(vao_rectangle_Smoke);
	vbo_rectangle_Smoke = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_rectangle_Smoke);
	gl.bufferData(gl.ARRAY_BUFFER, rectangleVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacrosAditya.AMC_ATTRIBUTE_VERTEX,
							3,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacrosAditya.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	
	
	vbo_Color_square_Smoke = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_Color_square_Smoke);
	gl.bufferData(gl.ARRAY_BUFFER, rectangleTexcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacrosAditya.AMC_ATTRIBUTE_TEXTURE0_ADITYA,
							2,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacrosAditya.AMC_ATTRIBUTE_TEXTURE0_ADITYA);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

}


function drawSmoke()
{
    

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)



	gl.useProgram(shaderProgramObject_Smoke);
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();
	var viewMatrix = mat4.create();

	mat4.translate(modelViewMatrix, modelViewMatrix, [smokeX, smokeY, smokeZ]);
	mat4.scale(modelViewMatrix,modelViewMatrix,[smokeScale,smokeScale,smokeScale]);
	//mat4.rotateY(modelViewMatrix,modelViewMatrix,deg2rad(gAngleTriangle_Smoke));
	
//	mat4.multiply(modelViewProjectionMatrix, perspectiveMatrix, modelViewMatrix);



	
	gl.uniformMatrix4fv(u_modelUniformSmoke, false, modelViewMatrix);
	gl.uniformMatrix4fv(u_projectionUniformSmoke, false, perspectiveMatrix);
	gl.uniformMatrix4fv(u_viewUniformSmoke, false, gViewMatrix);
	gl.uniform1f(uGlobalTimeUniform_Smoke,Time_Smoke);



	Time_Smoke += 0.065;
	gl.uniformMatrix4fv(mvpUniform_Smoke, false, modelViewProjectionMatrix);
	gl.bindTexture(gl.TEXTURE_2D, pyramid_texture_Smoke);
	gl.uniform1i(sampleruniform_Smoke, 0);
	gl.bindVertexArray(vao_rectangle_Smoke);
	// gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
	// gl.drawArrays(gl.TRIANGLE_FAN, 4,4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8,4);
	// gl.drawArrays(gl.TRIANGLE_FAN, 12,4);
	// gl.drawArrays(gl.TRIANGLE_FAN, 16,4);
	// gl.drawArrays(gl.TRIANGLE_FAN, 20,4);
	gl.bindVertexArray(null);

	gl.useProgram(null);
}