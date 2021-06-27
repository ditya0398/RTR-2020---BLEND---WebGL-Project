var mvpUniformFire;
var mvpUniformFireFbo;
var samplerUniformFireFbo;
var program_Fire;

var squareTexCoordsBuffer;
var vertBuff_Fire;
var ColorBuff_Fire;
var texSamplerFire;

var modelMatrixFireUniform;
var viewMatrixFireUniform;
var perspectiveMatrixFireUniform;

var vertexShaderObject_FboFire;
var fragmentShaderObject_FboFire;
var fragmentShaderObject1_FboFire
var shaderProgramObject_FBO_FboFire;
var shaderProgramObject_normal_FboFire;

var vao_FboFire;
var vbo_FboFire;
var vbo_Color_FboFire;
var vbo_Color_square_FboFire;
var vao_rectangle_FboFire;
var vbo_rectangle_FboFire;
var mvpUniform_FboFire;
var gAngleTriangle_FboFire=0.0;
var gAngleSquare_FboFire=0.0;
var perspectiveProjectionMatrix_FboFire;

var gWindowWidth_FboFire;
var gWindowHeight_FboFire;

var fbo_FboFire;
var color_texture_FboFire;
var depth_texture_FboFire;
var fbo_render_FboFire;


var modelViewUniform_FboFire;
var sampleruniform_FboFire;
var sampleruniformAlpha_FboFire;


var pyramid_texture_FboFire = 0;
var cube_texture_FboFire = 0;

var fireTransX = 2.6749999999999985;
var fireTransY = -0.54;
var fireTransZ =-15.300000000000004;

var fireScale = 0.3399999999999994;

var options = {
    // this option is not actually in the UI
    fireEmitPositionSpread: {x:100,y:20},
  
    fireEmitRate: 3000,
    fireEmitRateSlider: {min:1,max:5000},
  
    fireSize: 49.0,
    fireSizeSlider: {min:2.0,max:100.0},
  
    fireSizeVariance:  100.0,
    fireSizeVarianceSlider: {min:0.0,max:100.0},
  
    fireEmitAngleVariance: 0.42,
    fireEmitAngleVarianceSlider: {min:0.0,max:Math.PI/2},
  
    fireSpeed: 500.0,
    fireSpeedSlider: {min:20.0,max:500},
  
    fireSpeedVariance: 80.0,
    fireSpeedVarianceSlider: {min:0.0,max:100.0},
  
    fireDeathSpeed: 0.009,
    fireDeathSpeedSlider: {min: 0.001, max: 0.05},
  
    fireTriangleness: 0.00015,
    fireTrianglenessSlider: {min:0.0, max:0.0003},
  
    fireTextureHue: 0.0,
    fireTextureHueSlider: {min:-180,max:180},
  
    fireTextureHueVariance: 30.0,
    fireTextureHueVarianceSlider: {min:0.0,max:180},
  
    fireTextureColorize: true,
    wind: true,
    omnidirectionalWind:false,
  
    windStrength:20.0,
    windStrengthSlider:{min:0.0,max:60.0},
  
    windTurbulance:0.00018,
    windTurbulanceSlider:{min:0.0,max:0.001},
  
    sparks: true,
  
    // some of these options for sparks are not actually available in the UI to save UI space
    sparkEmitRate: 6.0,
    sparkEmitSlider: {min:0.0,max:10.0},
  
    sparkSize: 10.0,
    sparkSizeSlider: {min:5.0,max:100.0},
  
    sparkSizeVariance: 20.0,
    sparkSizeVarianceSlider: {min:0.0,max:100.0},
  
    sparkSpeed: 400.0,
    sparkSpeedSlider: {min:20.0, max:700.0},
  
    sparkSpeedVariance: 80.0,
    sparkSpeedVarianceSlider: {min:0.0, max:100.0},
  
    sparkDeathSpeed: 0.0085,
    sparkDeathSpeedSlider: {min: 0.002, max: 0.05},
  
  };

textureList = ["rectangle.png","circle.png","gradient.png","thicker_gradient.png","explosion.png","flame.png","smilie.png","heart.png"];
images = [];
textures = [];
currentTextureIndex = 2;
function loadTexture(textureName,index) {
    textures[index] = gl.createTexture();
    images[index] = new Image();
    images[index].onload = function() {handleTextureLoaded(images[index],index,textureName)};
    images[index].onerror = function() {alert("ERROR: texture " + textureName + " can't be loaded!"); console.error("ERROR: texture " + textureName + " can't be loaded!");};
    images[index].src = textureName;
    console.log("starting to load " + textureName);
  }
  
  function handleTextureLoaded(image,index,textureName) {
    console.log("loaded texture " + textureName);
    gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  
    // load the next texture
    if (index < textureList.length-1)
      loadTexture("textures/flame.png",index+1);
    //texturesLoadedCount += 1;
    
  }
function loadAllTextures() {  
    loadTexture("textures/flame.png",0);
  
}

fireParticles = [];
sparkParticles = [];

function createFireParticle(emitCenter) {
  var size = randomSpread(options.fireSize,options.fireSize*(options.fireSizeVariance/100.0));
  var speed = randomSpread(options.fireSpeed,options.fireSpeed*options.fireSpeedVariance/100.0);
  var color = {};
  if (!options.fireTextureColorize)
    color = {r:1.0,g:1.0,b:1.0,a:0.5};
  else {
    var hue = randomSpread(options.fireTextureHue,options.fireTextureHueVariance);
    color = HSVtoRGB(convertHue(hue),1.0,1.0);
    color.a = 0.5;
  }
  var particle = {
    pos: random2DVec(emitCenter,options.fireEmitPositionSpread),
    vel: scaleVec(randomUnitVec(Math.PI/2,options.fireEmitAngleVariance),speed),
    size: {width:size,
           height:size},
    color: color,
};
  fireParticles.push(particle);
}

function createSparkParticle(emitCenter) {
  var size = randomSpread(options.sparkSize,options.sparkSize*(options.sparkSizeVariance/100.0));
  var origin = clone2DVec(emitCenter);
  var speed = randomSpread(options.sparkSpeed,options.sparkSpeed*options.sparkSpeedVariance/100.0);
  var particle = {
    origin: origin,
    pos: random2DVec(emitCenter,options.fireEmitPositionSpread),
    vel: scaleVec(randomUnitVec(Math.PI/2,options.fireEmitAngleVariance*2.0),speed),
    size: {width:size,
           height:size},
    color: {r:1.0, g:0.1, b:0.3, a: 1.0}
  };
  sparkParticles.push(particle);
}

function initFireFBO()
{
  //vertex shaderProgramObject
	var vertexShaderSourceCode =
	"#version 300 es"+
	"\n" +
	"layout(location = 0)in vec4 vPosition;" +
    "layout(location = 1)in vec3 vColor;" +
	"layout(location = 2)in vec2 vTexture;" +
    "out vec3 outColor;" +

	
	"out vec2 outTexture;" +
	"uniform mat4 u_model_matrix;"+
	"uniform mat4 u_view_matrix;"+
	"uniform mat4 u_projection_matrix;"+

	"void main(void)"+
	"{" +
    "outTexture = vTexture; " +
	"gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;"+
	"}";
	vertexShaderObject_FboFire=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_FboFire, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_FboFire);
	if(gl.getShaderParameter(vertexShaderObject_FboFire,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(vertexShaderObject_FboFire);
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
	"out vec4 FragColor;"+
	"in vec3 outColor;"+
	"in vec2 outTexture;"+
	"uniform highp sampler2D u_texture_sampler;"+
	"void main(void)"+
	"{"+
	"FragColor = texture(u_texture_sampler, outTexture);"+
	"}";
	fragmentShaderObject_FboFire = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_FboFire,fragmentShaderSource);
	gl.compileShader(fragmentShaderObject_FboFire);
	if(gl.getShaderParameter(fragmentShaderObject_FboFire,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject_FboFire);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}







//////////// FRAGMENT SHADER 1 ////////////
var fragmentShaderSource1 =
	"#version 300 es"+
	"\n"+
	"precision highp float;"+
	"out vec4 FragColor;"+
	"in vec3 outColor;"+
	"in vec2 outTexture;"+
	"uniform sampler2D u_texture_sampler;"+
	
	"void main(void)"+
	"{"+
	"vec4 texColor = texture(u_texture_sampler, outTexture);"+
	"float sum = texColor.r + texColor.g  + texColor.b;" +
	"if(sum == 0.0 || sum <= 0.6)" +
		"discard;" +	
	"FragColor = texColor;" +
	
	"FragColor = texColor;" +
	"}";
	fragmentShaderObject1_FboFire = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject1_FboFire,fragmentShaderSource1);
	gl.compileShader(fragmentShaderObject1_FboFire);
	if(gl.getShaderParameter(fragmentShaderObject1_FboFire,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject1_FboFire);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}




	
	//shader program
	shaderProgramObject_FBO_FboFire=gl.createProgram();
	gl.attachShader(shaderProgramObject_FBO_FboFire, vertexShaderObject_FboFire);
	gl.attachShader(shaderProgramObject_FBO_FboFire, fragmentShaderObject_FboFire);
	
	//pre-link binidng of shader program object with vertex shader attributes
	gl.bindAttribLocation(shaderProgramObject_FBO_FboFire, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vPosition");
	//gl.bindAttribLocation(shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vColor");
	gl.bindAttribLocation(shaderProgramObject_FBO_FboFire, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, "vTexture");
	
	//linking
	gl.linkProgram(shaderProgramObject_FBO_FboFire);
	if(!gl.getProgramParameter(shaderProgramObject_FBO_FboFire, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject_FBO_FboFire);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
//get MVP uniform
mvpUniform_FboFire = gl.getUniformLocation(shaderProgramObject_FBO_FboFire, "u_mvp_matrix");
sampleruniform_FboFire = gl.getUniformLocation(shaderProgramObject_FBO_FboFire, "u_texture_sampler");



////////////
	//shader program1
	shaderProgramObject_normal_FboFire=gl.createProgram();
	gl.attachShader(shaderProgramObject_normal_FboFire, vertexShaderObject_FboFire);
	gl.attachShader(shaderProgramObject_normal_FboFire, fragmentShaderObject1_FboFire);
	
	//pre-link binidng of shader program object with vertex shader attributes
	gl.bindAttribLocation(shaderProgramObject_normal_FboFire, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vPosition");
	//gl.bindAttribLocation(shaderProgramObject_normal, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vColor");
	gl.bindAttribLocation(shaderProgramObject_normal_FboFire, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, "vTexture");
	
	//linking
	gl.linkProgram(shaderProgramObject_normal_FboFire);
	if(!gl.getProgramParameter(shaderProgramObject_normal_FboFire, gl.LINK_STATUS))
	{
		var error1 = gl.getProgramInfoLog(shaderProgramObject_normal_FboFire);
		if(error1.length > 0)
		{
			alert(error1);
			uninitialize();
		}
	}
	//get MVP uniform
	mvpUniformFireFbo = gl.getUniformLocation(shaderProgramObject_normal_FboFire, "u_mvp_matrix");
	sampleruniformFireFbo = gl.getUniformLocation(shaderProgramObject_normal_FboFire, "u_texture_sampler");

	modelMatrixFireUniform = gl.getUniformLocation(shaderProgramObject_normal_FboFire, "u_model_matrix");
	viewMatrixFireUniform = gl.getUniformLocation(shaderProgramObject_normal_FboFire, "u_view_matrix");
	projectionMatrixFireUniform = gl.getUniformLocation(shaderProgramObject_normal_FboFire, "u_projection_matrix");




	pyramid_texture_FboFire = gl.createTexture();
	
	pyramid_texture_FboFire.image = new Image();
	//pyramid_tex.crossOrigin = "anonymous";
	pyramid_texture_FboFire.image.src = "stone.png";
	pyramid_texture_FboFire.image.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, pyramid_texture_FboFire);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pyramid_texture_FboFire.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	//Load cube texture
	cube_texture_FboFire = gl.createTexture();
	cube_texture_FboFire.image = new Image();
	cube_texture_FboFire.image.src = "Fire_Alpha.bmp";
	cube_texture_FboFire.image.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, cube_texture_FboFire);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cube_texture_FboFire.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	

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
	vao_FboFire=gl.createVertexArray();
	gl.bindVertexArray(vao_FboFire);
	vbo_FboFire =  gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_FboFire);
	gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(0,
							3,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	vbo_Color_FboFire = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_Color_FboFire);
	gl.bufferData(gl.ARRAY_BUFFER, triangleTexcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(1,
							2,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(1);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindVertexArray(null);


    /// rectangle
	vao_rectangle_FboFire = gl.createVertexArray();
	gl.bindVertexArray(vao_rectangle_FboFire);
	vbo_rectangle_FboFire = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_rectangle_FboFire);
	gl.bufferData(gl.ARRAY_BUFFER, rectangleVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(0,
							3,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	
	
	vbo_Color_square_FboFire = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_Color_square_FboFire);
	gl.bufferData(gl.ARRAY_BUFFER, rectangleTexcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(2,
							2,
							gl.FLOAT,
							false, 0, 0);
	gl.enableVertexAttribArray(2);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	//gl.enable(gl.TEXTURE_2D);
	// gl.clearColor(0.0,0.0,0.0,1.0);
	// gl.enable(gl.DEPTH_TEST);
	// gl.depthFunc(gl.LEQUAL);





//////////////// FRAMEBUFFER ///////////////////////////

fbo_FboFire = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER,fbo_FboFire);

color_texture_FboFire = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,color_texture_FboFire);

gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1920,1080,0,gl.RGBA,gl.UNSIGNED_BYTE,null);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_texture_FboFire, 0);


		fbo_render_FboFire = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER,fbo_render_FboFire);
		gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,1920,1080);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,fbo_render_FboFire);

		var attachments = [gl.COLOR_ATTACHMENT0];
		gl.drawBuffers(attachments);

		gl.bindFramebuffer(gl.FRAMEBUFFER,null);

		var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
		if (status == gl.FRAMEBUFFER_COMPLETE) {
			console.log("FBO setup succeeded.");
		}
		else {
			console.log("Problem with FBO setup.");
		}

//////////////////////////////




}
  
function initFire()
{

	    initFireFBO();
      loadAllTextures();

var vertexShaderObject;
var fragmentShaderObject;

      	//vertex shaderProgramObject
	var vertexShaderSourceCode =
	"#version 300 es" +
	"\n" +
   	"in vec2 a_position;" +
	"in vec4 a_color;" +
	"in vec2 a_texture_coord;" +
	"out vec4 v_color;" +
	"out vec2 v_texture_coord;" +


	"uniform vec2 u_resolution;" +
	"uniform mat4 u_mvp_matrix;"+

	"void main() {" +

	"vec2 clipSpace = (a_position/u_resolution)*2.0-1.0;" +
	"gl_Position = u_mvp_matrix * vec4(a_position,1.0,1.0);" +
	"v_color = a_color;" +
	"v_texture_coord = a_texture_coord; " +
	"}";
             
	vertexShaderObject=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject);
	if(gl.getShaderParameter(vertexShaderObject,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(vertexShaderObject);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	
	//fragmentShader
	var fragmentShaderSource =
	"#version 300 es" +
	"\n" +
	"precision highp float;" +
	"in vec4 v_color;" +
	"in highp vec2 v_texture_coord;" +
	"out vec4 FragColor;" +
	"uniform sampler2D u_sampler;" +

	"void main() {" +
	
	
	"vec4 texColor = texture(u_sampler,v_texture_coord.xy);" +

	"vec4 finalColor;" +
	"finalColor.r = texColor.r*v_color.r;" +
	"finalColor.g = texColor.g*v_color.g;" +
	"finalColor.b = texColor.b*v_color.b;" +
	"finalColor.a = texColor.a*v_color.a;" +

	"FragColor = finalColor;" +
	"}";


	fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject,fragmentShaderSource);
	gl.compileShader(fragmentShaderObject);
	if(gl.getShaderParameter(fragmentShaderObject,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//shader program
	program_Fire=gl.createProgram();
	gl.attachShader(program_Fire, vertexShaderObject);
	gl.attachShader(program_Fire, fragmentShaderObject);
	
	//pre-link binidng of shader program object with vertex shader attributes
	// gl.bindAttribLocation(program, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vPosition");
	// gl.bindAttribLocation(program, WebGLMacros.AMC_ATTRIBUTE_NORMAL, "vNormal");
	
	//linking
	gl.linkProgram(program_Fire);
	if(!gl.getProgramParameter(program_Fire, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(program_Fire);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 0, 0, 255])); // red

  //gl.clearColor(0.0, 0.0, 0.0, 1.0);

  squareTexCoordsBuffer = gl.createBuffer();
  ColorBuff_Fire = gl.createBuffer();
  vertBuff_Fire = gl.createBuffer();

//   // setup GLSL program
//   vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
//   fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
//   program = createProgram(gl, [vertexShader, fragmentShader]);
  gl.useProgram(program_Fire);

  // look up where the vertex data needs to go.

   gl.bindAttribLocation(program_Fire, 0, "a_position");
  //positionAttrib = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(0);

  gl.bindAttribLocation(program_Fire, 1, "a_color");
  //colorAttrib = gl.getAttribLocation(program, "a_color");
  gl.enableVertexAttribArray(1);


  gl.bindAttribLocation(program_Fire, 2, "a_texture_coord");
 // textureCoordAttribute = gl.getAttribLocation(program, "a_texture_coord");
  gl.enableVertexAttribArray(2);

  // lookup uniforms
  // resolutionLocation = gl.getUniformLocation(program_Fire, "u_resolution");
  // cameraLocation = gl.getUniformLocation(program_Fire, "cam_position");
  texSamplerFire = gl.getUniformLocation(program_Fire, "u_sampler");
  mvpUniformFire = gl.getUniformLocation(program_Fire, "u_mvp_matrix");

  
 // gl.enable(gl.BLEND);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
  gl.useProgram(null);
 
}
function animloop() {
  logic();
  renderFire();
}
// the timing function's only job is to calculate the framerate
frameTime = 18;
lastTime = time();
lastFPSDivUpdate = time();
function timing() {
  currentTime = time();
  frameTime = frameTime * 0.9 + (currentTime - lastTime) * 0.1;
  fps = 1000.0/frameTime;
  if (currentTime - lastFPSDivUpdate > 100) {
    document.getElementById("fps").innerHTML = "FPS: " + Math.round(fps);
    lastFPSDivUpdate = currentTime;
  }
  lastTime = currentTime;
}

function drawFire()
{
  
	
	var modelViewMatrix = mat4.create();
	var modelViewProjectionMatrix = mat4.create();
	

	//cube in framebuffer
	
	gl.bindFramebuffer(gl.FRAMEBUFFER,fbo_FboFire);
	gl.viewport(0,0,1920,1080);
	gl.clearColor(0.0,0.0,0.0,0.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


	animloop();



	gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	gl.useProgram(null);







////////////////////////////////////////////////////////



gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	 gl.enable(gl.BLEND);




	gl.viewport(0,0,gWindowWidth_FboFire,gWindowHeight_FboFire);
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.bindTexture(gl.TEXTURE_2D,color_texture_FboFire);


	modelViewMatrix = mat4.identity(modelViewMatrix);

	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();


	modelViewProjectionMatrix = mat4.identity(modelViewProjectionMatrix);
	mat4.translate(modelMatrix, modelMatrix, [fireTransX, fireTransY, fireTransZ]);
	mat4.scale(modelMatrix, modelMatrix, [fireScale, fireScale, fireScale]);
	// mat4.rotateX(modelViewMatrix,modelViewMatrix,degreeToRadian(gAngleSquare));
	// mat4.rotateY(modelViewMatrix,modelViewMatrix,degreeToRadian(gAngleSquare));
	 mat4.rotateZ(modelMatrix,modelMatrix,deg2rad(180.0));
//	mat4.multiply(modelViewProjectionMatrix, perspectiveMatrix, modelViewMatrix);



	gl.useProgram(shaderProgramObject_normal_FboFire);

	gl.uniformMatrix4fv(modelMatrixFireUniform, false, modelMatrix);
	gl.uniformMatrix4fv(viewMatrixFireUniform, false, gViewMatrix);
	gl.uniformMatrix4fv(projectionMatrixFireUniform, false, perspectiveMatrix);
	//gl.bindTexture(gl.TEXTURE_2D, cube_texture);
	gl.uniform1i(samplerUniformFireFbo, 0);
	gl.bindVertexArray(vao_rectangle_FboFire);
	//gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
	//gl.drawArrays(gl.TRIANGLE_FAN, 4,4);
	//gl.drawArrays(gl.TRIANGLE_FAN, 8,4);
	 gl.drawArrays(gl.TRIANGLE_FAN, 12,4);
	// gl.drawArrays(gl.TRIANGLE_FAN, 16,4);
	// gl.drawArrays(gl.TRIANGLE_FAN, 20,4);
	gl.bindVertexArray(null);



	gl.useProgram(null);








	gl.disable(gl.BLEND);









}

function time() {
  var d = new Date();
  var n = d.getTime();
  return n;
}

var particleDiscrepancy = 0;
var lastParticleTime = time();

var sparkParticleDiscrepancy = 0;

noise.seed(Math.random());

// calculate new positions for all the particles
function logic() {

  var currentParticleTime = time();
  var timeDifference = currentParticleTime - lastParticleTime;

  // we don't want to generate a ton of particles if the browser was minimized or something
  if (timeDifference > 100)
    timeDifference = 100;


  // update fire particles

  particleDiscrepancy += options.fireEmitRate*(timeDifference)/1000.0;
  while (particleDiscrepancy > 0) {
    createFireParticle({x:canvas.width/2,y:canvas.height/2+200});
    particleDiscrepancy -= 1.0;
  }

  particleAverage = {x:0,y:0};
  var numParts = fireParticles.length;
  for (var i = 0; i < numParts; i++) {
    particleAverage.x += fireParticles[i].pos.x/numParts;
    particleAverage.y += fireParticles[i].pos.y/numParts;
  }


  for (var i = 0; i < fireParticles.length; i++) {
    var x = fireParticles[i].pos.x;
    var y = fireParticles[i].pos.y;

    // apply wind to the velocity
    if (options.wind) {
      if (options.omnidirectionalWind)
        fireParticles[i].vel = addVecs(fireParticles[i].vel,scaleVec(unitVec((noise.simplex3(x / 500, y / 500, lastParticleTime*options.windTurbulance)+1.0)*Math.PI),options.windStrength));
      else
        fireParticles[i].vel = addVecs(fireParticles[i].vel,scaleVec(unitVec((noise.simplex3(x / 500, y / 500, lastParticleTime*options.windTurbulance)+1.0)*Math.PI*0.5),options.windStrength));
    }
    // move the particle
    fireParticles[i].pos = addVecs(fireParticles[i].pos,scaleVec(fireParticles[i].vel,timeDifference/1000.0));

    //var offAngle = angleBetweenVecs(fireParticles[i].vel,subVecs(particleAverage,));
    //console.log(offAngle);
  fireParticles[i].color.a -= options.fireDeathSpeed+Math.abs(particleAverage.x-fireParticles[i].pos.x)*options.fireTriangleness;//;Math.abs((fireParticles[i].pos.x-canvas.width/2)*options.fireTriangleness);

    if (fireParticles[i].pos.y <= -fireParticles[i].size.height*2 || fireParticles[i].color.a <= 0)
      markForDeletion(fireParticles,i);
  }
  fireParticles = deleteMarked(fireParticles);

  // update spark particles
  sparkParticleDiscrepancy += options.sparkEmitRate*(timeDifference)/1000.0;
  while (sparkParticleDiscrepancy > 0) {
    createSparkParticle({x:canvas.width/2,y:canvas.height/2+200});
    sparkParticleDiscrepancy -= 1.0;
  }

  for (var i = 0; i < sparkParticles.length; i++) {

    var x = sparkParticles[i].pos.x;
    var y = sparkParticles[i].pos.y;
    sparkParticles[i].vel = addVecs(sparkParticles[i].vel,scaleVec(unitVec((noise.simplex3(x / 500, y / 500, lastParticleTime*0.0003)+1.0)*Math.PI*0.5),20.0));
    sparkParticles[i].pos = addVecs(sparkParticles[i].pos,scaleVec(sparkParticles[i].vel,timeDifference/1000.0));


    sparkParticles[i].color.a -= options.sparkDeathSpeed;

    if (sparkParticles[i].pos.y <= -sparkParticles[i].size.height*2 || sparkParticles[i].color.a <= 0)
      markForDeletion(sparkParticles,i);
  }
  sparkParticles = deleteMarked(sparkParticles);

  //document.getElementById("numParticles").innerHTML = "# particles: " + (fireParticles.length + sparkParticles.length);

  lastParticleTime = currentParticleTime;

}

function renderFire() {
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);
  gl.useProgram(program_Fire);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  // set the resolution
  //gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.uniform1i(texSamplerFire, 0);
  var modelViewMatrix = mat4.create();
  var modelViewProjectionMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-900.0, -600.0, -50.0]);
  // zVal += 0.02;
  // zVal2 -= 0.02;

  var pers = mat4.create();
  mat4.perspective(pers,60.0, parseFloat(canvas.width/canvas.height),0.1, 1000.0);
  mat4.multiply(modelViewProjectionMatrix, pers, modelViewMatrix);
  gl.uniformMatrix4fv(mvpUniformFire,false,modelViewProjectionMatrix);


  drawRects(fireParticles);
  if (options.sparks)
      drawRects(sparkParticles);
      gl.useProgram(null);

    // gl.disable(gl.BLEND);
  //console.log(particleAverage);
}


rectArray = [];
colorArray = [];
rects = [];


function concat_inplace(index,arr1,arr2) {
  for (var i = 0; i < arr2.length; i++) {
    arr1[index] = arr2[i];
    index += 1;
  }
  return index;
}


function drawRects(rects,textureIndex) {
  var index = 0;
  var colorIndex = 0;
  var texIndex = 0;
  rectArray = [];
  colorArray = [];
  textureCoordinates = [];
  for (var i = 0; i < rects.length; i++) {
      var x1 = rects[i].pos.x - rects[i].size.width/2;
      var x2 = rects[i].pos.x + rects[i].size.width/2;
      var y1 = rects[i].pos.y - rects[i].size.height/2;
      var y2 = rects[i].pos.y + rects[i].size.height/2;
      index = concat_inplace(index,rectArray,[
         x1, y1,
         x2, y1,
         x1, y2,
         x1, y2,
         x2, y1,
         x2, y2]);
      texIndex = concat_inplace(texIndex,textureCoordinates,[
         0.0, 0.0,
         1.0, 0.0,
         0.0, 1.0,
         0.0, 1.0,
         1.0, 0.0,
         1.0, 1.0
      ]);
      for (var ii = 0; ii < 6; ii++) {
        colorIndex = concat_inplace(colorIndex,colorArray,[
            rects[i].color.r,
            rects[i].color.g,
            rects[i].color.b,
            rects[i].color.a
          ]);
      }
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[currentTextureIndex]);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareTexCoordsBuffer);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuff_Fire);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectArray), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuff_Fire);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, rects.length*6);
}
