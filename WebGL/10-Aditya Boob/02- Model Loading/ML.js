//global variables
var canvas=null;
var gl=null; //for webgl context
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;
var materials;
var parts;
var material;
var samplerUniform;




const WebGLMacros=
{
	VDG_ATTRIBUTE_VERTEX:0,
	VDG_ATTRIBUTE_COLOR:1,
	VDG_ATTRIBUTE_NORMAL:2,
	VDG_ATTRIBUTE_TEXTURE0:3
};

var vertexShaderObject;
var fragmentShaderObject;
var shaderProgramObject;

var vao;
var vbo;
var vbo_Color;
var vbo_Color_square;
var vao_rectangle;
var vbo_rectangle;
var mvpUniform;
var gAngleTriangle=0.0;
var gAngleSquare=0.0;
var perspectiveProjectionMatrix;


var modelUniform, viewUniform, projectionUniform;
var LightPositionUniform, LKeyPressed ;
var LAUniform, LDUniform, LSUniform;
var KAUniform, KDUniform, KSUniform, MaterialShininessUniform;
var gbLighting=false;
var perspectiveProjectionMatrix;
var light_ambient = [0.0, 0.0, 0.0];
var light_diffuse = [1.0, 1.0, 1.0];
var light_specular = [1.0, 1.0, 1.0];
var light_position = [100.0, 100.0, 100.0,1.0];
	
var material_ambient = [0.0, 0.0, 0.0];
var material_diffuse = [1.0, 1.0, 1.0];
var material_specular = [1.0, 1.0, 1.0];
	
var material_shininess = 50.0;
var sphere=null;




var numElements = [];
var numElementsCounter  =0;
var vao_cube = [];
var vbo_cube_tp ;
    var vbo_cube = [] ;
    var vbo_Normal_cube = [];
    var vbo_TexCoord_cube = [];
    var vbo_color_cube = [];
var positionArray = [];

var programObj;



//To start animation
var requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame||
							window.mozRequestAnimationFrame||
							window.oRequestAnimationFrame||
							window.msRequestAnimationFrame;

//To stop animation
var cancelAnimationFrage = 
			window.cancelAnimationFrame||
			window.webkitCancelRequestAnimationFrame||
			window.webkitCancelAnimationFrame||
			window.mozCancelRequestAnimationFrame||
			window.mozCancelAnimationFrame||
			window.oCancelRequestAnimationFrame||
			window.oCancelAnimationFrame||
			window.msCancelRequestAnimationFrame||
			window.msCancelAnimationFrame;
			



function parseOBJ(text) {
				// because indices are base 1 let's just fill in the 0th data
				const objPositions = [[0, 0, 0]];
				const objTexcoords = [[0, 0]];
				const objNormals = [[0, 0, 0]];
				const objColors = [[0, 0, 0]];
			  
				// same order as `f` indices
				const objVertexData = [
				  objPositions,
				  objTexcoords,
				  objNormals,
				  objColors,
				];
			  
				// same order as `f` indices
				let webglVertexData = [
				  [],   // positions
				  [],   // texcoords
				  [],   // normals
				  [],   // colors
				];
			  
				const materialLibs = [];
				const geometries = [];
				let geometry;
				let groups = ['default'];
				let material = 'default';
				let object = 'default';
			  
				const noop = () => {};
			  
				function newGeometry() {
				  // If there is an existing geometry and it's
				  // not empty then start a new one.
				  if (geometry && geometry.data.position.length) {
					geometry = undefined;
				  }
				}
			  
				function setGeometry() {
				  if (!geometry) {
					const position = [];
					const texcoord = [];
					const normal = [];
					const color = [];
					webglVertexData = [
					  position,
					  texcoord,
					  normal,
					  color,
					];
					geometry = {
					  object,
					  groups,
					  material,
					  data: {
						position,
						texcoord,
						normal,
						color,
					  },
					};
					geometries.push(geometry);
				  }
				}
			  
				function addVertex(vert) {
				  const ptn = vert.split('/');
				  ptn.forEach((objIndexStr, i) => {
					if (!objIndexStr) {
					  return;
					}
					const objIndex = parseInt(objIndexStr);
					const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
					webglVertexData[i].push(...objVertexData[i][index]);
					// if this is the position index (index 0) and we parsed
					// vertex colors then copy the vertex colors to the webgl vertex color data
					if (i === 0 && objColors.length > 1) {
					  geometry.data.color.push(...objColors[index]);
					}
				  });
				}
			  
				const keywords = {
				  v(parts) {
					// if there are more than 3 values here they are vertex colors
					if (parts.length > 3) {
					  objPositions.push(parts.slice(0, 3).map(parseFloat));
					  objColors.push(parts.slice(3).map(parseFloat));
					} else {
					  objPositions.push(parts.map(parseFloat));
					}
				  },
				  vn(parts) {
					objNormals.push(parts.map(parseFloat));
				  },
				  vt(parts) {
					// should check for missing v and extra w?
					objTexcoords.push(parts.map(parseFloat));
				  },
				  f(parts) {
					setGeometry();
					const numTriangles = parts.length - 2;
					for (let tri = 0; tri < numTriangles; ++tri) {
					  addVertex(parts[0]);
					  addVertex(parts[tri + 1]);
					  addVertex(parts[tri + 2]);
					}
				  },
				  s: noop,    // smoothing group
				  mtllib(parts, unparsedArgs) {
					// the spec says there can be multiple filenames here
					// but many exist with spaces in a single filename
					materialLibs.push(unparsedArgs);
				  },
				  usemtl(parts, unparsedArgs) {
					material = unparsedArgs;
					newGeometry();
				  },
				  g(parts) {
					groups = parts;
					newGeometry();
				  },
				  o(parts, unparsedArgs) {
					object = unparsedArgs;
					newGeometry();
				  },
				};
			  
				const keywordRE = /(\w*)(?: )*(.*)/;
				const lines = text.split('\n');
				for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
				  const line = lines[lineNo].trim();
				  if (line === '' || line.startsWith('#')) {
					continue;
				  }
				  const m = keywordRE.exec(line);
				  if (!m) {
					continue;
				  }
				  const [, keyword, unparsedArgs] = m;
				  const parts = line.split(/\s+/).slice(1);
				  const handler = keywords[keyword];
				  if (!handler) {
					console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
					continue;
				  }
				  handler(parts, unparsedArgs);
				}
			  
				// remove any arrays that have no entries.
				for (const geometry of geometries) {
				  geometry.data = Object.fromEntries(
					  Object.entries(geometry.data).filter(([, array]) => array.length > 0));
				}
			  console.log("no of geometries" +geometries);
				return {
				  geometries,
				  materialLibs,
				};
}			

function parseMapArgs(unparsedArgs) {
	// TODO: handle options
	return unparsedArgs;
  }
  
  function parseMTL(text) {
	const materials = {};
	let material;
  
	const keywords = {
	  newmtl(parts, unparsedArgs) {
		material = {};
		materials[unparsedArgs] = material;
	  },
	  /* eslint brace-style:0 */
	  Ns(parts)       { material.shininess      = parseFloat(parts[0]); },
	  Ka(parts)       { material.ambient        = parts.map(parseFloat); },
	  Kd(parts)       { material.diffuse        = parts.map(parseFloat); },
	  Ks(parts)       { material.specular       = parts.map(parseFloat); },
	  Ke(parts)       { material.emissive       = parts.map(parseFloat); },
	  map_Kd(parts, unparsedArgs)   { material.diffuseMap = parseMapArgs(unparsedArgs); },
	  map_Ns(parts, unparsedArgs)   { material.specularMap = parseMapArgs(unparsedArgs); },
	  map_Bump(parts, unparsedArgs) { material.normalMap = parseMapArgs(unparsedArgs); },
	  Ni(parts)       { material.opticalDensity = parseFloat(parts[0]); },
	  d(parts)        { material.opacity        = parseFloat(parts[0]); },
	  illum(parts)    { material.illum          = parseInt(parts[0]); },
	};
  
	const keywordRE = /(\w*)(?: )*(.*)/;
	const lines = text.split('\n');
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
	  const line = lines[lineNo].trim();
	  if (line === '' || line.startsWith('#')) {
		continue;
	  }
	  const m = keywordRE.exec(line);
	  if (!m) {
		continue;
	  }
	  const [, keyword, unparsedArgs] = m;
	  const parts = line.split(/\s+/).slice(1);
	  const handler = keywords[keyword];
	  if (!handler) {
		console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
		continue;
	  }
	  handler(parts, unparsedArgs);
	}
  
	return materials;
  }
  
  function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
  }
  
  function create1PixelTexture(gl, pixel) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
				  new Uint8Array(pixel));
	return texture;
  }
  
  function createTexture(gl, url) {
	const texture = create1PixelTexture(gl, [128, 192, 255, 255]);
	// Asynchronously load an image
	const image = new Image();
	image.src = url;
	image.addEventListener('load', function() {
	  // Now that the image has loaded make copy it to the texture.
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  
	  // Check if the image is a power of 2 in both dimensions.
	  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		 // Yes, it's a power of 2. Generate mips.
		 gl.generateMipmap(gl.TEXTURE_2D);
	  } else {
		 // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  }
	});
	return texture;
  }
  
  
async function loadModel()
{
	const objHref = 'car.obj';  /* webglfundamentals: url */
  const response = await fetch(objHref);
  const text = await response.text();
  const obj = parseOBJ(text);
  console.log(obj.geometries.length);
  const baseHref = new URL(objHref, window.location.href);
  const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
    const matHref = new URL(filename, baseHref).href;
    const response = await fetch(matHref);
    return await response.text();
  }));

   materials = parseMTL(matTexts.join('\n'));

   const textures = {
    defaultWhite: create1PixelTexture(gl, [255, 255, 255, 255]),
  };

  // load texture for materials
  for (material of Object.values(materials)) {
    Object.entries(material)
      .filter(([key]) => key.endsWith('Map'))
      .forEach(([key, filename]) => {
        let texture = textures[filename];
        if (!texture) {
          const textureHref = new URL(filename, baseHref).href;
          texture = createTexture(gl, textureHref);
          textures[filename] = texture;
        }
        material[key] = texture;
      });
  }

   const defaultMaterial = {
    diffuse: [1, 1, 1],
    diffuseMap: textures.defaultWhite,
    ambient: [0, 0, 0],
    specular: [1, 1, 1],
    shininess: 400,
    opacity: 1,
  };

  //diffuseMap: textures.defaultWhite,

  parts = obj.geometries.map(({material, data}) => {
    if (data.color) {
      if (data.position.length === data.color.length) {
        // it's 3. The our helper library assumes 4 so we need
        // to tell it there are only 3.
        data.color = { numComponents: 3, data: data.color };
      }
    } else {
      // there are no vertex colors so just use constant white
      data.color = { value: [1, 1, 1, 1] };
    }

    // create a buffer for each array by calling
    // gl.createBuffer, gl.bindBuffer, gl.bufferData
    const bufferInfo = null; //webglUtils.createBufferInfoFromArrays(gl, data);


    var length = vao_cube.length + 1;
    var vboLength = vbo_cube.length + 4;
    for(var i = vao_cube.length; i < length;i ++)
    {        
        vao_cube[i]=gl.createVertexArray();

        gl.bindVertexArray(vao_cube[i]);
        
        var j = vbo_cube.length;
        {

          vbo_cube[j] =  gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vbo_cube[j]);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.position), gl.STATIC_DRAW);
          gl.vertexAttribPointer(0,
                      3,
                      gl.FLOAT,
                      false, 0, 0);
          gl.enableVertexAttribArray(0);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);

          j +=1;
          vbo_cube[j] =  gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER,  vbo_cube[j]);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.normal), gl.STATIC_DRAW);
          gl.vertexAttribPointer(1,3,gl.FLOAT,false, 0, 0);
          gl.enableVertexAttribArray(1);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);


          j +=1;
          vbo_cube[j] =  gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER,  vbo_cube[j]);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.texcoord), gl.STATIC_DRAW);
          gl.vertexAttribPointer(2,
                      2,
                      gl.FLOAT,
                      false, 0, 0);
          gl.enableVertexAttribArray(2);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
          
          j += 1;        
          vbo_cube[j] =  gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vbo_cube[j]);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.color), gl.STATIC_DRAW);
          gl.vertexAttribPointer(3,
                      4,
                      gl.FLOAT,
                      false, 0, 0);
         // gl.enableVertexAttribArray(3);
          gl.bindVertexArray(null);
        }
    }
    vbo_cube_tp = gl.createBuffer();
    // vbo_Normal_cube =  gl.createBuffer();
    // vbo_TexCoord_cube =  gl.createBuffer();
    // vbo_color_cube =  gl.createBuffer();
    GetIndicesAndElements(gl,data);

    return {
      material: {
        ...defaultMaterial,
        ...materials[material],
      }
    };
  });

  


  function GetIndicesAndElements(gl,arrays)
  {
   
     let indices = arrays.indices;
    if (indices) {
     //  indices = makeTypedArray(indices, 'indices');
     //  bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
     //  bufferInfo.numElements = indices.length;
    } else {
     numElements[numElementsCounter] = getNumElementsFromNonIndexedArrays(arrays);
     numElementsCounter += 1;
     console.log(numElements);
    }
  }

  function getNumElementsFromNonIndexedArrays(arrays) {
      
 const positionKeys = ['position', 'positions', 'a_position'];
   let key;
   for (const k of positionKeys) {
     if (k in arrays) {
       key = k;
       break;
     }
   }
   key = key || Object.keys(arrays)[0];
   const array = arrays[key];
   const length = getArray(array).length;
   const numComponents = getNumComponents(array, key);
   const numElements = length / numComponents;
   if (length % numComponents > 0) {
     throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
   }
   return numElements;
 }

 function getArray(array) {
   return array.length ? array : array.data;
 }
 

 function guessNumComponentsFromName(name, length) {
   const texcoordRE = /coord|texture/i;
 const colorRE = /color|colour/i;
   let numComponents;
   if (texcoordRE.test(name)) {
     numComponents = 2;
   } else if (colorRE.test(name)) {
     numComponents = 4;
   } else {
     numComponents = 3;  // position, normals, indices ...
   }

   if (length % numComponents > 0) {
     throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
   }

   return numComponents;
 }

 function getNumComponents(array, arrayName) {
   return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
 }



}
//on body load function
async function main()
{
	//get canvas elementFromPoint
	canvas = document.getElementById("AMC");
	if(!canvas)
		console.log("Obtaining canvas from main document failed\n");
	else
		console.log("Obtaining canvas from main document succeeded\n");
	//print obtained canvas width and height on console
	console.log("Canvas width:" + canvas.width +" height:" +canvas.height);
	canvas_original_width = canvas.width;
	canvas_original_height = canvas.height;
	
	
	//register keyboard and mouse event with window class
	window.addEventListener("keydown", keydown, false);
	//window.addEventListener("click", mouseDown, false);
	window.addEventListener("resize", resize, false);
	
	loadModel();

	init();
	resize();
	draw();
}

function init(){
	//Get OpenGL context
	gl=canvas.getContext("webgl2");
	if(gl == null)
		console.log("Obtaining 2D webgl2 failed\n");
	else
		console.log("Obtaining 2D webgl2 succeeded\n");
	
	gl.viewportWidth  = canvas.width;
	gl.viewportHeight  = canvas.height;
	
	//vertex shaderProgramObject
	var vertexShaderSourceCode =
	"#version 300 es"+
	"\n" +
  "     layout(location  = 0)in vec4 vPosition;" +
		"layout(location  = 1)in vec3 vNormal;" +
		"layout(location = 2)in vec2 vTexCoord;" +
		"out vec2 out_TexCoord;" +
		"uniform mat4 u_modelMatrix;" +
		"uniform mat4 u_viewMatrix;" +
		"uniform mat4 u_projectionMatrix;" +
		"uniform mediump int u_LKeyPressed;" +
		"out vec3 tNorm;" +
		"out vec3 light_direction;" +
		"out vec3 viewVector;" +
		"uniform vec4 u_LightPosition;" +
		

		"void main(void)" +
		"{" +
		"if(u_LKeyPressed == 1)" +
		"{" +
		"vec4 eye_coordinates = u_viewMatrix * u_modelMatrix *  vPosition;" +
		"tNorm = mat3(u_viewMatrix * u_modelMatrix) * vNormal;" +
		"light_direction = vec3(u_LightPosition - eye_coordinates);" +
		"viewVector = vec3(-eye_coordinates.xyz);" +
		"}" +
		"gl_Position = u_projectionMatrix * u_viewMatrix *u_modelMatrix * vPosition;" +
		"out_TexCoord = vTexCoord;" +
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
	"#version 300 es"+
	"\n"+
	"precision highp  float;" +
	"in vec2 out_TexCoord;" +
		"in vec3 tNorm;" +
		"in vec3 light_direction;" +
		"in vec3 viewVector;" +
		"vec3 phongADSLight;" +
		"uniform vec3 u_LDUniform;" +
		"uniform vec3 u_LAUniform;" +
		"uniform vec3 u_LSUniform;" +
		"uniform vec3 u_KDUniform;" +
		"uniform vec3 u_KAUniform;" +
		"uniform vec3 u_KSUniform;" +
		"uniform float u_MaterialShininess;" +
		"out vec4 FragColor;" +
		"uniform mediump int u_LKeyPressed;" +
		"uniform highp sampler2D diffuseMap; " +
		"void main(void)" +
		"{" +
		
		"if(u_LKeyPressed == 1)" +
		"{" +
		"vec3 normalizedTNorm = normalize(tNorm);" +
		"vec3 normalizedLightDirection = normalize(light_direction);" +
		"vec3 normalizedViewVector = normalize(viewVector);" +
		"float tNormal_dot_lightDirection = max(dot(normalizedLightDirection,normalizedTNorm),0.0);" +
		"vec3 reflectionVector = reflect(-normalizedLightDirection,normalizedTNorm);" +
		"vec3 ambient = u_LAUniform * u_KAUniform;" +
		"vec3 diffuse = u_LDUniform * u_KDUniform * tNormal_dot_lightDirection;" +
		"vec3 specular = u_LSUniform * u_KSUniform * pow(max(dot(reflectionVector,normalizedViewVector),0.0),u_MaterialShininess);" +
		"phongADSLight = ambient + diffuse + specular;" +
		"}" +
		"else" +
		"{" +
		"phongADSLight = vec3(1.0,1.0,1.0);" +
		"}" +
		"vec4 color = texture(diffuseMap, out_TexCoord);" +
		"FragColor =  vec4((vec3(color) * phongADSLight) , 1.0);;" +
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
	shaderProgramObject=gl.createProgram();
	gl.attachShader(shaderProgramObject, vertexShaderObject);
	gl.attachShader(shaderProgramObject, fragmentShaderObject);
	
	//pre-link binidng of shader program object with vertex shader attributes
	gl.bindAttribLocation(shaderProgramObject, WebGLMacros.VDG_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(shaderProgramObject, WebGLMacros.VDG_ATTRIBUTE_NORMAL, "vNormal");
	
	//linking
	gl.linkProgram(shaderProgramObject);
	if(!gl.getProgramParameter(shaderProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//get MVP uniform
	modelUniform = gl.getUniformLocation(shaderProgramObject, "u_modelMatrix");
	viewUniform = gl.getUniformLocation(shaderProgramObject, "u_viewMatrix");
	projectionUniform = gl.getUniformLocation(shaderProgramObject, "u_projectionMatrix");
	LKeyPressed = gl.getUniformLocation(shaderProgramObject, "u_LKeyPressed");
	LAUniform = gl.getUniformLocation(shaderProgramObject, "u_LAUniform");		
	LDUniform = gl.getUniformLocation(shaderProgramObject, "u_LDUniform");
	LSUniform = gl.getUniformLocation(shaderProgramObject, "u_LSUniform");
	
	KAUniform = gl.getUniformLocation(shaderProgramObject, "u_KAUniform");
	KDUniform = gl.getUniformLocation(shaderProgramObject, "u_KDUniform");
	KSUniform = gl.getUniformLocation(shaderProgramObject, "u_KSUniform");
	
	LightPositionUniform = gl.getUniformLocation(shaderProgramObject, "u_LightPosition");
	MaterialShininessUniform = gl.getUniformLocation(shaderProgramObject, "u_MaterialShininess");
	samplerUniform = gl.getUniformLocation(shaderProgramObject, "diffuseMap");



	// sphere = new Mesh();
	// makeSphere(sphere,2.0,30,30);
	

	gl.clearColor(0.0,1.0,0.0,1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL)
	perspectiveProjectionMatrix =  mat4.create();
}

function resize()
{
	if(bFullscreen == true)
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;		
	}else
	{
		canvas.width = canvas_original_width;
		canvas.height = canvas_original_height;
	}
	
	//projection	
	//if(canvas.width <= canvas.height)
	//{
	//	mat4.ortho(orthographicProjectionMatrix, -100.0, 100.0, (-100.0 * (canvas.height/canvas.width)),
	//	(100.0 * (canvas.height/canvas.width)),-100.0, 100.0);		
	//}else
	//{
	//	mat4.ortho(orthographicProjectionMatrix, -100.0, 100.0, (-100.0 * (canvas.width/canvas.height)),
	//	(100.0 * (canvas.width/canvas.height)),-100.0, 100.0);		
    //}



	mat4.perspective(perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width/canvas.height),0.1, 1000.0);	
	gl.viewport(0,0,canvas.width,canvas.height);
}

function draw()
{
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shaderProgramObject);
	//lighting details
	
	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();
	
	//var angleInRadian = degreeToRadian(gAngle);
	mat4.translate(modelMatrix, modelMatrix, [0.0,0.0,-20.0]);
	mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle));
	
	gAngleTriangle += 0.02;
	//mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle));
	//mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);
	gl.uniformMatrix4fv(modelUniform,false,modelMatrix);
	gl.uniformMatrix4fv(viewUniform,false,viewMatrix);
	gl.uniformMatrix4fv(projectionUniform,false,perspectiveProjectionMatrix);
	
	if(parts)
	{
		

		for(var i = 0; i < parts.length;i++)
		{

			if(gbLighting){
				gl.uniform1i(LKeyPressed, 1);
				gl.uniform3fv(LAUniform, light_ambient);
				gl.uniform3fv(LDUniform, light_diffuse);
				gl.uniform3fv(LSUniform, light_specular);
				
				gl.uniform4fv(LightPositionUniform, light_position);
				
				//set material properties
				gl.uniform3fv(KAUniform, parts[i].material.ambient);
				gl.uniform3fv(KDUniform, parts[i].material.diffuse);
				gl.uniform3fv(KSUniform, parts[i].material.specular);
				gl.uniform1f(MaterialShininessUniform,parts[i].material.shininess);
				
				}
				else
				{
						gl.uniform1i(LKeyPressed, 0);
				}
			gl.bindTexture(gl.TEXTURE_2D, parts[i].material.diffuseMap);

				gl.bindVertexArray(vao_cube[i]);
		
				gl.drawArrays(gl.TRIANGLES,0,numElements[i]);
		}
        
	}
	
	gl.useProgram(null);




	requestAnimationFrame(draw,canvas);
	console.log(i);
	
	if( gAngleTriangle >= 360.0)
			gAngleTriangle = 0.0;
		else
			gAngleTriangle = gAngleTriangle + 1.0;
	
	if( gAngleSquare >= 360.0)
			gAngleSquare = 0.0;
		else
			gAngleSquare = gAngleSquare + 1.0;
}
function degreeToRadian(angleInDegree)
{
	return (angleInDegree *  Math.PI/ 180);
}
function toggleFullScreen()
{
	//code
	var fullScreen_element = 
		document.fullscreenElement||
		document.webkitFullscreenElement||
		document.mozFullScreenElement||
		document.msFullscreenElement||
		null;
		
	//if not full screen
	if(fullScreen_element == null)
	{
		if(canvas.requestFullscreen)
			canvas.requestFullscreen();
		else if(canvas.mozRequestFullScreen)
			canvas.mozRequestFullScreen();
		else if(canvas.webkitRequestFullscreen)
			canvas.webkitRequestFullscreen();
		else if(canvas.msRequestFullscreen)
		    canvas.msRequestFullscreen();
		bFullscreen = true;
	}
	else //restore from fullscreen
	{
			if(document.exitFullscreen)
				document.exitFullscreen();
			else if(document.mozCancelFullScreen)
				document.mozCancelFullScreen();
			else if(document.webkitExitFullscreen)
				document.webkitExitFullscreen();
			else if(document.msExitFullscreen)
			    document.msExitFullscreen();
			bFullscreen = false;

	}
}

function keydown(event)
{
	switch(event.keyCode)
	{
		case 27://Esc
			uninitialize();
			window.close();
			break;
			case 76:
		case 108:
				if(gbLighting)
					gbLighting = false;
				else
					gbLighting = true;
			break;
		case 70: //for 'F' or 'f'
			toggleFullScreen();			
			break;
	}
}

function mouseDown()
{
	alert("Mouse is clicked");
}

function uninitialize()
{
	if(vao)
	{
		gl.deleteVertexArray(vao);
		vao = null;
	}
	
	if(vbo)
	{
		gl.deleteBuffer(vbo);
		vbo=null;
	}
	
	if(shaderProgramObject)
	{
		if(fragmentShaderObject)
		{
			gl.detachShader(shaderProgramObject, fragmentShaderObject);
			fragmentShaderObject = null;
		}
		
		if(vertexShaderObject)
		{
			gl.detachShader(shaderProgramObject, vertexShaderObject);
			vertexShaderObject = null;
		}
		gl.deleteProgram(shaderProgramObject);
		shaderProgramObject = null;
	}
}